// src/pages/MyJobsPage.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobPostCard from "../components/JobPostCard";
import JobListItem from "../components/JobList";
import { getJobsByUser } from "../api/job-post";
import { getApplicationsByJob, setApplicationStatus } from "../api/job-application";
import type { JobPost, JobApplication } from "../types";
import { Document, Page } from 'react-pdf';


const statusClasses: Record<JobApplication["status"], string> = {
  APPLIED: "bg-yellow-100 text-yellow-800",
  INTERVIEW: "bg-blue-100 text-blue-800",
  OFFER: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};


export default function MyJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [openResume, setOpenResume] = useState<string | null>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  useEffect(() => {
    getJobsByUser({userId: 1}).then((data) => {
      setJobs(data);
      if (data.length > 0) setSelectedJob(data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedJob) {
      getApplicationsByJob({jobPostId: selectedJob.id}).then(setApplications);
    } else {
      setApplications([]);
    }
  }, [selectedJob]);


  useEffect(() => {
    const handler = (e: KeyboardEvent) => 
      (e.key === "Escape" || e.key === "Backspace") && setOpenResume(null);
    
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);


  const handleStatusChange = async (
    applicationId: number,
    newStatus: JobApplication["status"]
  ) => {
    try {
      // optimistic UI update
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      await setApplicationStatus({
        jobApplicationId: applicationId,
        newStatus,
      });
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
          </div>

          {/* RIGHT: job + applications */}
          <div className="w-2/3 overflow-y-auto p-6 bg-gray-50">
            {selectedJob ? (
              <>
                <JobPostCard
                  title={selectedJob.title}
                  company={selectedJob.company}
                  description={selectedJob.description}
                  salary={selectedJob.salary}
                  jobType={selectedJob.jobType}
                  location={selectedJob.location}
                />

                <h2 className="text-xl font-semibold mt-6 mb-2">Applications</h2>
                {applications.length === 0 && (
                  <p>No applications yet.</p>
                )}
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg shadow-sm border p-4 mb-4 flex justify-between items-start"
                  >
                    {/* LEFT: applicant info */}
                    <div className="flex gap-4">
                      {/* Avatar placeholder */}
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {app.fullName.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{app.fullName}</h3>

                        <p className="text-sm text-gray-600">{app.email}</p>
                        <p className="text-sm text-gray-600">{app.phone}</p>

                        {app.address && (
                          <p className="text-sm text-gray-500 mt-1">
                            📍 {app.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: actions */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Status badge */}
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as JobApplication["status"])
                        }
                        className={`text-xs px-2 py-1 rounded-full border bg-white cursor-pointer ${statusClasses[app.status]}`}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      {app.resumePath && (
                        <button
                          onClick={() =>
                           setOpenResume(app.resumePath)
                          }
                          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
                        >
                          View Resume
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              </>
            ) : (
              <div className="text-gray-500 text-center mt-10">
                Select a job to see details
              </div>
            )}
          </div>
        </div>
      </div>

      {openResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black z-10 bg-white rounded-full p-2 shadow"
              onClick={() => {
                setOpenResume(null);
                setNumPages(null);
                setPageNumber(1);
              }}
            >
              ✕
            </button>

            {/* Optional simple controls */}
            <div className="bg-gray-100 p-4 flex justify-center items-center gap-4 z-10">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <p>
                Page {pageNumber} of {numPages || '...'}
              </p>
              <button
                disabled={pageNumber >= (numPages || 1)}
                onClick={() => setPageNumber(pageNumber + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto bg-gray-200">
              <Document
                file={`http://localhost:8080/media/${openResume}`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="p-8 text-center">Loading PDF...</div>}
                error={<div className="p-8 text-center text-red-600">Failed to load PDF</div>}
              >
                <div className="flex justify-center py-6">
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(window.innerWidth * 0.75, 900)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </Document>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
