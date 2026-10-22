/**
 * ============================================================================
 * UXU DESIGN SYSTEM — JSX/TSX CODE GENERATOR SERVICE (SRP)
 * ============================================================================
 * [SRP] Generates clean, formatted React TypeScript usage snippets dynamically
 * from playground state without coupling UI components to string serialization.
 */

export interface CodeGenConfig {
  componentName: string;
  importPath: string;
  props: Record<string, string | number | boolean | undefined>;
  childrenCode?: string;
}

export type CodeTokenType =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'tag'
  | 'number'
  | 'plain';

export interface CodeToken {
  type: CodeTokenType;
  value: string;
}

const TOKEN_REGEX =
  /(\/\/[^\n]*|#[^\n]*)|('[^'\n]*'|"[^"\n]*"|`[^`]*`)|\b(import|from|export|function|return|const|let|var|true|false|undefined|type|interface)\b|(<\/?[A-Za-z][A-Za-z0-9.]*|\/>)|\b(\d+(?:\.\d+)?)\b/g;

export class CodeGeneratorService {
  public static generateSnippet(config: CodeGenConfig): string {
    const { componentName, importPath, props, childrenCode } = config;

    const formattedProps = Object.entries(props)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? `  ${key}` : `  ${key}={false}`;
        }
        if (typeof value === 'number') {
          return `  ${key}={${value}}`;
        }
        return `  ${key}="${value}"`;
      });

    const propsBlock =
      formattedProps.length > 0 ? `\n${formattedProps.join('\n')}\n` : ' ';

    const elementBlock = childrenCode
      ? `<${componentName}${propsBlock}>\n  ${childrenCode}\n</${componentName}>`
      : `<${componentName}${propsBlock.trimEnd()} />`;

    return `import { ${componentName} } from '${importPath}';\n\nexport function Example() {\n  return (\n    ${elementBlock.split('\n').join('\n    ')}\n  );\n}`;
  }

  public static tokenize(code: string): CodeToken[] {
    const tokens: CodeToken[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    TOKEN_REGEX.lastIndex = 0;

    while ((match = TOKEN_REGEX.exec(code)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'plain',
          value: code.slice(lastIndex, match.index),
        });
      }

      if (match[1]) {
        tokens.push({ type: 'comment', value: match[1] });
      } else if (match[2]) {
        tokens.push({ type: 'string', value: match[2] });
      } else if (match[3]) {
        tokens.push({ type: 'keyword', value: match[3] });
      } else if (match[4]) {
        tokens.push({ type: 'tag', value: match[4] });
      } else if (match[5]) {
        tokens.push({ type: 'number', value: match[5] });
      }

      lastIndex = TOKEN_REGEX.lastIndex;
    }

    if (lastIndex < code.length) {
      tokens.push({
        type: 'plain',
        value: code.slice(lastIndex),
      });
    }

    return tokens;
  }
}
