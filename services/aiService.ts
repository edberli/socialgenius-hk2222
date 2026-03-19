import { Platform, StoreAddress, Tone, LengthLevel, AISettings } from "../types";

const getToneInstructions = (tone: Tone): string => {
  switch (tone) {
    case 'professional':
      return `
      **語氣設定：專業高冷 (Chic & Professional)**
      - **核心風格**：類似時尚雜誌編輯 (Vogue/Elle) 或資深美妝博主。
      - **關鍵字**：高級感、成分黨、效果導向。
      - **內容重點**：專注於產品成分分析、質地描述、妝效質感。不講廢話。
      `;
    case 'warm':
      return `
      **語氣設定：溫暖親切 (Warm)**
      - 風格：像你的韓國購物嚮導或閨蜜。
      - 重點：分享變美的快樂，描述在店內購物的愉快體驗。
      - 用詞：溫柔、興奮、私心推介。
      `;
    case 'funny':
      return `
      **語氣設定：幽默有趣 (Funny)**
      - 風格：小編自嘲或玩梗，與粉絲互動。
      - 重點：用輕鬆的方式推廣產品，可以帶點誇張。
      `;
    default:
      return "";
  }
};

const getLengthInstructions = (length: LengthLevel, platform: Platform): string => {
  if (platform === 'xhs') {
    switch (length) {
      case 'short':
        return `**長度要求：極簡 (Very Short)**\n- 字數限制：**50-80 字**。\n- 結構：標題 + 2-3 句狠話。極度精簡，像發朋友圈一樣隨意但有重點。`;
      case 'medium':
        return `**長度要求：標準 (Standard)**\n- 字數限制：**100-150 字**。\n- 結構：標題 + 3-4 個列點 (Bullet points)。閱讀無壓力，一眼看完。`;
      case 'long':
        return `**長度要求：豐富 (Rich)**\n- 字數限制：**200-300 字**。\n- 結構：包含少量細節描述，但**絕對不要**超過 300 字。保持節奏快。`;
    }
  } else {
    // Instagram
    switch (length) {
      case 'short':
        return `**長度要求：極短 (Caption Only)**\n- 限制：**1-2 句說話**。\n- 風格：高冷、氣氛感 (Vibe)，主要靠圖，文字只是點綴。`;
      case 'medium':
        return `**長度要求：標準 (Standard)**\n- 限制：**3-4 句說話** (約 1 個小段落)。\n- 風格：清楚交代重點即可，不要長篇大論。`;
      case 'long':
        return `**長度要求：詳細 (Detailed)**\n- 限制：**2 個小段落** (約 80-120 字)。\n- 風格：像跟朋友分享心得，但依然要短。`;
    }
  }
  return "";
};

// Helper to generate the footer based on platform
const generateFooter = (platform: Platform, bio: string, addresses: StoreAddress[]): string => {
  const selectedAddr = addresses.find(a => a.isSelected);
  const addressDetail = selectedAddr ? selectedAddr.detail : '觀塘道472–480號 觀塘工業中心一期 地下B舖';

  if (platform === 'xhs') {
    let xhsBio = bio
      .replace(/唔使/g, '不用')
      .replace(/買機票/g, '买机票')
      .replace(/韓國/g, '韩国')
      .replace(/體驗/g, '体验')
      .replace(/品牌/g, '品牌')
      .replace(/選品/g, '选品')
      .replace(/彩妝/g, '彩妆')
      .replace(/護膚/g, '护肤')
      .replace(/爽感/g, '爽感')
      .replace(/給/g, '给')
      .replace(/真正/g, '真正');

    let xhsAddress = addressDetail
      .replace(/觀塘/g, '观塘')
      .replace(/號/g, '号')
      .replace(/一期/g, '一期')
      .replace(/地下/g, '地下')
      .replace(/舖/g, '铺');

    return `
${xhsBio}

OUJI｜香港K-Beauty 体验店🇰🇷🛍️✨
💄彩妆｜🧴护肤｜🎁潮玩盲盒
📍${xhsAddress}
🔔 关注＋打开通知｜最新优惠和消息`;
  } else {
    return `
${bio}

OUJI｜香港真正K-Beauty 體驗店🇰🇷🛍️✨
💄彩妝｜🧴護膚｜🎁潮玩盲盒
📍${addressDetail}
🔔 Follow＋開通知｜最新優惠和消息`;
  }
};

