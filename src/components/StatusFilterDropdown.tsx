import { useState } from "react";

export function StatusFilterDropdown<T extends string>({
  statuses,
  selectedStatuses,
  onChange,
}: {
  statuses: T[];
  selectedStatuses: T[];
  onChange: (newStatuses: T[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggleStatus = (status: T, checked: boolean) => {
    if (checked) onChange([...selectedStatuses, status]);
    else onChange(selectedStatuses.filter((s) => s !== status));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="border rounded px-3 py-1 bg-white"
      >
        Status filter {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow p-2">
          {statuses.map((status) => (
            <label key={status} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={(e) => toggleStatus(status, e.target.checked)}
              />
              {status}
            </label>
          ))}
          {selectedStatuses.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="mt-2 text-xs text-blue-600 underline"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

