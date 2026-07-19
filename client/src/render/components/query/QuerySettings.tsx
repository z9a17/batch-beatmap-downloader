import React from "react";
import Switch from "react-switch";
import Select from "react-select";
import { QueryOrder } from "../../../models/api";
import { NumericInput } from "../util/NumericInput";

interface PropTypes {
  limit: number | undefined;
  updateLimit: (n: number | undefined) => void;
  order: QueryOrder | undefined;
  updateOrder: (order: QueryOrder | undefined) => void;
}

const orderOptions = [
  { value: "approvedDate", label: "Approved Date" },
  { value: "bpm", label: "BPM" },
  { value: "stars", label: "Star Rating" },
  { value: "favouriteCount", label: "Favorite Count" },
  { value: "passCount", label: "Pass Count" },
  { value: "playCount", label: "Play Count" },
  { value: "maxCombo", label: "Max Combo" },
  { value: "hitLength", label: "Hit Length" },
  { value: "totalLength", label: "Total Length" },
  { value: "lastUpdate", label: "Last Update Date" },
  { value: "hp", label: "HP" },
  { value: "cs", label: "CS" },
  { value: "od", label: "OD" },
  { value: "ar", label: "AR" },
  { value: "size", label: "File Size" },
  { value: "id", label: "Beatmap Id" },
  { value: "setId", label: "Beatmap Set Id" },
];

const directionOptions = [
  { value: "DESC", label: "High to Low" },
  { value: "ASC", label: "Low to High" },
]

const defaultLimit = 10;
const defaultOrder = {
  by: "approvedDate",
  direction: "DESC"
}

const switchColors = {
  onColor: "#3b82f6",
  offColor: "#262d3d",
  onHandleColor: "#ffffff",
  offHandleColor: "#8a93a6",
  uncheckedIcon: false,
  checkedIcon: false,
  height: 22,
  width: 42,
};

export const QuerySettings = ({ limit, updateLimit, order, updateOrder }: PropTypes) => {
  const enable = (enabled: boolean) => {
    if (enabled) {
      updateLimit(defaultLimit);
      updateOrder(defaultOrder);
    } else {
      updateLimit(undefined);
      updateOrder(undefined);
    }
  };

  return (
    <div>
      <div className="panel-header mb-0">
        <div>
          <h2 className="panel-title">Limit and order</h2>
          <p className="panel-description mt-1">Optionally limit results and choose their sort order.</p>
        </div>
        <Switch
          {...switchColors}
          onChange={(enabled) => enable(enabled)}
          checked={limit !== undefined}
        />
      </div>

      {limit && (
        <div className="mt-5 grid grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)] gap-5 border-y border-line py-5">
          <div>
            <label className="field-label mb-2 block">Maximum results</label>
            <NumericInput
              className="input-height"
              value={limit}
              onChange={(n) => updateLimit(Math.max(1, n || 1))}
              step={1}
            />
          </div>

          <div>
            <label className="field-label mb-2 block">Order by</label>
            <Select
              menuPlacement="top"
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={orderOptions}
              value={orderOptions.find(item => order?.by === item.value)}
              onChange={(e) => e && order && updateOrder({ ...order, by: e.value })}
            />
          </div>
          <div>
            <label className="field-label mb-2 block">Direction</label>
            <Select
              menuPlacement="top"
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={directionOptions}
              value={directionOptions.find(item => order?.direction === item.value)}
              onChange={(e) => e && order && updateOrder({ ...order, direction: e.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