const generatePromptText = (
  platform: Platform, 
  topic: string, 
  footer: string,
  tone: Tone,
  length: LengthLevel,
  variationIndex: number,
  hasImage: boolean
): string => {
  
  const imageInstruction = hasImage 
    ? "**圖片分析指令 (Image Analysis)：**\n請像一個資深的時尚編輯一樣分析這張圖片。告訴我：\n1. **人物**：裡面是誰？(如果是明星/KOL請辨認，如果是一般人請描述風格)\n2. **品牌/產品**：識別可見的化妝品/護膚品品牌。\n3. **場景與氛圍**：發生了什麼事？(例如：正在試用產品、參加活動、展示妝容)。\n**關鍵**：將這些視覺細節融入文案，讓讀者覺得你真的在看這張圖。" 
    : "**圖片說明：**\n用戶沒有提供圖片，請根據主題想像相關場景。";

  const toneInstruction = getToneInstructions(tone);
  const lengthInstruction = getLengthInstructions(length, platform);

  const companyContext = `
    **你的身份設定：**
    你是 OUJI (港版 Olive Young) 的資深潮流選物編輯。

    **⛔️ 絕對禁止詞彙 (Forbidden Phrases) - 這一點最重要：**
    文案內容（正文）中，**絕對不要** 出現以下字眼，這些會讓文案顯得像硬廣、冗長且老土：
    - 「全港最大」
    - 「龍頭」
    - 「信心保證」
    - 「100%正貨」
    - 「韓國直送」
    - 「不用飛韓國」
    - 「正品」
    
    **你的任務：**
    讀者已經知道我們是誰（Footer會交代）。
    你只需要專注於 **產品本身的吸引力**、**使用感受**、**成分效果** 或 **活動優惠**。
    直接切入重點，不要鋪墊。
  `;

  // Define Variation Strategy
  let variationStrategy = "";
  if (variationIndex === 0) {
    variationStrategy = "**版本策略 (Version A)：直接有力 (Direct & Impactful)**\n- 重點：直擊產品/活動賣點，解決用戶痛點。\n- 語氣：更加肯定、自信、權威。";
  } else {
    variationStrategy = "**版本策略 (Version B)：氛圍與故事 (Vibe & Story)**\n- 重點：側重於使用場景、情感共鳴、整體氛圍感。\n- 語氣：更加軟性、生活化、注重「體驗感」。";
  }

  if (platform === 'xhs') {
    return `
      ${companyContext}
      請撰寫一篇 **小紅書 (XiaoHongShu)** 筆記。

      **核心任務：**
      主題：${topic}
      ${imageInstruction}
      
      ${toneInstruction}
      ${lengthInstruction}
      ${variationStrategy}

      **小紅書模式規則 (XHS Mode)：**
      1. **Emoji 策略**：極其豐富 🤩✨，視覺上要色彩斑斕。
      2. **語言**：簡體中文 (Simplified Chinese)，內地網絡用語 (如：絕絕子、天花板、閉眼入)。
      3. **SEO 關鍵字優化**：在標題和正文中自然融入與主題相關的熱門搜索詞（如：香港探店、K-Beauty、韓國護膚、平價好物等），提高搜索曝光率。
      4. **排版結構化**：使用清晰的段落和符號（如：✅、📍、💡）來劃分重點，確保用戶能快速抓取核心信息（如亮點、地址、品牌）。
      5. **內容精簡**：**必須非常簡短**。嚴格遵守「長度要求」。避免任何企業宣傳廢話，**移除所有重複或冗餘的內容**。
      6. **內容結構**：
         - **標題**：吸睛、懸念、或直接擊中利益點（包含關鍵字）。
         - **正文**：結構化排版，直擊痛點。
         - **結尾**：**必須**在正文結束後，完整附上以下品牌資訊（Footer），不要修改任何一個字：
      7. **標籤 (Hashtags)**：在文末（Footer之後）加上 3-5 個精準的熱門標籤，**切勿超過 5 個**，避免被系統判定為堆砌。
      
      **⚠️ 小紅書平台違禁詞與規則避坑 (CRITICAL XHS RULES)：**
      - **絕對避免使用極限詞/絕對化用語**：如「最」、「第一」、「首個」、「頂級」、「絕對」、「100%」、「神器」、「萬能」等。
      - **避免過度承諾/醫療用語**：如「包治」、「根除」、「藥到病除」、「美白/祛斑/抗皺/減肥」等敏感功效詞（請用「提亮」、「淡化」、「緊緻」、「輕盈」等替代）。
      - **避免誘導互動/引流詞**：如「點讚」、「收藏」、「轉發」、「加微信」、「私信」、「購買鏈接」等。
      - **避免虛假誇大宣傳**：如「零差評」、「國家級」等。
      - **請使用合規的替代詞**，確保文案自然且符合小紅書最新的社區規範，避免被系統限流或封禁。

      ${footer}
      
      **輸出格式：** 直接輸出標題、正文和Footer。
    `;
  } else {
    return `
      ${companyContext}
      請撰寫一個 **Instagram** 貼文。

      **核心任務：**
      主題：${topic}
      ${imageInstruction}

      ${toneInstruction}
      ${lengthInstruction}
      ${variationStrategy}

      **Instagram 模式規則 (IG Mode)：**
      1. **語言**：**必須使用地道香港廣東話口語 (Cantonese)**。 (例如：係呀、真係好正、快啲嚟試下)。
      2. **Emoji 策略**：**大量 (Heavy usage)** 💖✨🔥。每一句都要有 Emoji，讓版面看起來很熱鬧、開心。
      3. **SEO 關鍵字優化**：在內文和 Hashtag 中自然融入熱門搜索詞（如：香港好去處、韓國化妝品、好物推介），提升觸及率。
      4. **排版結構化**：使用清晰的換行和符號（如：✅、📍、💡）來劃分重點，方便用戶快速閱讀（如亮點、地址、品牌）。
      5. **內容精簡**：**必須非常簡短**。嚴格遵守「長度要求」。避免任何企業宣傳廢話，**移除所有重複或冗餘的內容**。
      6. **內容結構**：
         - **Hook**：一句話吸引注意（包含關鍵字）。
         - **Body**：結構化排版，直擊重點。
         - **結尾**：**必須**在正文結束後，完整附上以下品牌資訊（Footer），不要修改任何一個字：
      7. **標籤 (Hashtags)**：根據 Instagram 最新政策，在文末（Footer之後）加上最多 5 個精準的 Hashtag（建議 3-5 個），**切勿超過 5 個**。

      ${footer}

      **輸出格式：** 直接輸出貼文內容（含Footer），不要解釋。
    `;
  }
};

