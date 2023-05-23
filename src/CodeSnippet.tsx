import React from 'react';
import styled from 'styled-components';

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
`;

const Code = styled.code`
  color: #333;
`;

const Keyword = styled.span`
  color: #a55eea;
`;

const String = styled.span`
  color: #fd9644;
`;

const Comment = styled.span`
  color: #bdc3c7;
`;

const CodeSnippet = ( props: any ) => {
  const highlightCode = (code: string) => {
    // You can customize the syntax highlighting logic here
    // For simplicity, let's assume keywords, strings, and comments
    // are enclosed in certain characters or patterns

    const highlightedCode = code.replace(
      /(\bconst\b|\blet\b|\bfunction\b|\breturn\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\bdo\b)/g,
      (match: any) => `<Keyword>${match}</Keyword>`
    );

    return highlightedCode;
  };

  const formattedCode = highlightCode(props.code);

  return (
    <CodeBlock>
      <Code dangerouslySetInnerHTML={{ __html: formattedCode }} />
    </CodeBlock>
  );
};

export default CodeSnippet;
