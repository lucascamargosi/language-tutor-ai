import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import React from 'react';
import { CodeBlock } from './CodeBlock';

export function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        code: CodeBlock,

        // Previne <pre> dentro de <p>
        p: ({ children, ...props }) => {
          const hasBlockElement = React.Children.toArray(children).some(
            (child) =>
              child?.type === 'div' ||
              child?.type === 'pre' ||
              child?.type === CodeBlock ||
              child?.props?.node?.tagName === 'pre',
          );
          return hasBlockElement ? (
            <>{children}</>
          ) : (
            <p className="mb-4 leading-7 last:mb-0" {...props}>
              {children}
            </p>
          );
        },

        // Evita <pre> extra do react-markdown quando o CodeBlock ja renderiza o bloco
        pre: ({ children }) => <>{children}</>,

        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mb-3 mt-4 first:mt-0">
            {children}
          </h3>
        ),

        // Listas
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 space-y-1.5">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 space-y-1.5">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic bg-blue-50/50 rounded-r">
            {children}
          </blockquote>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline hover:no-underline"
          >
            {children}
          </a>
        ),

        // Tabelas
        table: ({ children }) => (
          <div className="overflow-x-auto my-5 rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-slate-50">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white divide-y divide-slate-200">
            {children}
          </tbody>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm text-slate-700">{children}</td>
        ),

        // Texto
        strong: ({ children }) => (
          <strong className="font-semibold text-slate-900">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="my-6 border-slate-200" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
