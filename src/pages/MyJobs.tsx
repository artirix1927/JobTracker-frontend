import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobPostCard from "../components/JobPostCard";
import JobListItem from "../components/JobList";
import ApplicationsList from "../components/ApplicationsList";
import ResumeModal from "../components/ResumeModal";
import { getJobsByUserPaged } from "../api/job-post"; // <- new paginated API
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

  useEffect(() => {
    if (!user) return;

    getJobsByUserPaged({ userId: user.id, page: jobsPage, size: 10 }).then((data) => {
      setJobs(data.content);
      setJobsTotalPages(data.page.totalPages);
      if (data.content.length > 0 && !selectedJob) setSelectedJob(data.content[0]);
    });
  }, [user, jobsPage]);

  useEffect(() => {
    setApplicationsPage(0);
  }, [selectedJob]);

  useEffect(() => {
    if (!selectedJob) return;

    getApplicationsByJob({
      jobPostId: selectedJob.id,
      page: applicationsPage,
      size: 10,
    }).then((data) => {
      setApplications(data.content);
      setApplicationsTotalPages(data.page.totalPages);
    });
  }, [selectedJob, applicationsPage]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Backspace") && setOpenResume(null);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
            {jobs.map((job) => (
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
                <ApplicationsList
                  applications={applications}
                  onStatusChange={handleStatusChange}
                  onViewResume={setOpenResume}
                />

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

      <ResumeModal resumePath={openResume} onClose={() => setOpenResume(null)} />
    </>
  );
}