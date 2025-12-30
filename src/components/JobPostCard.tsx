import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type JobPostProps = {
  title: string;
  company: string;
  description: string;
  salary: number;
  jobType: string;
  location: string;
};
export default function JobPostCard({
  title,
  company,
  description,
  salary,
  jobType,
  location,
}: JobPostProps) {
  const companySearchUrl = `https://www.google.com/search?q=${encodeURIComponent(company)}`;
  const locationMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  function formatJobType(jobType: string) {
    return jobType
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  
  const formatSalary = (amount: number) => {
    return amount % 1 === 0 ? amount.toLocaleString() : amount.toFixed(2);
  };

  const monthlyEstimate = salary / 12;

  return (
    <div className="border rounded-md p-4 my-2 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-sm font-medium text-gray-500">{formatJobType(jobType)}</span>
      </div>

      {/* Salary at the top */}
      <div className="text-right mb-2">
        <div className="text-lg font-semibold">${formatSalary(salary)} / year</div>
        <div className="text-sm text-gray-400">≈ ${formatSalary(monthlyEstimate)} / month</div>
      </div>

      {/* Company → Google */}
      <a
        href={companySearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 mb-2 block hover:underline"
      >
        {company}
      </a>

      {/* Location → Google Maps */}
      <a
        href={locationMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 mb-2 block hover:underline"
      >
        {location}
      </a>

      <div className="text-gray-800 mb-2 prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ className, children, ...props }) {
              const isBlock = String(children).includes("\n");

              if (isBlock) {
                return (
                  <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              }

              return (
                <code className="bg-gray-200 px-1 rounded" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
    </div>
  );
}