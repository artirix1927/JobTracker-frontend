import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // <-- import this
import JobApplicationForm from "../components/JobApplicationForm";

export default function ApplyPage() {
  const { jobId } = useParams<{ jobId: string }>(); // get job id from route
  const jobPostId = Number(jobId); // convert to number

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const [countdown, setCountdown] = useState(3);

  const navigate = useNavigate();

  useEffect(() => {
    if (!success) return;

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate(-1);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [success, navigate]);


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
          setSuccess(true); // show success mess
        }}
      />
      
      {success && (
        <div className="text-center text-green-600 mt-4">
          <p className="font-medium">Application submitted successfully!</p>
          <p className="text-sm text-gray-500 mt-1">
            Redirecting back in {countdown} second{countdown !== 1 && "s"}…
          </p>
        </div>
      )}
    </div>
  );
}
