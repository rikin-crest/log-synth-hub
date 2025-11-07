import { Box } from "@mui/material";
import "../styles/markdown_light.css";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import markdown from "../data/output.md?raw";
import NavigationBar from "@/components/NavigationBar";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const MappingDoc = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPrint = useReactToPrint({
    contentRef: printRef,
    bodyClass: "markdown-body",
    pageStyle: `
      @media print {
        body {
          background: white;
        }
        .markdown-body table{
          table-layout: auto !important;
          width: 96% !important;
          margin: 0 auto !important;
        }
        .markdown-body th, td {
          white-space: normal !important;
          word-break: break-word !important;
        }
        .markdown-body {
          background: white !important;
          color: black !important;
        }
        .markdown-body pre {
          background-color: #f6f8fa !important;
          border: 1px solid #ddd !important;
        }
        .markdown-body code {
          background-color: #f6f8fa !important;
          color: #24292e !important;
        }
        
      }
    `,
  });

  return (
    <>
      <NavigationBar />
      <Box
        component="div"
        className="markdown-body"
        sx={{
          height: "90vh",
          maxHeight: "100vh",
          overflowY: "auto",
          p: 3,
          mb: 5,
        }}
      >
        <button type="button" onClick={handleDownloadPrint}>
          Download as PDF
        </button>
        <div ref={printRef}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </Box>
    </>
  );
};

export default MappingDoc;
