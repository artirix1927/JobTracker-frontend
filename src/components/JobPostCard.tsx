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
  return (
    <div className="border rounded-md p-4 my-2 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-sm font-medium text-gray-500">{jobType}</span>
      </div>
      <div className="text-gray-700 mb-2">{company}</div>
      <div className="text-gray-700 mb-2">{location}</div>
      <div className="text-gray-800 mb-2 prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ className, children, ...props }) {
              // Detect block code: if children contain a newline
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

              // Inline code
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
      <div className="text-right font-semibold">
        ${salary.toFixed(2)}
      </div>
    </div>
  );
}