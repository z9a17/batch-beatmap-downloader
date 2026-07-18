import { cloneDeep } from "lodash"
import React, { useEffect, useState } from "react"
import { Group, Node } from "../../../models/filter"
import {
  sections,
  InputType,
  TInputItem,
  Section,
  keyMap,
  getValue,
  convertTreeToSimpleMode,
  treeIsCompatibleWithSimpleMode,
  convertTreeToText,
  getType,
  DropdownValue,
  textAliasMap,
  valueMap,
  aboveSection
} from "../../../models/simple"
import InputItem from "./simple/InputItem"
import { nanoid } from 'nanoid'
import { Input } from "../util/Input"
import classNames from "classnames"

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
}

type Value = string | boolean | number[] | DropdownValue | undefined

export const SimpleFilter: React.FC<PropTypes> = ({ tree, updateTree }) => {
  const [section, setSection] = useState<Section>(sections[0])
  const [textInput, setTextInput] = useState(convertTreeToText(tree))

  useEffect(() => {
    if (tree.group && !treeIsCompatibleWithSimpleMode(tree.group)) {
      const newTree = convertTreeToSimpleMode(tree.group)
      updateTree(newTree)
    }
  }, [])

  const handleChange = (value: Value, item: TInputItem) => {
    const currentValue = getValue(tree, item)

    switch (item.type) {
      case InputType.SLIDER:
      case InputType.MIN_MAX:
        const [newMin, newMax] = value as number[]
        const [currentMin, currentMax] = currentValue as number[]
        const [defaultMin, defaultMax] = item.defaultValue

        if (newMin >= 0 && newMin !== currentMin) updateValuePair(item.key, ">=", newMin.toString())
        if (newMax >= 0 && newMax !== currentMax) updateValuePair(item.key, "<=", newMax.toString())

        if (newMin === defaultMin && newMin !== currentMin) removeRule(item, ">")
        if (newMax === defaultMax && newMax !== currentMax) removeRule(item, "<")
        break
      case InputType.TEXT:
        const string = value as string
        if (!string) {
          removeRule(item, "like")
          break
        }

        if (string !== (currentValue as string)) updateValuePair(item.key, "like", string)
        break
      case InputType.DROPDOWN:
        const { option, not } = value as DropdownValue
        const { option: currentOption, not: currentNot } = currentValue as DropdownValue
        if (option.value !== currentOption.value || not != currentNot) {
          updateValuePair(item.key, not ? "!=" : "=", option.value)
        }

        if (!not && option.value === item.defaultValue.option.value) {
          removeRule(item, "=")
        }

        break
      case InputType.SWITCH:
        const boolean = value as boolean | undefined
        const operator = boolean ? "=" : "!="

        if (boolean === undefined) removeRule(item, "=");
        else updateValuePair(item.category, operator, item.key)
        break
    }
  }

  const updateValuePair = (type: string, symbol: string, value: string, state?: Node) => {
    const clone = cloneDeep(state ? state : tree)
    if (!clone.group) return

    const realKey = keyMap.get(type.toLowerCase())
    if (!realKey) return clone

    const realValue = valueMap.get(value) ?? value

    const children = clone.group.children.filter(child => {
      if (realKey === "Special") {
        if (child?.rule?.value !== realValue) return true
        if (symbol === "=" && child?.rule?.operator === "!=") return false
        if (symbol === "!=" && child?.rule?.operator === "=") return false
      }

      if (type !== child?.rule?.field) return true
      if (symbol === ">=" && child?.rule?.operator === ">") return false
      if (symbol === "<=" && child?.rule?.operator === "<") return false
      return true;
    })

    clone.group.children = children
    updateTree(clone.group)

    for (const child of children) {
      const rule = child.rule
      if (!rule) continue
      if (rule.field === "Special") continue

      if (rule.field === realKey && rule.operator === symbol) {
        if (rule.value === realValue) return clone
        rule.value = realValue
        setTextInput(convertTreeToText(clone))
        updateTree(clone.group)
        return clone
      }
    }

    if (realKey === "Special" && children.some(child => child.rule?.value.toLowerCase() === value.toLowerCase())) return clone

    const newRule: Node = { id: nanoid(), rule: { field: realKey, value: realValue, operator: symbol, type: getType(realKey) } }
    clone.group.children.push(newRule)
    updateTree(clone.group)
    setTextInput(convertTreeToText(clone))
    return clone
  }

  const removeRule = (item: TInputItem, operator: string) => {
    const clone = cloneDeep(tree)
    if (!clone.group) return
    clone.group.children = clone.group.children.filter(child => {
      if (item.type === "switch") return item.key !== child?.rule?.value
      return item.key !== child?.rule?.field || !child?.rule?.operator.includes(operator)
    })
    updateTree(clone.group)
    setTextInput(convertTreeToText(clone))
  }

  const handleTextChange = (text: string) => {
    const terms = text.toLowerCase().split(" ")
    const contents: { type: string, symbol: string, value: string }[] = []
    let state: Node | undefined = cloneDeep(tree)

    for (const term of terms) {
      if (term.match(/^\w*(<|<=|>|>=|==|=|!=)\d+\.?\d*$/g)) { // numeric
        const type = (term.match(/^\w+/g) ?? ["stars"])[0] // gets the word before operator
        const symbol = (term.match(/(<=|<|>=|>|==|=|!=)/g) ?? ">=")[0] // gets operator
        const value = (term.match(/\d+\.?\d*$/g) ?? ["0"])[0] // gets number after operator
        contents.push({ type, symbol, value })
        state = updateValuePair(type, symbol, value, state)
      } else if (term.match(/^\w*(==|=|!=)\w+$/g)) { // text
        const type = (term.match(/^\w+/g) ?? ["status"])[0] // gets the word before operator
        const symbol = (term.match(/(==|=|!=)/g) ?? ["="])[0] // gets operator
        const value = (term.match(/\w+$/g) ?? ["r"])[0] // gets word after operator
        const aliasedType = textAliasMap.get(type) ?? type
        const aliasedValue = textAliasMap.get(value) ?? value
        contents.push({ type: aliasedType, symbol, value: aliasedValue })
        state = updateValuePair(aliasedType, symbol, aliasedValue, state)
      }
    }

    if (!state || !state.group) return
    const children = state.group.children.filter(child => {
      for (const content of contents) {
        const rule = child.rule
        if (!rule) return true
        if (
          rule.field.toLowerCase() === content.type.toLowerCase() &&
          rule.operator === content.symbol &&
          rule.value.toLowerCase() === content.value.toLowerCase()
        ) return true
      }

      return false
    }) ?? []

    setTextInput(text)
    updateTree({
      ...state.group,
      children
    })
  }

  return (
    <div className="border-y border-[#303c4d]">
      <div className="border-b border-[#303c4d] py-5">
        <label className="field-label mb-2 block">Quick syntax</label>
        <Input
          className="text-[13px]"
          placeholder="Try: status=r mode=o stars>=6 ar>=9.5"
          value={textInput}
          onChange={handleTextChange}
        />
        <div className="mt-2 text-[13px] leading-5 text-[#a4b0c2]">Changes here stay synchronized with the visual controls below.</div>
      </div>

      <div className="grid grid-cols-[190px_minmax(0,1fr)]">
        <div className="border-r border-[#303c4d] py-4 pr-4">
          <div className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.12em] text-[#96a2b5]">Filter groups</div>
          {sections.map(item => (
            <button
              key={item.title}
              className={classNames(
                "mb-1 w-full border-l-2 px-3 py-2.5 text-left text-xs font-semibold transition",
                section.title === item.title
                  ? "border-blue-500 bg-blue-500/[0.04] text-blue-200"
                  : "border-transparent text-[#9aa6b8] hover:bg-white/[0.02] hover:text-white",
              )}
              onClick={() => setSection(item)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="py-5 pl-6">
          <div className="mb-5 grid grid-cols-2 gap-x-6">
            {aboveSection.items.map(item => (
              <div key={item.key}>
                <InputItem {...item} onChange={(value) => handleChange(value, item)} value={getValue(tree, item)} />
              </div>
            ))}
          </div>
          <div className="mb-3 flex items-center justify-between border-t border-[#334055] pt-5">
            <div>
              <div className="text-sm font-semibold text-white">{section.title}</div>
              <div className="mt-1 text-[13px] leading-5 text-[#a4b0c2]">Only adjusted values become active rules.</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6">
            {section.items.map(item => (
              <div key={item.key}>
                <InputItem {...item} onChange={(value) => handleChange(value, item)} value={getValue(tree, item)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
