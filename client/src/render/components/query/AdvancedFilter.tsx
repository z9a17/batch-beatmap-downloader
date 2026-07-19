import React from "react"
import { QueryGroup } from "./advanced/QueryGroup"
import { Group, Node } from "../../../models/filter";
import { ShareFilter } from "./ShareFilter";

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
}

export const AdvancedFilter: React.FC<PropTypes> = ({ tree, updateTree }) => {
  return (
    <div className="border-y border-line">
      <div className="flex items-center justify-between border-b border-line py-4">
        <div>
          <div className="text-sm font-semibold text-ink">Logic tree</div>
          <div className="mt-1 text-[13px] leading-5 text-mute">Combine nested AND, OR, and NOT conditions.</div>
        </div>
        <ShareFilter tree={tree} updateTree={updateTree} />
      </div>
      {tree.group && (
        <div className="py-5">
          <QueryGroup
            group={tree.group}
            id={tree.id}
            updateParent={(child) => updateTree(child)}
          />
        </div>
      )}
    </div>
  )
}
