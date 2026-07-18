import React from "react"
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { Input } from "../../util/Input";
import is_number from "is-number";
import { TInputItemSlider } from "../../../../models/simple";
import { TInputItemProps } from "./InputItem";

export const SliderInput: React.FC<TInputItemProps<TInputItemSlider>> = ({ label, value, onChange, min, max, step }) => {
  const updateValue = (newValue: string, index: number) => {
    // todo handle x.
    if (is_number(newValue)) {
      const number = parseFloat(newValue)
      if (number > max || number < min) return
      const newValues = [number, value[1-index]]
      if (index === 1) newValues.reverse()
      onChange(newValues)
    }
  }

  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <div className="flex w-full items-center gap-3">
        <div className="w-14 shrink-0">
          <Input
            className="min-h-[36px] px-2 text-center text-xs"
            value={value[0].toString()}
            onChange={(value) => updateValue(value, 0)}
          />
        </div>
        <Slider
          range
          value={value}
          onChange={(nextValue) => onChange(nextValue as number[])}
          min={min}
          max={max}
          step={step}
        />
        <div className="w-14 shrink-0">
          <Input
            className="min-h-[36px] px-2 text-center text-xs"
            value={value[1].toString()}
            onChange={(value) => updateValue(value, 1)}
          />
        </div>
      </div>
    </div>
  )
}
