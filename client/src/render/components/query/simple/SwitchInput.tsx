import React from "react"
import { TInputItemSwitch } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";
import Button from "../../util/Button";
import classNames from "classnames"

export const SwitchInput: React.FC<TInputItemProps<TInputItemSwitch>> = ({ label, value, onChange }) => {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <div className="segmented w-fit">
        <SwitchButton
          text="Yes"
          onChange={onChange}
          target={true}
          value={value}
        />
        <SwitchButton
          text="No"
          onChange={onChange}
          target={false}
          value={value}
        />
      </div>
    </div>
  );
};

const SwitchButton = ({ text, onChange, target, value }: {
  text: string;
  onChange: (bool: boolean | undefined) => void;
  target: boolean;
  value: boolean | undefined;
}) => {
  return (
    <Button
      onClick={() => onChange(value === target ? undefined : target)}
      color="none"
      className={classNames(
        "segmented-item min-h-0 px-3 py-1.5",
        { "text-[#737d98] hover:text-white": value === undefined || value !== target },
        { "segmented-item-active": value === target },
      )}>
      {text}
    </Button>
  );
};
