import React from "react"
import { TInputItemProps } from "./InputItem";
import { TInputItemMinMax } from "../../../../models/simple";
import { NumericInput } from "../../util/NumericInput";

export const MinMaxInput: React.FC<TInputItemProps<TInputItemMinMax>> = ({ label, value, onChange, step }) => {
  const updateValue = (number: number, index: number) => {
    const newValues = [...value]
    newValues[index] = Number.isNaN(number) ? -1 : number
    onChange(newValues)
  }

  const convertValue = (number: number) => {
    if (number === -1) return NaN
    return number
  }

  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <NumericInput
          placeholder="Min"
          step={step}
          className="min-w-0"
          value={convertValue(value[0])}
          onChange={(value) => updateValue(value, 0)}
        />

        <NumericInput
          placeholder="Max"
          step={step}
          className="min-w-0"
          value={convertValue(value[1])}
          onChange={(value) => updateValue(value, 1)}
        />
      </div>
    </div>
  )
}
