import React from "react";
import { ConnectorDetails } from "../../../../models/filter";
import classNames from 'classnames';

const types = ["AND", "OR"];

interface PropTypes {
  details: ConnectorDetails;
  update: (connector: ConnectorDetails) => void;
  id: string;
}

export const Connector = ({ id, details, update }: PropTypes) => {
  const isNot = details.not.includes(id);

  const handleUpdate = () => {
    // if NOT is toggled on, add id to not array
    // if NOT is toggled off, remove id from the not array
    if (isNot) { // is on, turning off
      update({
        ...details,
        not: details.not.filter((existingId) => existingId !== id),
      });
    } else { // is off, turning on
      update({
        ...details,
        not: [...details.not, id],
      });
    }
  }

  return (
    <div className="my-2 flex items-center">
      {types.map((type, index) => (
        <button
          className={classNames("w-12 border border-[#303a5a] px-2 py-1 text-[10px] font-bold transition",
            { "rounded-l-lg border-r-0": index === 0 },
            { "rounded-r-lg border-l-0": index === types.length - 1 },
            { "bg-violet-500/20 text-violet-200": details.type === type },
            { "bg-[#111524] text-[#68708a] hover:text-white": details.type !== type },
          )}
          disabled={type === details.type}
          onClick={() => update({ ...details, type })}
          key={index}
        >
          {type}
        </button>
      ))}

      <button
        className={classNames("ml-2 rounded-lg border border-[#303a5a] px-2 py-1 text-[10px] font-bold transition",
          { "border-rose-400/30 bg-rose-400/15 text-rose-200": isNot },
          { "bg-[#111524] text-[#68708a] hover:text-white": !isNot },
        )}
        onClick={() => handleUpdate()}
      >
        NOT
      </button>
    </div>
  );
};
