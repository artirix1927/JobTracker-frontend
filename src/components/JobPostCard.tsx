import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";


type JobPostProps = {
  id: number;
  title: string;
  company: string;
  description: string;
  salary: number;
  jobType: string;
  location: string;
  showApplyButton?: boolean; // <-- new prop
};

export default function JobPostCard({
  id,
  title,
  company,
  description,
  salary,
  jobType,
  location,
  showApplyButton = true, // default true
}: JobPostProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const companySearchUrl = `https://www.google.com/search?q=${encodeURIComponent(company)}`;
  const locationMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const formatJobType = (jobType: string) =>
    jobType
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const formatSalary = (amount: number) =>
    amount % 1 === 0 ? amount.toLocaleString() : amount.toFixed(2);

  const monthlyEstimate = salary / 12;

  const isTruncated = useMemo(() => description.length > 300, [description]);

  return (
    <div className="border rounded-md p-4 my-2 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-sm font-medium text-gray-500">{formatJobType(jobType)}</span>
      </div>

      <div className="text-right mb-2">
        <div className="text-lg font-semibold">${formatSalary(salary)} / year</div>
        <div className="text-sm text-gray-400">≈ ${formatSalary(monthlyEstimate)} / month</div>
      </div>

      <a href={companySearchUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 mb-2 block hover:underline">{company}</a>
      <a href={locationMapsUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 mb-2 block hover:underline">{location}</a>

      <div className={`text-gray-800 mb-2 prose transition-all ${!expanded && isTruncated ? "line-clamp-5" : ""}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ className, children, ...props }) {
              const isBlock = String(children).includes("\n");
              return isBlock ? (
                <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto">
                  <code className={className} {...props}>{children}</code>
                </pre>
              ) : (
                <code className="bg-gray-200 px-1 rounded" {...props}>{children}</code>
              );
            },
          }}
        >
          {description}
        </ReactMarkdown>
      </div>

      {showApplyButton && (
        <>
          {isTruncated && (
            <div className="flex justify-between items-center mt-2">
              <button onClick={() => setExpanded(!expanded)} className="text-sm text-blue-600 hover:underline">
                {expanded ? "Show less" : "Show more"}
              </button>

              <button
                onClick={() => navigate(`/apply/${id}`)}
                className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
              >
                Apply
              </button>
            </div>
          )}

          {!isTruncated && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => navigate(`/apply/${id}`)}
                className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
              >
                Apply
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}