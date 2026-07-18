import React from "react"
import { Input } from "../../util/Input";
import { TInputItemText } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";

export const TextInput: React.FC<TInputItemProps<TInputItemText>> = ({ label, value, onChange }) => {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <Input
        className=""
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
