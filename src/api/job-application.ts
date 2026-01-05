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

export type JobApplicationSetStatus = {
  jobApplicationId: number;
  newStatus: string;
  
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



export async function getApplicationsByJob(
  payload: JobApplicationsGetByJobPayload
) {
  
  const response = await api.get(
    "/job-application/by-job-post", {params: payload }
  );

  return response.data;
}



export async function setApplicationStatus(
  payload: JobApplicationSetStatus
) {
  
  const response = await api.post(
    "/job-application/set-status", payload
  );

  return response.data;
}
