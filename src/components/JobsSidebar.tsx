import type { JobPost } from "../types";
import JobListItem from "./JobList";



export function JobsSidebar({
  jobs,
  selectedJob,
  onSelectJob,
  loading,
  page,
  totalPages,
  onPageChange,
}: {
  jobs: JobPost[];
  selectedJob: JobPost | null;
  onSelectJob: (job: JobPost) => void;
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) {
  return (
    <div className="w-1/3 border-r overflow-y-auto">
      {loading &&
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 m-2 rounded bg-gray-100 animate-pulse" />
        ))}

      {!loading && jobs.length === 0 && (
        <div className="text-center text-gray-400 mt-6">
          You haven’t posted any jobs yet
        </div>
      )}

      {!loading &&
        jobs.map((job) => (
          <JobListItem
            key={job.id}
            job={job}
            selected={selectedJob?.id === job.id}
            onClick={() => onSelectJob(job)}
          />
        ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 p-2">
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