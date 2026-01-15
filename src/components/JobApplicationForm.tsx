import { useState } from "react";
import { createJobApplication } from "../api/job-application";
import ResumeModal from "./ResumeModal";
import { useToast } from "../ToastContext";

type JobApplicationFormProps = {
  onSuccess?: () => void;
  onSubmit?: () => void;
  disabled: boolean;

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
  disabled,
  jobPostId,
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  address, setAddress,
  resume, setResume,
}: JobApplicationFormProps) {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const { showToast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Client-side validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      newErrors.email = "Invalid email format";

    if (!phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\+?\d{7,15}$/.test(phone))
      newErrors.phone = "Invalid phone number";

    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix the errors before submitting");
      return;
    }

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

      showToast("Application submitted successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Failed to submit application");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 border rounded-md bg-white"
    >
      <div>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="input bg-slate-50 rounded-md px-4 py-2 w-full"
          disabled={disabled}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="input bg-slate-50 rounded-md px-4 py-2 w-full"
          disabled={disabled}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="input bg-slate-50 rounded-md px-4 py-2 w-full"
          disabled={disabled}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="input bg-slate-50 rounded-md px-4 py-2 w-full"
          disabled={disabled}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
      </div>

      <div>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
          className="input bg-slate-50 rounded-md px-4 py-2 w-full"
          disabled={disabled}
        />
      </div>

    {resume && (
      <div className="mt-2 flex items-center gap-4">
        <p className="text-sm text-gray-600">Uploaded: {resume.name}</p>
        <button
          type="button"
          onClick={() => setShowResumeModal(true)}
          className="text-blue-600 text-sm hover:underline"
        >
          Preview Resume
        </button>
        <button
          type="button"
          onClick={() => setResume(null)}
          className="text-red-500 text-sm hover:underline"
        >
          Remove
        </button>
      </div>
    )}

    {showResumeModal && (
      <ResumeModal resume={resume} onClose={() => setShowResumeModal(false)} />
    )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={disabled}
      >
        Apply
      </button>
    </form>
  );
}