
import { useState } from "react";
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
  highlighted?: boolean;
  
}

export default function ApplicationItem({ app, onStatusChange, onViewResume, highlighted}: Props) {


  const flashClass =
  highlighted && app.status === "OFFER"
    ? "bg-green-100"
    : highlighted && app.status === "REJECTED"
    ? "bg-red-100"
    : "";

  
  const [pendingStatus, setPendingStatus] =
    useState<JobApplication["status"] | null>(null);



  return (
    <div className={`rounded-lg shadow-sm border p-4 mb-4 
                     flex justify-between items-start ${flashClass || "bg-white"} 
                     transition-colors duration-700 ease-out`}>
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
          onChange={(e) =>
            setPendingStatus(
              e.target.value as JobApplication["status"]
            )
          }
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

      {pendingStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm shadow-lg">
            <h3 className="font-semibold text-lg mb-2">
              Confirm status change
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Change status from <b>{app.status}</b> to{" "}
              <b>{pendingStatus}</b>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingStatus(null)}
                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onStatusChange(app.id, pendingStatus);
                  setPendingStatus(null);
                }}
                className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}