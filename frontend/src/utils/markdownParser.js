import unifiedDefault, { unified as unifiedNamed } from 'unified';
const unified = unifiedDefault || unifiedNamed;
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

// Custom AST node types
export const NodeTypes = {
  ROOT: 'root',
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  TEXT: 'text',
  STRONG: 'strong',
  EMPHASIS: 'emphasis',
  CODE: 'code',
  CODE_BLOCK: 'codeBlock',
  LIST: 'list',
  LIST_ITEM: 'listItem',
  LINK: 'link',
  IMAGE: 'image',
  BLOCKQUOTE: 'blockquote',
  THEMATIC_BREAK: 'thematicBreak',
  TABLE: 'table',
  TABLE_ROW: 'tableRow',
  TABLE_CELL: 'tableCell',
};



// Convert single node
function transformNode(node) {
  switch (node.type) {
    case 'root':
      return {
        type: NodeTypes.ROOT,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'paragraph':
      return {
        type: NodeTypes.PARAGRAPH,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'heading':
      return {
        type: NodeTypes.HEADING,
        depth: node.depth,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'text':
      return {
        type: NodeTypes.TEXT,
        value: node.value,
      };
    case 'strong':
      return {
        type: NodeTypes.STRONG,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'emphasis':
      return {
        type: NodeTypes.EMPHASIS,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'inlineCode':
      return {
        type: NodeTypes.CODE,
        value: node.value,
      };
    case 'code':
      return {
        type: NodeTypes.CODE_BLOCK,
        value: node.value,
        lang: node.lang,
      };
    case 'list':
      return {
        type: NodeTypes.LIST,
        ordered: node.ordered,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'listItem':
      return {
        type: NodeTypes.LIST_ITEM,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'link':
      return {
        type: NodeTypes.LINK,
        url: node.url,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'image':
      return {
        type: NodeTypes.IMAGE,
        url: node.url,
        alt: node.alt,
      };
    case 'blockquote':
      return {
        type: NodeTypes.BLOCKQUOTE,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'thematicBreak':
      return {
        type: NodeTypes.THEMATIC_BREAK,
      };
    case 'table':
      return {
        type: NodeTypes.TABLE,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'tableRow':
      return {
        type: NodeTypes.TABLE_ROW,
        children: node.children.map(transformNode).filter(Boolean),
      };
    case 'tableCell':
      return {
        type: NodeTypes.TABLE_CELL,
        children: node.children.map(transformNode).filter(Boolean),
      };
    default:
      return null;
  }
}

// Parse Markdown text to custom AST
export function parseMarkdown(markdown) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm);

  const remarkAST = processor.parse(markdown);
  return transformNode(remarkAST);
}

// Validate AST structure
export function validateAST(ast) {
  if (!ast || typeof ast !== 'object') {
    throw new Error('Invalid AST: must be an object');
  }

  if (ast.type !== NodeTypes.ROOT) {
    throw new Error('Invalid AST: root node must be of type ROOT');
  }

  if (!Array.isArray(ast.children)) {
    throw new Error('Invalid AST: root node must have children array');
  }

  return true;
}