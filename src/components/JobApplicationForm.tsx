import { createJobApplication } from "../api/job-application";

type JobApplicationFormProps = {
  onSuccess?: () => void;
  onSubmit?: () => void;
  jobPostId: number;

  fullName: string;
  setFullName: (v: string) => void;

  email: string;
  setEmail: (v: string) => void;

  phone: string;
  setPhone: (v: string) => void;

  address: string;
  setAddress: (v: string) => void;

  resume: File | null;
  setResume: (v: File | null) => void;
};

export default function JobApplicationForm({
  onSuccess,
  onSubmit,
  jobPostId,
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  address, setAddress,
  resume, setResume,
}: JobApplicationFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
    try {
     
        await createJobApplication({
            jobPostId,
            fullName,
            email,
            phone,
            address,
            resume,
            });

        if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit application");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-4 border rounded-md bg-white"
    >
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        className="input bg-slate-50 rounded-md px-4 py-2"
        required
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="input bg-slate-50 rounded-md px-4 py-2"
        required
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        className="input bg-slate-50 rounded-md px-4 py-2"
        required
      />

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        className="input bg-slate-50 rounded-md px-4 py-2"
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResume(e.target.files?.[0] || null)}
        className="input bg-slate-50 rounded-md px-4 py-2"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </form>
  );
}