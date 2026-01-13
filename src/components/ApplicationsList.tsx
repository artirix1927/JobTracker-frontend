import type { JobApplication } from "../types";
import ApplicationItem from "./ApplicationItem";

interface Props {
  applications: JobApplication[];
  onStatusChange: (id: number, status: JobApplication["status"]) => void;
  onViewResume: (path: string) => void;
  highlightedAppId?: number | null;
}

export default function ApplicationsList({ applications, onStatusChange, onViewResume, highlightedAppId }: Props) {
  if (applications.length === 0) return <p>No applications yet.</p>;

  return (
    <>
      {applications.map((app) => (
        <ApplicationItem
          key={app.id}
          app={app}
          onStatusChange={onStatusChange}
          onViewResume={onViewResume}
          highlighted={app.id === highlightedAppId}
        />
      ))}
    </>
  );
}