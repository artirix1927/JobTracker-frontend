import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import JobPostCard from "../components/JobPostCard";
import JobListItem from "../components/JobList";
import { getAllJobs, searchByTitle } from "../api/job-post";
import type { JobPost } from "../types";

const PAGE_SIZE = 10;

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState<{
    title?: string;
    address?: string;
  } | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  const loadJobs = async (
    nextPage: number,
    reset = false,
    params: { title?: string; address?: string } | null = null
  ) => {
    if (loading) return;
    setLoading(true);

    const res = params
      ? await searchByTitle({ ...params, page: nextPage, size: PAGE_SIZE })
      : await getAllJobs({ page: nextPage, size: PAGE_SIZE });

    setJobs(prev => (reset ? res.content : [...prev, ...res.content]));
    setPage(nextPage);
    setTotalPages(res.page.totalPages);
    setLoading(false);

    if (reset && res.content.length > 0) setSelectedJob(res.content[0]);
  };

  useEffect(() => {
    loadJobs(0, true);
  }, []);

  const handleScroll = () => {
    if (!listRef.current || loading || totalPages === null) return;

    
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      console.log(page, totalPages)
      if (page + 1 < totalPages) {
        loadJobs(page + 1);
      }
    }
  };

  // Attach scroll listener
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, loading, jobs]);

  
  const handleSearch = async (title: string, address: string) => {
    setJobs([]);
    setPage(0);
    setTotalPages(null);

    const params = title.trim() || address.trim() ? { title, address } : null;

    setSearchParams(params); // optional if you still need it elsewhere
    loadJobs(0, true, params);
  };

  return (
    <>
      <Navbar />
      <Search onSearch={handleSearch} />

      <div className="px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-260px)] border rounded-lg overflow-hidden bg-white">
          <div ref={listRef} className="w-1/2 border-r overflow-y-auto h-full" >
            {jobs.map((job) => (
              <JobListItem
                key={job.id}
                job={job}
                selected={selectedJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
              />
            ))}
            
            {loading && (
              <div className="p-4 text-center text-gray-500">
                Loading…
              </div>
            )}

            {!loading && totalPages !== null && page + 1 >= totalPages && (
              <div className="p-4 text-center text-gray-400">
                No more jobs
              </div>
            )}
          </div>

          <div className="w-1/2 overflow-y-auto p-8 bg-gray-50">
            {selectedJob ? (
              <JobPostCard
                id={selectedJob.id}
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