const generateSingleVariant = async (
  platform: Platform,
  topic: string,
  footer: string,
  tone: Tone,
  length: LengthLevel,
  variationIndex: number,
  aiSettings: AISettings,
  imageData?: { base64: string; mimeType: string } | null
): Promise<string> => {
  const textPrompt = generatePromptText(platform, topic, footer, tone, length, variationIndex, !!imageData);

  if (!aiSettings.modelName) {
    throw new Error("AI model 未設定。請聯絡管理員更新後端設定。");
  }

  const messages: any[] = [
    {
      role: "user",
      content: []
    }
  ];

  if (imageData) {
    messages[0].content.push({
      type: "image_url",
      image_url: {
        url: `data:${imageData.mimeType};base64,${imageData.base64}`
      }
    });
  }

  messages[0].content.push({
    type: "text",
    text: textPrompt
  });

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: aiSettings.modelName,
      messages,
      temperature: 0.8 + (variationIndex * 0.1),
      top_p: 0.95
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `請求失敗: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "生成內容時發生錯誤。";
};

export const generatePostContent = async (
  platform: Platform,
  topic: string,
  bio: string,
  addresses: StoreAddress[],
  tone: Tone,
  length: LengthLevel,
  aiSettings: AISettings,
  imageData?: { base64: string; mimeType: string } | null
): Promise<string[]> => {
  try {
    const footer = generateFooter(platform, bio, addresses);
    
    // Generate two variations in parallel
    const promises = [0, 1].map(index => 
      generateSingleVariant(platform, topic, footer, tone, length, index, aiSettings, imageData)
    );

    const results = await Promise.all(promises);
    return results;
  } catch (error: any) {
    console.error(`Error generating content for ${platform}:`, error);
    throw new Error(error.message || `無法生成 ${platform === 'xhs' ? '小紅書' : 'Instagram'} 內容。請檢查服務狀態或稍後再試。`);
  }
};
