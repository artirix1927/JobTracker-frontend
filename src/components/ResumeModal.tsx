import React from "react";
import { Document, Page } from "react-pdf";

interface Props {
  resumePath: string | null;
  onClose: () => void;
}

export default function ResumeModal({ resumePath, onClose }: Props) {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (!resumePath) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black z-10 bg-white rounded-full p-2 shadow"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="bg-gray-100 p-4 flex justify-center items-center gap-4 z-10">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <p>
            Page {pageNumber} of {numPages || "..."}
          </p>
          <button
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => setPageNumber(pageNumber + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-200">
          <Document
            file={`http://localhost:8080/media/${resumePath}`}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-8 text-center">Loading PDF...</div>}
            error={<div className="p-8 text-center text-red-600">Failed to load PDF</div>}
          >
            <div className="flex justify-center py-6">
              <Page
                pageNumber={pageNumber}
                width={Math.min(window.innerWidth * 0.75, 900)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
}
