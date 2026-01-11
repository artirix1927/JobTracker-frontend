
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext"; 
import type { JobApplication, JobPost } from "./types";
import { getJobsByUserPaged } from "./api/job-post";
import { getApplicationsByJob } from "./api/job-application";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // { user, logout }
}


export function useJobs(userId: number | undefined, page: number) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getJobsByUserPaged({ userId, page, size: 10 }).then((data) => {
      setJobs(data.content);
      setTotalPages(data.page.totalPages);
      setLoading(false);
    });
  }, [userId, page]);

  return { jobs, totalPages, loading };
}

export function useApplications(params: {
  jobPostId: number | null;
  page: number;
  sortBy: string;
  sortDir: string;
  statusFilter: JobApplication["status"][];
}) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!params.jobPostId) return;
    setLoading(true);
    getApplicationsByJob({
      jobPostId: params.jobPostId,
      page: params.page,
      size: 10,
      sortBy: params.sortBy,
      direction: params.sortDir,
      status: params.statusFilter.length > 0 ? params.statusFilter : undefined,
    }).then((data) => {
      setApplications(data.content);
      setTotalPages(data.page.totalPages);
      setLoading(false);
    });
  }, [params.jobPostId, params.page, params.sortBy, params.sortDir, params.statusFilter]);

  return { applications, totalPages, loading, setApplications };
}