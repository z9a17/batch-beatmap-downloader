import React, { useMemo, useState } from "react";
import { CircularProgress } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import { cloneDeep } from "lodash";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import { DownloadDetails, QueryOrder } from "../../models/api";
import { Group, Node, sampleTree } from "../../models/filter";
import { RuleType } from "../../models/rules";
import { treeIsCompatibleWithSimpleMode } from "../../models/simple";
import { DownloadSettings } from "../components/DownloadSettings";
import { InvalidPath } from "../components/InvalidPath";
import { AdvancedFilter } from "../components/query/AdvancedFilter";
import { QuerySettings } from "../components/query/QuerySettings";
import { ResultTable } from "../components/query/ResultTable";
import { SimpleFilter } from "../components/query/SimpleFilter";
import Button from "../components/util/Button";
import { useSettings } from "../context/SettingsProvider";
import { useStickyState } from "../hooks/useStickyState";

const countRules = (node: Node): number => {
  if (node.rule) return 1;
  return node.group?.children.reduce((total, child) => total + countRules(child), 0) ?? 0;
};

export const Query = () => {
  const { settings } = useSettings();
  const { validPath } = settings;
  const [tree, setTree] = useStickyState<Node>(sampleTree, "tree");
  const [result, setResult] = useState<DownloadDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<number>();
  const [order, setOrder] = useState<QueryOrder>();
  const [simpleMode, setSimpleMode] = useStickyState(true, "simple");
  const ruleCount = useMemo(() => countRules(tree), [tree]);

  const exportData = async () => {
    setResult(null);
    setLoading(true);

    const map: Record<RuleType, string> = {
      0: "Text",
      1: "Numeric",
      2: "Text",
      3: "Text",
      4: "Text",
      5: "Text",
      6: "Numeric",
      7: "Numeric",
      8: "Text",
      9: "Numeric",
      10: "Numeric",
    };

    const replaceRuleType = (node: Node) => {
      if ("rule" in node && node.rule) {
        node.rule.type = map[node.rule.type as RuleType];
        if (node.rule.field === "LastUpdate") node.rule.value = node.rule.value.slice(0, -3);
        if (node.rule.field === "Special") {
          node.rule.field = node.rule.value;
          node.rule.value = "1";
        }
      }
      node.group?.children.forEach(replaceRuleType);
    };

    const clone = cloneDeep(tree);
    replaceRuleType(clone);

    try {
      const response = await window.electron.query(clone, limit, order);
      if (!response) return;
      if (typeof response === "string") {
        toast.error(response);
      } else {
        toast.success(`${response.beatmaps.toLocaleString()} beatmaps matched`);
        setResult(response);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTree = (group: Group) => setTree({ ...tree, group });

  const handleChangeMode = (simple: boolean) => {
    if (!simple || (tree.group && treeIsCompatibleWithSimpleMode(tree.group))) {
      setSimpleMode(simple);
      return;
    }

    const node = document.getElementById("modal");
    if (!node) return;
    node.classList.remove("hidden");
    ReactDOM.render(
      <div className="w-full max-w-lg rounded-2xl border border-[#303a5a] bg-[#111524] p-7 shadow-2xl shadow-black/50">
        <div className="eyebrow">Mode compatibility</div>
        <h3 className="mt-2 text-xl font-semibold text-white">Flatten this advanced query?</h3>
        <p className="mt-3 leading-6 text-[#959db5]">
          Simple mode cannot preserve nested groups, OR connectors, or NOT rules. Converting keeps compatible filters and flattens the rest.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button color="none" className="button-secondary" onClick={() => node.classList.add("hidden")}>Stay advanced</Button>
          <Button onClick={() => {
            setSimpleMode(true);
            node.classList.add("hidden");
          }}>Convert query</Button>
        </div>
      </div>,
      node,
    );
  };

  if (!tree.group) return null;

  return (
    <div className="page-stack">
      {!validPath ? (
        <InvalidPath />
      ) : (
        <>
          <section className="content-box">
            <div className="panel-header">
              <div>
                <div className="eyebrow">Query workspace</div>
                <h2 className="panel-title mt-1">Shape your search</h2>
                <p className="panel-description mt-1">Start visually or compose nested rules when the collection needs exact logic.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="pill">{ruleCount} active rule{ruleCount === 1 ? "" : "s"}</span>
                <div className="segmented">
                  <button className={`segmented-item ${simpleMode ? "segmented-item-active" : ""}`} onClick={() => handleChangeMode(true)}>
                    <TuneRoundedIcon sx={{ fontSize: 15, marginRight: "6px" }} />Simple
                  </button>
                  <button className={`segmented-item ${!simpleMode ? "segmented-item-active" : ""}`} onClick={() => handleChangeMode(false)}>
                    <AccountTreeRoundedIcon sx={{ fontSize: 15, marginRight: "6px" }} />Advanced
                  </button>
                </div>
              </div>
            </div>

            {simpleMode ? (
              <SimpleFilter tree={tree} updateTree={updateTree} />
            ) : (
              <AdvancedFilter tree={tree} updateTree={updateTree} />
            )}
          </section>

          <section className="content-box">
            <QuerySettings
              limit={limit}
              updateLimit={setLimit}
              order={order}
              updateOrder={setOrder}
            />
            <div className="mt-5 flex items-center border-t border-[#222a42] pt-5">
              <div className="text-xs text-[#68708a]">
                {limit ? `Returning up to ${limit.toLocaleString()} ordered results.` : "No result limit. Large catalogue queries can take longer."}
              </div>
              <Button color="blue" className="ml-auto flex items-center gap-2 px-5" onClick={exportData} disabled={loading}>
                {loading ? <CircularProgress size={17} /> : <SearchRoundedIcon sx={{ fontSize: 18 }} />}
                {loading ? "Searching…" : "Search catalogue"}
              </Button>
            </div>
          </section>
        </>
      )}

      {result && result.beatmaps === 0 && (
        <div className="rounded-2xl border border-[#222a42] bg-white/[0.02] px-6 py-10 text-center text-[#68708a]">
          No beatmaps matched this query. Loosen a filter and try again.
        </div>
      )}

      {result && result.beatmaps > 0 && (
        <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-4">
          <section className="content-box no-pad">
            <div className="border-b border-[#222a42] px-6 py-5">
              <div className="eyebrow">Matches</div>
              <div className="mt-1 flex items-baseline justify-between">
                <h2 className="panel-title">Catalogue results</h2>
                <span className="text-xs text-[#68708a]">{result.beatmaps.toLocaleString()} difficulties</span>
              </div>
            </div>
            <ResultTable result={result} />
          </section>
          <aside className="content-box sticky top-0">
            <DownloadSettings result={result} />
          </aside>
        </div>
      )}
    </div>
  );
};
