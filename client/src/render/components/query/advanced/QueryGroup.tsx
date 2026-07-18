import { FilterRule } from "./Rule";
import { ConnectorDetails, Group, Node } from "../../../../models/filter";
import { RuleType, Rule } from "../../../../models/rules";
import { Connector } from "./Connector";
import React from "react";
import { nanoid } from 'nanoid';
import { cloneDeep } from "lodash";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface PropTypes {
  group: Group;
  id: string;
  updateParent: (group: Group, id: string) => void;
}

const defaultRule = {
  id: nanoid(),
  rule: {
    type: RuleType.STATUS,
    value: "ranked",
    operator: "=",
    field: "Approved",
  },
};

const defaultGroup = {
  id: nanoid(),
  group: {
    connector: {
      type: "AND",
      not: [],
    },
    children: [],
  },
};

export const QueryGroup = ({ group, id, updateParent }: PropTypes) => {
  const updateGroup = (child: Group | Rule, childId: string) => {
    updateParent({
      ...group,
      children: group.children.map((node) => {
        if (node.id === childId) {
          if ("children" in child) {
            return { ...node, group: child };
          } else {
            return { ...node, rule: child };
          }
        }
        return node;
      }),
    }, id);
  };

  const updateConnector = (connector: ConnectorDetails) => {
    updateParent({
      ...group,
      connector,
    }, id);
  };

  const getLastRule = () => {
    const lastRule = group.children.filter((node) => "rule" in node).pop();
    if (lastRule) {
      return lastRule;
    }
    return defaultRule;
  };

  const addChild = (child: Node) => {
    child.id = nanoid();
    if (child.group) {
      const rule = cloneDeep(defaultRule);
      rule.id = nanoid();
      child.group.children.push(rule);
    }

    updateParent({
      ...group,
      children: [...group.children, child],
    }, id);
  };

  const removeChild = (childId: string) => {
    updateParent({
      ...group,
      children: group.children.filter((node) => node.id !== childId),
    }, id);
  };

  return (
    <div className="flex w-full overflow-hidden rounded-2xl border border-[#262e48] bg-[#0d111e]">
      <div className="w-1 shrink-0 bg-gradient-to-b from-violet-500 to-cyan-400" />
      <div className="w-full p-4">
        <div className="flex w-full flex-col">
          {group.children.map((child, index) => (
            <div key={child.id}>
              {index == 0 ? null : (
                <Connector id={child.id} details={group.connector} update={updateConnector} />
              )}
              {child.group ? (
                <div className="flex items-start">
                  <QueryGroup
                    group={child.group}
                    id={child.id}
                    updateParent={(child, id) => updateGroup(child, id)}
                  />
                  <RemoveCircleIcon
                    onClick={() => removeChild(child.id)}
                    className="-ml-4 -mt-3 cursor-pointer rounded-full bg-[#0d111e] text-rose-400 transition hover:text-rose-300"
                    fontSize="large"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FilterRule
                    rule={child?.rule??null}
                    id={child.id}
                    updateParent={(rule, id) => updateGroup(rule, id)}
                  />
                  {(id != "root" || index != 0) && (
                    <CancelOutlinedIcon
                      onClick={() => removeChild(child.id)}
                      className="cursor-pointer text-[#59627b] transition hover:text-rose-300"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="mt-4 flex items-center gap-2 border-t border-[#1d2438] pt-4">
            <button
              onClick={() => addChild(cloneDeep(getLastRule()))}
              className="button-secondary min-h-[36px] rounded-[10px] px-3 text-xs font-semibold"
            >
              + Add Rule
            </button>
            <button
              onClick={() => addChild(cloneDeep(defaultGroup))}
              className="button-secondary min-h-[36px] rounded-[10px] px-3 text-xs font-semibold"
            >
              + Add Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
