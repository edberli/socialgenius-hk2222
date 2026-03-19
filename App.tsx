import React, { useState, useEffect } from 'react';
import { Platform, StoreAddress, GeneratedContent, Tone, LengthLevel, DEFAULT_BIO, DEFAULT_ADDRESSES, AISettings, DEFAULT_AI_SETTINGS } from './types';
import SettingsPanel from './components/SettingsPanel';
import OutputCard from './components/OutputCard';
import { generatePostContent } from './services/aiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['xhs']);
  const [tone, setTone] = useState<Tone>('professional');
  const [length, setLength] = useState<LengthLevel>('medium');
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [addresses, setAddresses] = useState<StoreAddress[]>(DEFAULT_ADDRESSES);
  
  // AI Settings State (server-controlled preset)
  const [aiSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS);

  // Image State
  const [image, setImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  
  const [results, setResults] = useState<{ xhs?: GeneratedContent; ig?: GeneratedContent }>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Paste Event Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) handleImageFile(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      setImage({
        base64: base64Data,
        mimeType: file.type,
        preview: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const removeImage = () => setImage(null);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (selectedPlatforms.length === 0) return;

    setIsGenerating(true);
    
    const initialResults: { xhs?: GeneratedContent; ig?: GeneratedContent } = {};
    if (selectedPlatforms.includes('xhs')) {
      initialResults.xhs = { platform: 'xhs', variations: [], loading: true };
    }
    if (selectedPlatforms.includes('ig')) {
      initialResults.ig = { platform: 'ig', variations: [], loading: true };
    }
    setResults(initialResults);

    const promises = selectedPlatforms.map(async (platform) => {
      try {
        const variations = await generatePostContent(
          platform, 
          topic, 
          bio, 
          addresses, 
          tone,
          length,
          aiSettings,
          image ? { base64: image.base64, mimeType: image.mimeType } : null
        );
        setResults(prev => ({
          ...prev,
          [platform]: { platform, variations, loading: false }
        }));
      } catch (e: any) {
        setResults(prev => ({
          ...prev,
          [platform]: { platform, variations: [], loading: false, error: e.message || 'Error' }
        }));
      }
    });

    await Promise.all(promises);
    setIsGenerating(false);
  };

  const toneOptions: { value: Tone; label: string; icon: string; desc: string }[] = [
    { value: 'professional', label: '專業', icon: '👔', desc: '痛點與解決方案' },
    { value: 'warm', label: '溫暖', icon: '☕', desc: '親切感性' },
    { value: 'funny', label: '有趣', icon: '🤪', desc: '幽默有梗' },
  ];

  const lengthOptions: { value: LengthLevel; label: string; desc: string }[] = [
    { value: 'short', label: '精簡', desc: '重點列出 (Bullet points)' },
    { value: 'medium', label: '平衡', desc: '標準貼文長度' },
    { value: 'long', label: '詳盡', desc: '深入測評/故事' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              SocialGenius <span className="text-xs text-purple-600 font-normal bg-purple-50 px-2 py-0.5 rounded border border-purple-100">Pro</span>
            </h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-500">
            v2.1 Dual Version
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>📝</span> 創作中心 (Create)
              </h2>

              {/* Tone Slider */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  語氣溫度 (Tone)
                </label>
                <div className="bg-slate-100 p-1 rounded-xl flex mb-1">
                  {toneOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value)}
                      className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-sm transition-all duration-200 ${
                        tone === option.value
                          ? 'bg-white text-purple-700 shadow-sm font-semibold'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                      }`}
                    >
                      <span className="text-lg mb-0.5">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                <div className="text-xs text-center text-slate-400">
                  {toneOptions.find(t => t.value === tone)?.desc}
                </div>
              </div>

              {/* Length Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  內容長度 (Length)
                </label>
                <div className="grid grid-cols-3 gap-2">
                   {lengthOptions.map((opt) => (
                     <button
                        key={opt.value}
                        onClick={() => setLength(opt.value)}
                        className={`py-2 px-2 rounded-lg text-sm border transition-all ${
                          length === opt.value
                            ? 'bg-purple-50 border-purple-400 text-purple-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                     >
                       <div className="mb-0.5">{opt.label}</div>
                       <div className="text-[10px] opacity-70 scale-90">{opt.desc}</div>
                     </button>
                   ))}
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  貼文主題 / 產品賣點
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-base"
                  placeholder="例如：夏季最新款防曬乳，不黏膩，美白效果..."
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  參考圖片 (Optional)
                </label>
                
                {!image ? (
                  <div 
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative group"
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <div className="mx-auto w-10 h-10 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">點擊上傳 或 Ctrl+V 貼上圖片</p>
                      <p className="text-xs text-slate-400">AI 將分析圖片細節生成文案</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={image.preview} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         onClick={removeImage}
                         className="bg-white text-red-500 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-red-50 transition"
                       >
                         移除圖片
                       </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Platform Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  選擇平台模式 (Select Modes)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => togglePlatform('xhs')}
                    className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                      selectedPlatforms.includes('xhs')
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-500'
                    }`}
                  >
                     <span className="text-2xl">📕</span>
                     <span className="font-bold text-sm">小紅書</span>
                     {selectedPlatforms.includes('xhs') && (
                       <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></div>
                     )}
                  </button>

                  <button
                    onClick={() => togglePlatform('ig')}
                    className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                      selectedPlatforms.includes('ig')
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-500'
                    }`}
                  >
                     <span className="text-2xl">📸</span>
                     <span className="font-bold text-sm">Instagram</span>
                     {selectedPlatforms.includes('ig') && (
                       <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500"></div>
                     )}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim() || selectedPlatforms.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-purple-200 transition-all transform active:scale-[0.98] ${
                  isGenerating || !topic.trim() || selectedPlatforms.length === 0
                    ? 'bg-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI 思考中...
                  </span>
                ) : (
                  "✨ 立即生成貼文"
                )}
              </button>
            </div>

            {/* Global Settings */}
            <SettingsPanel 
              bio={bio}
              setBio={setBio}
              addresses={addresses}
              setAddresses={setAddresses}
            />
          </div>

          {/* RIGHT COLUMN: Output */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-6">
               <div className="flex items-center justify-between mb-2">
                 <h2 className="text-xl font-bold text-slate-800">
                   生成結果 (Results)
                 </h2>
                 {Object.keys(results).length > 0 && !isGenerating && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      ✅ 雙版本生成完成
                    </span>
                 )}
               </div>

               {Object.keys(results).length === 0 && !isGenerating ? (
                 <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 min-h-[400px] bg-white">
                   <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                     <span className="text-3xl">✨</span>
                   </div>
                   <p className="text-lg font-medium text-slate-600">準備生成專業貼文</p>
                   <div className="text-sm text-slate-400 mt-2 max-w-xs text-center space-y-1">
                      <p>1. 設定語氣與長度 (精簡/平衡/詳盡)</p>
                      <p>2. 上傳圖片以啟用 AI 視覺分析</p>
                      <p>3. 點擊生成，獲得雙版本文案</p>
                   </div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {results.xhs && (
                     <div className={results.ig ? "col-span-1" : "col-span-1 md:col-span-2"}>
                       <OutputCard data={results.xhs} />
                     </div>
                   )}
                   {results.ig && (
                     <div className={results.xhs ? "col-span-1" : "col-span-1 md:col-span-2"}>
                       <OutputCard data={results.ig} />
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;