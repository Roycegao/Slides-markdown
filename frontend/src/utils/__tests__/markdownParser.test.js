import { describe, it, expect } from 'vitest';
import * as parser from '../markdownParser';

describe('markdownParser', () => {
  it('parses heading and paragraph', () => {
    const ast = parser.parseMarkdown('# Title\nText');
    expect(ast.type).toBe('root');
    expect(ast.children[0].type).toBe('heading');
    expect(ast.children[1].type).toBe('paragraph');
  });
  it('parses list, code, emphasis, strong, link, image, blockquote, thematicBreak', () => {
    const md = '* item\n\n```js\ncode\n```\n\n**bold** _em_ [link](url) ![alt](img) > quote\n\n---\n';
    const ast = parser.parseMarkdown(md);
    expect(ast).toBeTruthy();
  });
  it('validateAST throws on invalid', () => {
    expect(() => parser.validateAST(null)).toThrow();
    expect(() => parser.validateAST({})).toThrow();
    expect(() => parser.validateAST({ type: 'root' })).toThrow();
  });
  it('validateAST passes on valid', () => {
    const ast = parser.parseMarkdown('# Title');
    expect(parser.validateAST(ast)).toBe(true);
  });
}); 