import React from "react";
import { useEffect, useState } from "react";
import { BeatmapDetails, DownloadDetails } from "../../../models/api";
import { toast } from "react-toastify";
import { TableHeader } from "../../types/table";
import Table from "../util/Table";
import Button from "../util/Button";

interface PropTypes {
  result: DownloadDetails;
  orderBy?: string;
}

const headers: TableHeader[] = [
  { title: "Artist", key: "Artist" },
  { title: "Title", key: "Title" },
  { title: "Difficulty", key: "Version" },
  { title: "Mapper", key: "Creator" },
];

const pageSize = 25;
export const ResultTable = ({ result }: PropTypes) => {
  const [beatmaps, setBeatmaps] = useState<BeatmapDetails[]>([])
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    window.electron.getBeatmapDetails(pageNumber, pageSize).then(res => {
      if (typeof res === "string" || res === undefined) {
        toast.error(res);
        setBeatmaps([])
      } else {
        setBeatmaps(res)
      }
    })
  }, [result, pageNumber])

  return (
    <div className="flex w-full flex-col">
      <Table headers={headers} data={beatmaps} />

      <div className="flex items-center justify-between border-t border-[#222a42] px-5 py-4">
        <span className="text-[11px] text-[#626b84]">25 difficulties per page</span>
        <div className="flex items-center gap-2">
        <Button
          color="none"
          className="button-secondary"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Prev
        </Button>
        <span className="min-w-[74px] text-center text-xs text-[#959db5]">
          {pageNumber} / {Math.ceil(result.beatmaps / pageSize)}
        </span>
        <Button
          color="none"
          className="button-secondary"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber === Math.ceil(result.beatmaps / pageSize)}
        >
          Next
        </Button>
        </div>
      </div>
    </div>
  );
};
