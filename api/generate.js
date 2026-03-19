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

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || defaultModel,
        messages,
        temperature,
        top_p,
      }),
    });

    const data = await response.json().catch(() => ({}));
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: { message: error?.message || 'Internal server error' },
    });
  }
}
