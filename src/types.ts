export type JobPost = {
  id: number;
  title: string;
  company: string;
  description: string;
  salary: number;
  jobType: string;
  location: string;
};


export type JobApplication = {

  id: number;
  userId: number;
  jobPostId: number;
  appliedAt: Date;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  resumePath: string;
  resumeFilename: string;
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";


}

export type PageResponse<T> = {
  content: T[];
  page: Page;
};


export type Page = {
  number: number; // current page
  size: number;
  totalPages: number;
  totalElements: number;
  
};
