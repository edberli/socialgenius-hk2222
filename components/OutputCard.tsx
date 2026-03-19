import React, { useState } from 'react';
import { GeneratedContent } from '../types';

interface OutputCardProps {
  data: GeneratedContent;
}

const OutputCard: React.FC<OutputCardProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 or 1 for variations

  const currentContent = data.variations && data.variations[activeTab] 
    ? data.variations[activeTab] 
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isXHS = data.platform === 'xhs';
  const themeColor = isXHS ? 'red' : 'purple';
  
  // Dynamic classes based on theme
  const borderColor = isXHS ? 'border-red-100' : 'border-purple-100';
  const titleColor = isXHS ? 'text-red-600' : 'text-purple-600';
  const bgColor = isXHS ? 'bg-red-50' : 'bg-purple-50';
  const icon = isXHS ? '📕' : '📸';
  const title = isXHS ? '小紅書 (Red Note)' : 'Instagram';

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden flex flex-col h-full shadow-sm`}>
      <div className="px-5 py-3 border-b border-white/50 flex flex-col gap-3 bg-white/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h3 className={`font-bold ${titleColor} flex items-center gap-2`}>
            <span>{icon}</span> {title}
          </h3>
          <button
            onClick={handleCopy}
            disabled={!currentContent}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition flex items-center gap-1 ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                已複製
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                複製
              </>
            )}
          </button>
        </div>

        {/* Variation Tabs */}
        {!data.loading && !data.error && data.variations && data.variations.length > 0 && (
          <div className="flex p-1 bg-white/60 rounded-lg border border-slate-200/50">
            {data.variations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === idx
                    ? `bg-white shadow-sm text-${themeColor}-600`
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {idx === 0 ? '版本 1 (直接有力)' : '版本 2 (氛圍故事)'}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto min-h-[300px] max-h-[500px]">
        {data.loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-60">
            <div className={`w-8 h-8 border-4 ${isXHS ? 'border-red-400' : 'border-purple-400'} border-t-transparent rounded-full animate-spin`}></div>
            <p className="text-sm font-medium animate-pulse">
              正在生成雙版本文案...
            </p>
          </div>
        ) : data.error ? (
           <div className="h-full flex flex-col items-center justify-center text-red-500 p-4 text-center">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <p className="text-sm">{data.error}</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-slate-700 leading-relaxed animate-fadeIn">
            {currentContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputCard;