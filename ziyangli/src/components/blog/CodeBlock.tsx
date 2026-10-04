import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';

interface CodeBlockProps {
  children: string;
  language?: string;
}

/**
 * Code block component with syntax highlighting
 * Automatically switches theme based on dark/light mode
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'typescript' }) => {
  const { isDarkMode } = useTheme();

  return (
    <SyntaxHighlighter
      language={language}
      style={isDarkMode ? vscDarkPlus : vs}
      customStyle={{
        borderRadius: '6px',
        fontSize: '0.9em',
        margin: '0.75rem 0',
        padding: '1rem',
        lineHeight: '1.5',
        overflow: 'auto',
        fontWeight: 500,
        backgroundColor: isDarkMode ? '#25231e' : '#fff9ea',
        border: '1px solid var(--rule)',
        boxShadow: 'inset 0 2px 5px #0002, 0 1px var(--highlight)',
      }}
      codeTagProps={{
        style: {
          lineHeight: '1.5',
          display: 'block',
          fontWeight: 500,
          background: 'transparent',
        }
      }}
      showLineNumbers={false}
      PreTag="div"
      wrapLines={false}
    >
      {children.trim()}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
