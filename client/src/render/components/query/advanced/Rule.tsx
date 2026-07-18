import { useEffect, useState } from "react";
import { RuleInput } from "./RuleInput";
import { RuleOperator } from "./RuleOperator";
import { RuleSelector } from "./RuleSelector";
import { Rule } from "../../../../models/rules";
import React from "react";

interface PropTypes {
  rule: Rule | null;
  id: string;
  updateParent: (rule: Rule, id: string) => void;
}

export const FilterRule = ({ rule, id, updateParent }: PropTypes) => {
  const [state, setState] = useState<Rule | null>(rule);

  useEffect(() => {
    if (!state) return
    updateParent(state, id);
  }, [state]);

  if (!state) return null
  return (
    <div className="grid min-w-0 flex-1 grid-cols-[minmax(150px,1.15fr)_minmax(160px,1.2fr)_minmax(130px,0.9fr)] items-center gap-2">
      <RuleSelector rule={state} onChange={(rule) => setState(rule)} />
      <RuleOperator rule={state} onChange={(rule) => setState(rule)} />
      <RuleInput rule={state} onChange={(rule) => setState(rule)} />
    </div>
  );
};
