import type { JobPost } from "../types";
import api from "./axios";

export type JobPostPayload = {
  title: string;
  company: string;
  description: string;
  salary: number;
  jobType: string;
  location: string;
};

export const createJobPost = async (payload: JobPostPayload) => {
  try {
    const response = await api.post("/job-posts/create", payload); // make sure your backend endpoint matches
    return response.data; // the created JobPost object
  } catch (error: any) {
    console.error("Failed to create job post:", error);
    throw error;
  }
};

export const getAllJobs = async (): Promise<JobPost[]> => {
  const res = await api.get("/job-posts/get-all");
  return res.data;
};