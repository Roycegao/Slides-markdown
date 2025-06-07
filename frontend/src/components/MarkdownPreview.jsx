import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

// 样式文件（highlight.js 代码高亮）
import "highlight.js/styles/github.css";

export default function MarkdownPreview({ content }) {
  return (
    <div className="preview-area" style={{ width: '100%' }}>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            return !inline ? (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th style={{ border: "1px solid #ccc", padding: "8px", backgroundColor: "#f9f9f9" }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {children}
            </td>
          )
        }}
      />
    </div>
  );
}
