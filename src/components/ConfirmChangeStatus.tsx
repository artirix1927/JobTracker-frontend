import type { JobApplication } from "../types";

interface Props {
    app: JobApplication;
    pendingStatus: JobApplication["status"];
    setPendingStatus: (status: JobApplication["status"] | null) => void;
    onStatusChange: (id: number, status: JobApplication["status"]) => void;
}
  



export const ConfirmChangeStatusModal = ({ app, pendingStatus, setPendingStatus, onStatusChange } : Props) => {



    return (
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
    )
}