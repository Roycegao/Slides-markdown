import { describe, it, expect } from 'vitest';
import * as parser from '../../utils/markdownParser';

describe('markdownParser', () => {
  it('parses markdown to AST', () => {
    const ast = parser.parseMarkdown('# Title');
    expect(ast).toBeTruthy();
    expect(ast.type).toBe('root');
    expect(ast.children[0].type).toBe('heading');
  });
}); 