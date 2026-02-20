import { MarkdownRenderer } from './MarkdownRenderer';

export function Message({ role, content }) {
  const isAi = role === 'assistant' || role === 'system';

  return (
    <div
      className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl shadow-sm ${
          isAi
            ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            : 'bg-brand-medium text-white rounded-tr-none'
        }`}
      >
        {/* Label */}
        <div
          className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${isAi ? 'text-brand-medium opacity-60' : 'text-blue-200'}`}
        >
          {isAi ? 'AI Tutor' : 'You'}
        </div>

        {/* Conteúdo */}
        <div className={isAi ? 'text-slate-700' : 'text-white'}>
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
