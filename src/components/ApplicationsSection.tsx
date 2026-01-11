import type { JobApplication } from "../types";
import ApplicationsList from "./ApplicationsList";
import { StatusFilterDropdown } from "./StatusFilterDropdown";



export function ApplicationsSection({
  applications,
  loading,
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  statusFilter,
  onStatusFilterChange,
  onStatusChange,
  onViewResume,
  page,
  totalPages,
  onPageChange,
}: {
  applications: JobApplication[];
  loading: boolean;
  sortBy: "appliedAt" | "status";
  sortDir: "asc" | "desc";
  onSortByChange: (val: "appliedAt" | "status") => void;
  onSortDirChange: (val: "asc" | "desc") => void;
  statusFilter: JobApplication["status"][];
  onStatusFilterChange: (val: JobApplication["status"][]) => void;
  onStatusChange: (id: number, status: JobApplication["status"]) => void;
  onViewResume: (resume: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="overflow-y-auto p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mt-6 mb-2">Applications</h2>

      <div className="flex gap-2 mb-3">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="appliedAt">Applied date</option>
        </select>

        <select
          value={sortDir}
          onChange={(e) => onSortDirChange(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <StatusFilterDropdown
          statuses={["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]}
          selectedStatuses={statusFilter}
          onChange={onStatusFilterChange}
        />
      </div>

      {loading && <div className="text-gray-400 text-center mt-4">Loading applications…</div>}

      {!loading && applications.length === 0 && (
        <div className="text-gray-400 text-center mt-4">No applications yet</div>
      )}

      {!loading && applications.length > 0 && (
        <ApplicationsList
          applications={applications}
          onStatusChange={onStatusChange}
          onViewResume={onViewResume}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}