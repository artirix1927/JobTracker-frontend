import { useState } from "react";
import { useApplications, useAuth, useJobs } from "../hooks";
import type { JobApplication, JobPost } from "../types";
import { setApplicationStatus } from "../api/job-application";
import { JobsSidebar } from "../components/JobsSidebar";
import Navbar from "../components/Navbar";
import JobPostCard from "../components/JobPostCard";
import { ApplicationsSection } from "../components/ApplicationsSection";
import ResumeModal from "../components/ResumeModal";

export default function MyJobsPage() {
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [jobsPage, setJobsPage] = useState(0);
  const [applicationsPage, setApplicationsPage] = useState(0);
  const [applicationsSortBy, setApplicationsSortBy] = useState<"appliedAt" | "status">("appliedAt");
  const [applicationsSortDir, setApplicationsSortDir] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<JobApplication["status"][]>([]);
  const [openResume, setOpenResume] = useState<string | null>(null);
  const [showJobPost, setShowJobPost] = useState(false);

  const { jobs, totalPages: jobsTotalPages, loading: jobsLoading } = useJobs(user?.id, jobsPage);
  const { applications, totalPages: applicationsTotalPages, loading: applicationsLoading, setApplications } = useApplications({
    jobPostId: selectedJob?.id || null,
    page: applicationsPage,
    sortBy: applicationsSortBy,
    sortDir: applicationsSortDir,
    statusFilter,
  });

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
          
          {/* LEFT: Jobs Sidebar */}
          <JobsSidebar
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={setSelectedJob}
            loading={jobsLoading}
            page={jobsPage}
            totalPages={jobsTotalPages}
            onPageChange={setJobsPage}
          />

          {/* RIGHT: Job Details + Applications */}
          <div className="w-2/3 overflow-y-auto p-6 bg-gray-50">
            {selectedJob ? (
              <>
                {/* Show/Hide Job Details */}
                <button
                  onClick={() => setShowJobPost((v) => !v)}
                  className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  {showJobPost ? "Hide Job Details" : "Show Job Details"}
                </button>

                {/* JobPostCard */}
                {showJobPost && <JobPostCard {...selectedJob} showApplyButton={false} />}

                {/* Applications Section */}
                <ApplicationsSection
                  applications={applications}
                  loading={applicationsLoading}
                  sortBy={applicationsSortBy}
                  sortDir={applicationsSortDir}
                  onSortByChange={(val) => { setApplicationsSortBy(val); setApplicationsPage(0); }}
                  onSortDirChange={(val) => { setApplicationsSortDir(val); setApplicationsPage(0); }}
                  statusFilter={statusFilter}
                  onStatusFilterChange={(val) => { setStatusFilter(val); setApplicationsPage(0); }}
                  onStatusChange={handleStatusChange}
                  onViewResume={setOpenResume}
                  page={applicationsPage}
                  totalPages={applicationsTotalPages}
                  onPageChange={setApplicationsPage}
                />
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
