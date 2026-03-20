export type Platform = 'xhs' | 'ig';

export type Tone = 'professional' | 'warm' | 'funny';

export type LengthLevel = 'short' | 'medium' | 'long';

export interface StoreAddress {
  id: string;
  name: string;
  detail: string;
  isSelected: boolean;
}

export interface AISettings {
  modelName: string;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  modelName: 'gemini-3.1-flash-lite-preview',
};

export interface AppState {
  topic: string;
  platforms: Platform[];
  bio: string;
  addresses: StoreAddress[];
  tone: Tone;
  length: LengthLevel;
}

export interface GeneratedContent {
  platform: Platform;
  variations: string[]; // Now stores an array of content versions
  loading: boolean;
  error?: string;
}

// Separate the mission statement part for the editable Bio
export const DEFAULT_BIO = "100+ 韓國品牌選品｜彩妝💄 護膚🧴\nOUJI 想做到：唔使買機票✈️ 都可以享受韓國購物爽感 🇰🇷✨給你真正Olive Young的體驗";

export const DEFAULT_ADDRESSES: StoreAddress[] = [
  { id: '1', name: '觀塘旗艦店', detail: '觀塘道472–480號 觀塘工業中心一期 地下B舖', isSelected: true },
];