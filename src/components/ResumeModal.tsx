import React, { useEffect } from "react";
import { Document, Page } from "react-pdf";

interface Props {
  resume: File | string | null; // File for local, string for server path
  onClose: () => void;
}

export default function ResumeModal({ resume, onClose }: Props) {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        onClose(); // just call the existing onClose callback
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!resume) return null;

  const fileProp =
    typeof resume === "string" ? `http://localhost:8080/media/${resume}` : resume;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative flex flex-col animate-scale-in">
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
            file={fileProp}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-8 text-center">Loading PDF...</div>}
            error={<div className="p-8 text-center text-red-600">Failed to load PDF</div>}
          >
            <div className="flex justify-center py-6">
              <Page
                pageNumber={pageNumber}
                scale={1.4}
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
