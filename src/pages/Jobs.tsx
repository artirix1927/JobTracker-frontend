// src/pages/JobsPage.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import JobPostCard from "../components/JobPostCard";
import { getAllJobs } from "../api/job-post";
import type { JobPost } from "../types";
import JobListItem from "../components/JobList";



export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  useEffect(() => {
    getAllJobs().then((data) => {
      setJobs(data);
      if (data.length > 0) setSelectedJob(data[0]);
    });
  }, []);

  return (
    <>
      <Navbar />
      <Search />

      {/* PAGE CONTAINER */}
      <div className="px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-260px)] border rounded-lg overflow-hidden bg-white">
          
          {/* LEFT: job list */}
          <div className="w-1/2 border-r overflow-y-auto">
            {jobs.map((job) => (
              <JobListItem
                key={job.id}
                job={job}
                selected={selectedJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>

          {/* RIGHT: preview */}
          <div className="w-1/2 overflow-y-auto p-8 bg-gray-50">
            {selectedJob ? (
              <JobPostCard
                title={selectedJob.title}
                company={selectedJob.company}
                description={selectedJob.description}
                salary={selectedJob.salary}
                jobType={selectedJob.jobType}
                location={selectedJob.location}
              />
            ) : (
              <div className="text-gray-500 text-center mt-10">
                Select a job to see details
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
