import { Box, Button, Typography, Divider } from "@mui/material";
import "../styles/markdown_dark.css";

import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import NavigationBar from "@/components/NavigationBar";
import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getFromSessionStorage } from "@/lib/session";
import { useGetMappingDoc } from "../hooks/use-workflow";

const MappingDoc = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const getMappingDocMutation = useGetMappingDoc();
  const [markdownContent, setMarkdownContent] = useState("");

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

  useEffect(() => {
    const handleGetMappingDoc = () => {
      const thread_id = getFromSessionStorage("thread_id");

      const payload = {
        thread_id,
      };

      const headers = {
        accept: "application/json",
        "Content-Type": "application/json",
      };

      getMappingDocMutation.mutate(
        { payload, headers },
        {
          onSuccess: (data) => {
            if (data) setMarkdownContent(data);
          },
        }
      );
    };

    handleGetMappingDoc();
  }, []);

  return (
    <>
      <NavigationBar />
      <Box
        sx={{
          height: "95vh",
          maxHeight: "100vh",
          overflowY: "auto",
          p: 3,
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography variant="h3" sx={{ color: "#7c64e8ff" }}>
            Mapping Document
          </Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={handleDownloadPrint}
            sx={{
              fontWeight: 600,
              "&:disabled": {
                cursor: "no-drop",
                pointerEvents: "auto",
                color: "#9ca3af !important",
              },
              background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
              "&:hover": {
                background: true
                  ? "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))"
                  : "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
              },
            }}
          >
            Download PDF
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <div ref={printRef} className="markdown-body">
          <Box sx={{ mx: 5 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
              {markdownContent}
            </ReactMarkdown>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default MappingDoc;
