
import type { JobApplication } from "../types";

const statusClasses: Record<JobApplication["status"], string> = {
  APPLIED: "bg-yellow-100 text-yellow-800",
  INTERVIEW: "bg-blue-100 text-blue-800",
  OFFER: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

interface Props {
  app: JobApplication;
  onStatusChange: (id: number, status: JobApplication["status"]) => void;
  onViewResume: (path: string) => void;
}

export default function ApplicationItem({ app, onStatusChange, onViewResume }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4 flex justify-between items-start">
      {/* LEFT: applicant info */}
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          {app.fullName.charAt(0)}
        </div>

        <div>
          <h3 className="font-semibold text-lg">{app.fullName}</h3>
          <p className="text-sm text-gray-600">
            <a href={`mailto:${app.email}`} className="hover:underline">
              {app.email}
            </a>
          </p>
          <p className="text-sm text-gray-600">{app.phone}</p>
          {app.address && <p className="text-sm text-gray-500 mt-1">📍 {app.address}</p>}
        </div>
      </div>

      {/* RIGHT: actions */}
      <div className="flex flex-col items-end gap-2">
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app.id, e.target.value as JobApplication["status"])}
          className={`text-xs px-2 py-1 rounded-full border bg-white cursor-pointer ${statusClasses[app.status]}`}
        >
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {app.resumePath && (
          <button
            onClick={() => onViewResume(app.resumePath)}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
          >
            View Resume
          </button>
        )}
      </div>
    </div>
  );
}