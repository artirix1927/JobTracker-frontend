import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // <-- import this
import JobApplicationForm from "../components/JobApplicationForm";

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center">
        {children}
      </div>
    </div>
  );
}



export default function ApplyPage() {
  const { jobId } = useParams<{ jobId: string }>(); // get job id from route
  const jobPostId = Number(jobId); // convert to number

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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

  const isDisabled = success;


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
        disabled={isDisabled} // pass disabled prop
        onSuccess={() => {
          setSuccess(true); // show success mess
        }}
      />
      
      {success && (
        <Modal>
          <p className="text-green-600 font-medium text-lg">
            🎉 Application submitted successfully!
          </p>
          <p className="text-gray-500 mt-2">
            Redirecting back in {countdown} second{countdown !== 1 && "s"}…
          </p>
        </Modal>
      )}
    </div>
  );
}
