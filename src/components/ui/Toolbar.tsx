"use client";

import * as React from "react";
import Button from "@/components/ui/Button";

type Props = {
  // top row (search)
  search: string;
  onSearchChange: (v: string) => void;
  onSearch?: () => void;
  optionLabel?: string;
  onOptionClick?: () => void;

  // bottom row (actions)
  showActions?: boolean; // default true
  onNew?: () => void;
  onExport?: () => void;
  onUpload?: () => void;

  supportsDeactivate?: boolean;
  selectedCount?: number;
  onDeactivateSelected?: () => void;
  onReactivateSelected?: () => void;
};

export default function Toolbar({
  search,
  onSearchChange,
  onSearch,
  optionLabel = "Option",
  onOptionClick,
  showActions = true,
  onNew,
  onExport,
  onUpload,
  supportsDeactivate = true,
  selectedCount = 0,
  onDeactivateSelected,
  onReactivateSelected,
}: Props) {
  return (
    <div className="mb-3">
      {/* Top row: Search + Option */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">&nbsp;</h1>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Input and press [Enter]"
            className="h-8 w-72 rounded border px-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.currentTarget as HTMLInputElement).blur();
                onSearch?.();
              }
            }}
          />
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={onSearch}>
            Search (F3)
          </Button>
          <Button variant="outline" onClick={onOptionClick}>
            {optionLabel}
          </Button>
        </div>
      </div>

      {/* Bottom row: optional */}
      {showActions && (
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onNew} className="bg-purple-600 hover:bg-purple-700">
            New (F2)
          </Button>

          {supportsDeactivate && (
            <div className="relative">
              <details className="group">
                <summary className="list-none">
                  <Button variant="outline" className="!h-8">
                    Deactivate/Reactivate ▾
                  </Button>
                </summary>
                <div className="absolute mt-1 w-56 rounded border bg-white shadow">
                  <button
                    onClick={onDeactivateSelected}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                    disabled={selectedCount === 0}
                  >
                    Deactivate selected
                  </button>
                  <button
                    onClick={onReactivateSelected}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                    disabled={selectedCount === 0}
                  >
                    Reactivate selected
                  </button>
                </div>
              </details>
            </div>
          )}

          <Button variant="outline" onClick={onExport}>
            Excel
          </Button>
          <Button variant="outline" onClick={onUpload}>
            Web Uploader
          </Button>
        </div>
      )}
    </div>
  );
}
