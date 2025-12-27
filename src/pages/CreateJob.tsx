import { useState } from "react";
import JobPostForm from "../components/JobPostForm";
import JobPostCard from "../components/JobPostCard";

export default function CreateJobPage() {
  // Shared state for live preview
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState(0);
  const [jobType, setJobType] = useState("FULL_TIME");
  const [location, setLocation] = useState("")

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/* Form */}
      <div className="md:w-1/2">
        <JobPostForm
          onSuccess={() => {
            // Optional: reset form after submit
            setTitle("");
            setCompany("");
            setDescription("");
            setSalary(0);
            setJobType("FULLTIME");
            setLocation("");
          }}
          // Pass setters to form to allow live update
          title={title}
          setTitle={setTitle}
          company={company}
          setCompany={setCompany}
          description={description}
          setDescription={setDescription}
          salary={salary}
          setSalary={setSalary}
          jobType={jobType}
          setJobType={setJobType}
          location={location}
          setLocation={setLocation}
        />
      </div>

      {/* Live Preview */}
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
        <JobPostCard
          title={title || "Job Title"}
          company={company || "Company Name"}
          location={location || "Location"}
          description={description || "Job description..."}
          salary={salary}
          jobType={jobType}
          
        />
      </div>
    </div>
  );
}
