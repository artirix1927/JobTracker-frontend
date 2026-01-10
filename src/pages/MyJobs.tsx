import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobPostCard from "../components/JobPostCard";
import JobListItem from "../components/JobList";
import ApplicationsList from "../components/ApplicationsList";
import ResumeModal from "../components/ResumeModal";
import { getJobsByUserPaged } from "../api/job-post";
import { getApplicationsByJob, setApplicationStatus } from "../api/job-application";
import type { JobPost, JobApplication } from "../types";
import { useAuth } from "../hooks";

export default function MyJobsPage() {
  const { user } = useAuth();

  // Jobs state
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [jobsPage, setJobsPage] = useState(0);
  const [jobsTotalPages, setJobsTotalPages] = useState(0);

  // Applications state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [applicationsPage, setApplicationsPage] = useState(0);
  const [applicationsTotalPages, setApplicationsTotalPages] = useState(0);

  const [openResume, setOpenResume] = useState<string | null>(null);
  const [showJobPost, setShowJobPost] = useState(false);

  const [jobsLoading, setJobsLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);  

  const [statusFilter, setStatusFilter] =
    useState<JobApplication["status"][]>([]);

  // Sorting & filtering
  const [applicationsSortBy, setApplicationsSortBy] =
    useState<"appliedAt" | "status">("appliedAt");
  const [applicationsSortDir, setApplicationsSortDir] =
    useState<"asc" | "desc">("desc");


  const STATUSES: JobApplication["status"][] = [
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
  ];

  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    setJobsLoading(true);
    getJobsByUserPaged({ userId: user.id, page: jobsPage, size: 10 }).then((data) => {
      setJobs(data.content);
      setJobsTotalPages(data.page.totalPages);
      if (data.content.length > 0 && !selectedJob) setSelectedJob(data.content[0]);
      setJobsLoading(false);
    });
  }, [user, jobsPage]);

  useEffect(() => {
    setApplicationsPage(0);
  }, [selectedJob]);

  useEffect(() => {
    if (!selectedJob) return;
    setApplicationsLoading(true);
    getApplicationsByJob({
      jobPostId: selectedJob.id,
      page: applicationsPage,
      size: 10,
      sortBy: applicationsSortBy,
      direction: applicationsSortDir,
      status: statusFilter.length > 0 ? statusFilter : undefined,
    }).then((data) => {
      setApplications(data.content);
      setApplicationsTotalPages(data.page.totalPages);
      setApplicationsLoading(false);
    });
  }, [selectedJob, applicationsPage, applicationsSortBy, applicationsSortDir, statusFilter]);

  const handleStatusChange = async (applicationId: number, newStatus: JobApplication["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
    );

    try {
      await setApplicationStatus({ jobApplicationId: applicationId, newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-8 lg:px-16 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold my-4">My Job Posts</h1>
        <div className="flex h-[calc(100vh-160px)] border rounded-lg overflow-hidden bg-white">

          {/* LEFT: job list */}
          <div className="w-1/3 border-r overflow-y-auto">
            {jobsLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 m-2 rounded bg-gray-100 animate-pulse"
                />
              ))}

            {/* Empty state */}
            {!jobsLoading && jobs.length === 0 && (
              <div className="text-center text-gray-400 mt-6">
                You haven’t posted any jobs yet
              </div>
            )}

            {!jobsLoading &&
            jobs.map((job) => (
              <JobListItem
                key={job.id}
                job={job}
                selected={selectedJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
              />
            ))}

            {/* Jobs pagination */}
            {jobsTotalPages > 1 && (
              <div className="flex justify-center gap-2 p-2">
                <button
                  disabled={jobsPage === 0}
                  onClick={() => setJobsPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="px-3 py-1">
                  Page {jobsPage + 1} of {jobsTotalPages}
                </span>

                <button
                  disabled={jobsPage + 1 >= jobsTotalPages}
                  onClick={() => setJobsPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Job + Applications */}
          <div className="w-2/3 overflow-y-auto p-6 bg-gray-50">
            {selectedJob ? (
              <>
                <button
                  onClick={() => setShowJobPost(!showJobPost)}
                  className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  {showJobPost ? "Hide Job Details" : "Show Job Details"}
                </button>

                {showJobPost && <JobPostCard {...selectedJob} showApplyButton={false} />}

                <h2 className="text-xl font-semibold mt-6 mb-2">Applications</h2>
                {/* Loading */}
                {applicationsLoading && (
                  <div className="text-gray-400 text-center mt-4">
                    Loading applications…
                  </div>
                )}

                {/* Empty */}
                {!applicationsLoading && applications.length === 0 && (
                  <div className="text-gray-400 text-center mt-4">
                    No applications yet
                  </div>
                )}

                {/* Sorting & Status filter */}
                <div className="flex gap-2 mb-3">
                  <select
                    value={applicationsSortBy}
                    onChange={(e) => {
                      setApplicationsPage(0);
                      setApplicationsSortBy(e.target.value as any);
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value="appliedAt">Applied date</option>
                  </select>

                  <select
                    value={applicationsSortDir}
                    onChange={(e) => {
                      setApplicationsPage(0);
                      setApplicationsSortDir(e.target.value as any);
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>

                  <div className="relative">
                    <button
                      onClick={() => setFilterOpen((v) => !v)}
                      className="border rounded px-3 py-1 bg-white"
                    >
                      Status filter {statusFilter.length > 0 && `(${statusFilter.length})`}
                    </button>

                    {filterOpen && (
                      <div className="absolute z-10 mt-1 bg-white border rounded shadow p-2">
                        {STATUSES.map((status) => (
                          <label key={status} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={statusFilter.includes(status)}
                              onChange={(e) => {
                                setApplicationsPage(0);
                                setStatusFilter((prev) =>
                                  e.target.checked
                                    ? [...prev, status]
                                    : prev.filter((s) => s !== status)
                                );
                              }}
                            />
                            {status}
                          </label>
                        ))}

                        {statusFilter.length > 0 && (
                          <button
                            onClick={() => setStatusFilter([])}
                            className="mt-2 text-xs text-blue-600 underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!applicationsLoading && applications.length > 0 && (
                  <ApplicationsList
                    applications={applications}
                    onStatusChange={handleStatusChange}
                    onViewResume={setOpenResume}
                  />
                )}

                {applicationsTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      disabled={applicationsPage === 0}
                      onClick={() => setApplicationsPage((p) => p - 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1">
                      Page {applicationsPage + 1} of {applicationsTotalPages}
                    </span>
                    <button
                      disabled={applicationsPage + 1 >= applicationsTotalPages}
                      onClick={() => setApplicationsPage((p) => p + 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
                </>
            ) : (
              <div className="text-gray-500 text-center mt-10">Select a job to see details</div>
            )}
          </div>

        </div>
      </div>

      <ResumeModal resume={openResume} onClose={() => setOpenResume(null)} />
    </>
  );
}