import { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  dropdownMap,
  inputTypeMap,
  InputType,
  RuleType,
  Rule,
  DropdownOption,
} from "../../../../models/rules";
import React from "react";

interface PropTypes {
  rule: Rule;
  onChange: (rule: Rule) => void;
}

const RuleInputDropdown = ({ rule, onChange }: PropTypes) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

  useEffect(() => {
    const option = dropdownMap
      .get(rule.type as RuleType)
      ?.find((i) => i.value === rule.value);
    if (!option) {
      setSelectedOption((dropdownMap.get(rule.type as RuleType) ?? [])[0]);
    } else {
      setSelectedOption(option);
    }
  }, [rule]);

  return (
    <Select
      className="min-w-0 my-react-select-container"
      classNamePrefix="my-react-select"
      options={dropdownMap.get(rule.type as RuleType)}
      value={selectedOption}
      onChange={(e) => onChange({ ...rule, value: e?.value ?? "" })}
    />
  );
};

const RuleInputNumber = ({ rule, onChange }: PropTypes) => {
  return (
    <input
      className="input-height"
      type="number"
      defaultValue={rule.value}
      onChange={(e) => onChange({ ...rule, value: e.target.value })}
    />
  );
};

const RuleInputText = ({ rule, onChange }: PropTypes) => {
  return (
    <input
      className="input-height"
      defaultValue={rule.value}
      onChange={(e) => onChange({ ...rule, value: e.target.value })}
    />
  );
};

const RuleInputDate = ({ rule, onChange }: PropTypes) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(parseInt(rule.value))
  );
  useEffect(() => {
    onChange({ ...rule, value: selectedDate.getTime().toString() });
  }, [selectedDate]);

  return (
    <DatePicker
      className="input-height"
      selected={new Date(parseInt(rule.value))}
      onChange={(date) => setSelectedDate(date ?? new Date())}
    />
  );
};

export const RuleInput = ({ rule, onChange }: PropTypes) => {
  const inputMap = new Map<InputType, JSX.Element>([
    [InputType.NUMBER, <RuleInputNumber rule={rule} onChange={onChange} />],
    [InputType.TEXT, <RuleInputText rule={rule} onChange={onChange} />],
    [InputType.DROPDOWN, <RuleInputDropdown rule={rule} onChange={onChange} />],
    [InputType.DATE, <RuleInputDate rule={rule} onChange={onChange} />],
  ]);

  return (
    <div className="min-w-0">
      {inputMap.get(inputTypeMap[rule.type as RuleType])}
    </div>
  );
};
