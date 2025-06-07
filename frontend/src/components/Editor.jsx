import React from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

export default function Editor({ markdown, onChange }) {
  const handleEditorChange = ({ text }) => {
    onChange(text);
  };

  return (
    <div className="editor-wrapper">
      <MdEditor
        value={markdown}
        style={{ height: "100vh" }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        config={{
          view: {
            menu: true,   // 工具栏
            md: true,     // 只显示 Markdown 编辑区
            html: false,  // 不显示 HTML 预览区
            both: false,  // 不显示同步滚动按钮
            fullScreen: false // 不显示全屏按钮
          }
        }}
      />
    </div>
  );
}
