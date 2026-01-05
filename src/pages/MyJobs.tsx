import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobPostCard from "../components/JobPostCard";
import JobListItem from "../components/JobList";
import ApplicationsList from "../components/ApplicationsList";
import ResumeModal from "../components/ResumeModal";
import { getJobsByUser } from "../api/job-post";
import { getApplicationsByJob, setApplicationStatus } from "../api/job-application";
import type { JobPost, JobApplication } from "../types";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [openResume, setOpenResume] = useState<string | null>(null);

  useEffect(() => {
    getJobsByUser({ userId: 1 }).then((data) => {
      setJobs(data);
      if (data.length > 0) setSelectedJob(data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedJob) {
      getApplicationsByJob({ jobPostId: selectedJob.id }).then(setApplications);
    } else {
      setApplications([]);
    }
  }, [selectedJob]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Backspace") && setOpenResume(null);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleStatusChange = async (applicationId: number, newStatus: JobApplication["status"]) => {
    // Optimistic UI update
    setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)));
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
          <div className="w-1/3 border-r overflow-y-auto">
            {jobs.map((job) => (
              <JobListItem key={job.id} job={job} selected={selectedJob?.id === job.id} onClick={() => setSelectedJob(job)} />
            ))}
          </div>

          <div className="w-2/3 overflow-y-auto p-6 bg-gray-50">
            {selectedJob ? (
              <>
                <JobPostCard {...selectedJob} showApplyButton={false}/>
                <h2 className="text-xl font-semibold mt-6 mb-2">Applications</h2>
                <ApplicationsList
                  applications={applications}
                  onStatusChange={handleStatusChange}
                  onViewResume={setOpenResume}
                />
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
