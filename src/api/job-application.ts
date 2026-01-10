import type { JobApplication, PageResponse } from "../types";
import api from "./axios";


export type JobApplicationCreatePayload = {
  jobPostId: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  resume?: File | null;
};


export type JobApplicationsGetByJobPayload = {
  jobPostId: number;
};

export type JobApplicationSetStatusPayload = {
  jobApplicationId: number;
  newStatus: string;
  
};

export type getApplicationsByJobPayload = {
  jobPostId: number;
  page: number;
  size: number;
  sortBy?: string;
  direction?: string;
  status?: JobApplication["status"][],
};



export async function createJobApplication(
  payload: JobApplicationCreatePayload
) {
  const formData = new FormData();

  formData.append("jobPostId", String(payload.jobPostId));
  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);

  if (payload.address) {
    formData.append("address", payload.address);
  }

  if (payload.resume) {
    formData.append("resume", payload.resume);
  }

  const response = await api.post(
    "/job-application/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, 
    }
  );

  return response.data;
}




export async function getApplicationsByJob(payload: getApplicationsByJobPayload ): Promise<PageResponse<JobApplication>> {
  const res = await api.get(
    `/job-application/by-job-post`, 
    {
      params: payload,
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();

          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });

          return searchParams.toString();
        },
      },
    }
  )

  return res.data;
}



export async function setApplicationStatus(
  payload: JobApplicationSetStatusPayload
) {
  
  const response = await api.post(
    "/job-application/set-status", payload
  );

  return response.data;
}
