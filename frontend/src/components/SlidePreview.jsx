import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight'; // Ensure rehypeHighlight is imported
import 'highlight.js/styles/github.css';

// Add language support
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

// Register languages
import hljs from 'highlight.js/lib/core';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml); // Use XML highlighting rules for HTML
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('yaml', yaml);

const SlidePreview = ({ 
  content, 
  layout = 'default', 
  metadata = {}, 
  currentIndex = 0, 
  totalSlides = 0,
  isFullscreen = false,
  isMobile = false
}) => {
  const commonProps = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
    components: {
      code({ node, inline, className, children, ...props }) {
        let rawCodeText = '';
        if (Array.isArray(children)) {
            // Attempt to extract text content from each child
            rawCodeText = children.map(child => {
                if (typeof child === 'string') {
                    return child;
                } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
                    return child.props.children;
                }
                return ''; // Fallback for unexpected child types
            }).join('');
        } else {
            // If children is not an array, it should be a string (or some other primitive)
            rawCodeText = String(children);
        }

        const match = /language-(\w+)/.exec(className || '');
        const lang = match && match[1] ? match[1] : '';

        let highlightedCodeHtml = rawCodeText; // Default to raw if highlighting fails
        try {
            if (lang && hljs.getLanguage(lang)) {
                highlightedCodeHtml = hljs.highlight(rawCodeText, { language: lang, ignoreIllegals: true }).value;
            } else {
                highlightedCodeHtml = hljs.highlightAuto(rawCodeText).value;
            }
        } catch (e) {
            console.error("Error highlighting code:", e);
        }

        return !inline ? (
            <pre className={className}>
                <code
                    className={`hljs language-${lang}`}
                    dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }}
                    {...props}
                />
            </pre>
        ) : (
            <code className={className} {...props}>
                {rawCodeText}
            </code>
        );
      }
    }
  };

  function renderContent() {
    switch (layout) {
      case 'title':
        return (
          <div className="slide-layout-title">
            <div className="slide-content">
              <ReactMarkdown {...commonProps}>
                {content || ''}
              </ReactMarkdown>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="slide-layout-code">
            <div className="code-content">
              <ReactMarkdown {...commonProps}>
                {content || ''}
              </ReactMarkdown>
            </div>
            {metadata.explanation && (
              <div className="explanation">
                <h3>{metadata.language ? `${metadata.language} Code Explanation` : 'Code Explanation'}</h3>
                <div className="explanation-content">
                  <ReactMarkdown {...commonProps}>
                    {typeof metadata.explanation === 'string' ? metadata.explanation : ''}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );

      case 'split':
        const [leftContent, rightContent] = (content || '').split('---').map(s => s.trim());
        return (
          <div className="slide-layout-split">
            <div className="left-content">
              {metadata.leftTitle && <h3>{metadata.leftTitle}</h3>}
              <div className="content-wrapper">
                <ReactMarkdown {...commonProps}>
                  {leftContent}
                </ReactMarkdown>
              </div>
            </div>
            <div className="right-content">
              {metadata.rightTitle && <h3>{metadata.rightTitle}</h3>}
              <div className="content-wrapper">
                <ReactMarkdown {...commonProps}>
                  {rightContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="slide-layout-image">
            <div className="image-content">
              {metadata.imageUrl && (
                <img 
                  src={metadata.imageUrl} 
                  alt={metadata.caption || ''} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '70vh',
                    objectFit: 'contain'
                  }} 
                />
              )}
            </div>
            {metadata.caption && (
              <div className="caption">
                <ReactMarkdown {...commonProps}>
                  {metadata.caption}
                </ReactMarkdown>
              </div>
            )}
            <div className="content-wrapper">
              <ReactMarkdown {...commonProps}>
                {content || ''}
              </ReactMarkdown>
            </div>
          </div>
        );

      default:
        return (
          <div className="slide-layout-default">
            <div className="content-wrapper">
              <ReactMarkdown {...commonProps}>
                {content || ''}
              </ReactMarkdown>
            </div>
          </div>
        );
    }
  }

  return (
    <div className={`slide-preview-component ${isFullscreen ? 'fullscreen' : ''}`} style={{ backgroundColor: 'transparent' }}>
      {isFullscreen && !isMobile && (
        <div className="slide-page-number">
          {currentIndex + 1}/{totalSlides}
        </div>
      )}
      <div className={`slide-layout-${layout}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default SlidePreview;
