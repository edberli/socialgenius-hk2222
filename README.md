<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SocialGenius HK2222

A Vite + React + TypeScript app for generating XiaoHongShu and Instagram content.

## Deployment modes

### GitHub Pages
- Static demo only
- No secure server-side API key storage

### Vercel (recommended)
- Frontend + serverless API proxy
- Qwen API key stays on the server
- End users cannot edit API key in the UI

## Default AI setup

Server defaults:
- Base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- Model: `qwen-plus`

## Vercel environment variables

Set these in Vercel Project Settings:

- `QWEN_API_KEY` = your real API key
- `QWEN_BASE_URL` = `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions` (optional)
- `QWEN_MODEL_NAME` = `qwen-plus` (optional)

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`

## Build

```bash
npm run build
```

## Notes

- Do **not** commit your real API key.
- API calls for the Vercel version go through `/api/generate`.
- Model changes should be done in backend env vars / deployment settings.
