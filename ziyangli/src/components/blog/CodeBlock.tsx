import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
      style={isDarkMode ? oneDark : oneLight}
      customStyle={{
        borderRadius: '6px',
        fontSize: '0.9em',
        margin: '0.75rem 0',
        padding: '1rem',
      }}
      showLineNumbers={false}
    >
      {children.trim()}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
