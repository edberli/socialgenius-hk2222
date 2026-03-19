<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SocialGenius HK2222

A Vite + React + TypeScript app for generating XiaoHongShu and Instagram content.

## Default AI setup

This project is preconfigured for **Qwen / OpenAI-compatible APIs**.

Default values:
- Base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- Model: `qwen-plus`

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy env example:
   `cp .env.example .env.local`
3. Put your Qwen-compatible API key into `.env.local`
4. Start dev server:
   `npm run dev`

## Build

```bash
npm run build
```

## Notes

- Do **not** commit your real API key.
- You can also change Base URL / Model Name directly in the app settings panel.
