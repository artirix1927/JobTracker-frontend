import type { JobPost } from "../types";


type Props = {
  job: JobPost;
  selected: boolean;
  onClick: () => void;
};

export default function JobListItem({ job, selected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 
                transition-all duration-150 ease-out active:scale-[0.99]
                ${selected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
        
      }`}
    >
      <h3 className="font-semibold">{job.title}</h3>
      <div className="text-sm text-gray-600">{job.company}</div>
      <div className="text-sm text-gray-500">{job.location}</div>
    </div>
  );
}