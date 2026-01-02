
import { useState } from "react";
import JobApplicationForm from "../components/JobApplicationForm";

export default function ApplyPage() {
  const jobPostId = 1; // TODO: get from route params later

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  return (
    <div className="max-w-md mx-auto mt-10">
      <JobApplicationForm
        jobPostId={jobPostId}
        fullName={fullName}
        setFullName={setFullName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        resume={resume}
        setResume={setResume}
        onSuccess={() => {
          setFullName("");
          setEmail("");
          setPhone("");
          setAddress("");
          setResume(null);
        }}
      />
    </div>
  );
}
