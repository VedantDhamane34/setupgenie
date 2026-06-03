# ⚡ SetupGenie

> AI-powered WFH setup configurator for India

## What is SetupGenie?

SetupGenie helps you build the perfect Work-From-Home setup based on your exact budget, role, room size, and pain points. Our AI generates a complete personalised workspace recommendation — monitor to mood lighting — with real Indian market prices.

## Features

- 🤖 AI-Personalised recommendations (Groq / Llama 3.3)
- 💡 Covers all 10 categories (display, seating, lighting, audio, etc.)
- 🛒 Multi-platform shopping (Amazon, Flipkart, Croma, Reliance, Tata Cliq)
- 📊 Price comparison across platforms
- 🔄 Swap any item with alternatives
- 💾 Save and share your setup
- 🇮🇳 Real 2025 Indian market prices
- 🎯 Exact budget enforcement

## Tech Stack

- **Frontend:** React 18 + Vite
- **AI:** Groq API (Llama 3.3 70B)
- **Styling:** Pure CSS (no framework)
- **Storage:** localStorage (Phase 1)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/VedantDhamane34/setupgenie.git
cd setupgenie

# Install dependencies
npm install

# Add your API key
cp .env.example .env
# Add your Groq API key to .env

# Run locally
npm run dev
```

## Environment Variables

VITE_GROQ_API_KEY=your_groq_api_key_here

Get your free Groq API key at [console.groq.com](https://console.groq.com)

## Roadmap

- [x] Phase 1 — React MVP with AI generation
- [ ] Phase 2 — MERN backend with real auth
- [ ] Phase 3 — Real product database with ASINs
- [ ] Phase 4 — Community setups + sharing
- [ ] Phase 5 — Pro subscription + B2B

## Author

**Vedant Dhamane**
- GitHub: [@VedantDhamane34](https://github.com/VedantDhamane34)
- LinkedIn: [vedant-dhamane](https://www.linkedin.com/in/vedant-dhamane/)

## License

MIT