import React, { useState } from 'react';

const normalizeCodeContent = (children) => {
  if (typeof children === 'string') return children.replace(/\n$/, '');
  if (Array.isArray(children)) {
    const joined = children.map((child) => {
      if (typeof child === 'string') return child;
      if (React.isValidElement(child)) return child.props?.children || '';
      return '';
    });
    return joined.join('').replace(/\n$/, '');
  }
  if (React.isValidElement(children)) {
    return (children.props?.children || '').toString().replace(/\n$/, '');
  }
  return '';
};

export function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = normalizeCodeContent(children);

  // Codigo inline
  if (inline) {
    return (
      <code
        className="bg-slate-200/80 text-rose-600 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {content}
      </code>
    );
  }

  // Bloco de código
  return (
    <div className="not-prose my-4 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900">
      <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 text-xs border-b border-slate-700/50">
        <span className="font-mono uppercase tracking-wider text-slate-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-slate-100 font-mono" {...props}>
          {content}
        </code>
      </pre>
    </div>
  );
}
