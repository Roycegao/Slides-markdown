import React from 'react';
import { NodeTypes } from '../utils/markdownParser';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';

// 导入语言支持
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import yaml from 'highlight.js/lib/languages/yaml';

// 注册语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml); // HTML 使用 XML 的高亮规则
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('yaml', yaml);

function highlightCode(code, language) {
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language }).value;
    } catch (err) {
      console.error('Error highlighting code:', err);
    }
  }
  return code;
}

function renderNode(node) {
  if (!node) return null;
  switch (node.type) {
    case NodeTypes.ROOT:
      return <>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</>;
    case NodeTypes.PARAGRAPH:
      return <p>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</p>;
    case NodeTypes.HEADING:
      const Tag = `h${node.depth}`;
      return <Tag>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</Tag>;
    case NodeTypes.TEXT:
      return node.value;
    case NodeTypes.STRONG:
      return <strong>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</strong>;
    case NodeTypes.EMPHASIS:
      return <em>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</em>;
    case NodeTypes.CODE:
      return <code>{node.value}</code>;
    case NodeTypes.CODE_BLOCK:
      const highlightedCode = highlightCode(node.value, node.lang);
      return (
        <pre>
          <code 
            className={node.lang ? `hljs language-${node.lang}` : undefined}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      );
    case NodeTypes.LIST:
      return node.ordered ? (
        <ol>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</ol>
      ) : (
        <ul>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</ul>
      );
    case NodeTypes.LIST_ITEM:
      return <li>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</li>;
    case NodeTypes.LINK:
      return <a href={node.url} target="_blank" rel="noopener noreferrer">{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</a>;
    case NodeTypes.IMAGE:
      return <img src={node.url} alt={node.alt || ''} style={{ maxWidth: '100%' }} />;
    case NodeTypes.BLOCKQUOTE:
      return <blockquote>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</blockquote>;
    case NodeTypes.THEMATIC_BREAK:
      return <hr />;
    case NodeTypes.TABLE:
      return <table><tbody>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</tbody></table>;
    case NodeTypes.TABLE_ROW:
      return <tr>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</tr>;
    case NodeTypes.TABLE_CELL:
      return <td>{node.children && node.children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)}</td>;
    default:
      return null;
  }
}

export default function MarkdownASTRenderer({ ast }) {
  return <div className="markdown-ast-renderer">{renderNode(ast)}</div>;
} 