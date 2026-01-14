import { createJobPost } from "../api/job-post";
import { useToast } from "../ToastContext";

type JobPostFormProps = {
  onSuccess?: () => void;
  title: string;
  setTitle: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  salary: number;
  setSalary: (v: number) => void;
  jobType: string;
  setJobType: (v: string) => void;
  location:string, 
  setLocation: (v: string) => void;
};

export default function JobPostForm({
  onSuccess,
  title, setTitle,
  company, setCompany,
  description, setDescription,
  salary, setSalary,
  jobType, setJobType,
  location, setLocation,
}: JobPostFormProps) {

  const { showToast } = useToast()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJobPost({
        title,
        company,
        description,
        salary,
        jobType,
        location,
      });
      showToast("Job post created!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Failed to create job post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 border rounded-md bg-white">

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title" 
      className="input bg-slate-50 rounded-md px-4 py-2"  />

      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" 
      className="input  bg-slate-50 rounded-md px-4 py-2"/>

      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" 
      className="input  bg-slate-50 rounded-md px-4 py-2"/>

      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" 
      className="input bg-slate-50 rounded-md px-4 py-2"/>

      <input value={salary} onChange={(e) => setSalary(parseFloat(e.target.value))} placeholder="Salary" type="number" step="0.01" 
      className="input bg-slate-50 rounded-md px-4 py-2"/>

      <select value={jobType} onChange={(e) => setJobType(e.target.value)} 
      className="input bg-slate-50 rounded-md px-4 py-2">
        <option value="FULL_TIME">Full-time</option>
        <option value="PART_TIME">Part-time</option>
        <option value="CONTRACT">Contract</option>
        <option value="INTERN">Intern</option>
      </select>
      <button 
        type="submit"
        disabled={!title || !company} 
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Post Job
      </button>
    </form>
  );
}
