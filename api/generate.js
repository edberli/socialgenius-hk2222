function extractTextFromGeminiResponse(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text)
      .filter(Boolean)
      .join('\n') || ''
  );
}

function openAiMessagesToGeminiContents(messages = []) {
  return messages.map((message) => ({
    role: message?.role === 'assistant' ? 'model' : 'user',
    parts: (message?.content || []).map((part) => {
      if (part?.type === 'text') {
        return { text: part.text || '' };
      }

      if (part?.type === 'image_url' && part?.image_url?.url?.startsWith('data:')) {
        const match = part.image_url.url.match(/^data:(.*?);base64,(.*)$/);
        if (match) {
          return {
            inline_data: {
              mime_type: match[1],
              data: match[2],
            },
          };
        }
      }

      return null;
    }).filter(Boolean),
  }));
}

async function callGemini({ apiKey, baseUrl, model, messages, temperature, top_p }) {
  const normalizedBaseUrl = (baseUrl || 'https://generativelanguage.googleapis.com/v1beta/models').replace(/\/$/, '');
  const url = `${normalizedBaseUrl}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: openAiMessagesToGeminiContents(messages),
      generationConfig: {
        temperature,
        topP: top_p,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { response, data };
  }

  return {
    response,
    data: {
      choices: [
        {
          message: {
            content: extractTextFromGeminiResponse(data),
          },
        },
      ],
      raw: data,
    },
  };
}

async function callOpenAICompatible({ apiKey, baseUrl, model, messages, temperature, top_p }) {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      top_p,
    }),
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.QWEN_API_KEY;
  const baseUrl = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  const defaultModel = process.env.QWEN_MODEL_NAME || 'qwen-plus';

  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Server AI key is not configured.' } });
  }

  try {
    const { model, messages, temperature, top_p } = req.body || {};
    const selectedModel = model || defaultModel;
    const isGemini = selectedModel?.startsWith('gemini') || baseUrl.includes('generativelanguage.googleapis.com');

    const { response, data } = isGemini
      ? await callGemini({ apiKey, baseUrl, model: selectedModel, messages, temperature, top_p })
      : await callOpenAICompatible({ apiKey, baseUrl, model: selectedModel, messages, temperature, top_p });

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: { message: error?.message || 'Internal server error' },
    });
  }
}
