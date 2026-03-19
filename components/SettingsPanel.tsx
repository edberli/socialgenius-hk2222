import React, { useState } from 'react';
import { StoreAddress } from '../types';

interface SettingsPanelProps {
  bio: string;
  setBio: (val: string) => void;
  addresses: StoreAddress[];
  setAddresses: (val: StoreAddress[]) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ bio, setBio, addresses, setAddresses }) => {
  const [newAddressName, setNewAddressName] = useState('');
  const [newAddressDetail, setNewAddressDetail] = useState('');

  const toggleAddress = (id: string) => {
    setAddresses(addresses.map(addr => 
      addr.id === id ? { ...addr, isSelected: !addr.isSelected } : addr
    ));
  };

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const addNewAddress = () => {
    if (!newAddressName.trim() || !newAddressDetail.trim()) return;
    const newAddr: StoreAddress = {
      id: Date.now().toString(),
      name: newAddressName,
      detail: newAddressDetail,
      isSelected: true
    };
    setAddresses([...addresses, newAddr]);
    setNewAddressName('');
    setNewAddressDetail('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <span>⚙️</span> 品牌設定 (Brand Setup)
      </h2>

      <div className="pt-2 border-b border-slate-100 pb-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          AI 模型設定
        </label>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          呢個版本已改為由系統後端統一控制 AI model，同 API key 唔會喺前端顯示或俾用家自行修改。
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          品牌/個人簡介 (Bio)
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none text-sm"
          placeholder="輸入您的品牌簡介..."
        />
        <p className="text-xs text-slate-500 mt-1">此簡介將會被自動整合到生成的貼文中。</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          分店地址 (Store Addresses)
        </label>
        
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                addr.isSelected 
                  ? 'bg-purple-50 border-purple-400' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => toggleAddress(addr.id)}
            >
              <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                addr.isSelected ? 'bg-purple-600 border-purple-600' : 'bg-white border-slate-400'
              }`}>
                {addr.isSelected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">{addr.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{addr.detail}</div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeAddress(addr.id); }}
                className="text-slate-400 hover:text-red-500 p-1"
                title="移除地址"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-sm italic">
              暫無地址，請新增。
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
          <input 
            type="text" 
            placeholder="分店名稱 (e.g., 銅鑼灣店)" 
            value={newAddressName}
            onChange={(e) => setNewAddressName(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-purple-500"
          />
          <input 
            type="text" 
            placeholder="詳細地址" 
            value={newAddressDetail}
            onChange={(e) => setNewAddressDetail(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-purple-500"
          />
          <button 
            onClick={addNewAddress}
            disabled={!newAddressName || !newAddressDetail}
            className="bg-slate-800 text-white text-sm py-2 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            + 新增地址
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
