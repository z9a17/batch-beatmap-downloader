import React from "react"
import Select from "react-select";
import { TInputItemDropdown } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";
import WarningIcon from '@mui/icons-material/Warning'

export const DropdownInput: React.FC<TInputItemProps<TInputItemDropdown>> = ({ label, value, onChange, defaultValue, options, warning }) => {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <Select
        className="min-w-0 my-react-select-container"
        classNamePrefix="my-react-select"
        options={options}
        value={value.option}
        onChange={(e) => onChange(e ? { ...value, option: e } : defaultValue)}
      />

      {warning && value.option.value === defaultValue.option.value && (
        <div className="col-start-2 -mt-1 flex gap-1.5 text-[10px] text-amber-300/70">
          <WarningIcon sx={{ fontSize: 14 }} />
          <span>{warning}</span>
        </div>
      )}
    </div>
  )
}
