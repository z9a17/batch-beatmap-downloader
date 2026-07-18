import Button from "../components/util/Button";
import React from "react";
import { toast } from "react-toastify";

interface PropTypes {
  path: string
  update: (path: string) => void
}

export const Browse = ({ path, update }: PropTypes) => {
  const browse = async () => {
    const res = await window.electron.browse();
    if (!res.canceled) {
      const path = res.filePaths[0]
      toast.success(`Path updated!`)
      update(path);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <input
        value={path}
        disabled={true}
        className="input-height min-w-[220px] flex-1"
      />
      <Button color="none" className="button-secondary" onClick={() => browse()}>Browse</Button>
    </div>
  )
}
