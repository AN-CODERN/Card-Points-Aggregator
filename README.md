# 💳 CardMitra – Your Personal Rewards Expert

A premium fintech mobile-first web app to track and maximize rewards from Credit & Debit cards.

## 🚀 Quick Start

Double-click `start.bat` OR run manually:

```bash
# Terminal 1 – Backend
cd server
node index.js          # runs on http://localhost:3001

# Terminal 2 – Frontend
cd cardmitra
npm run dev            # runs on http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

---

## 🏗️ Project Structure

```
CARD POINTS AGGREGATOR/
├── cardmitra/          ← React + Vite + Tailwind frontend
│   └── src/
│       ├── pages/      ← All screens
│       ├── components/ ← Shared UI components
│       ├── store/      ← Zustand state (persisted to localStorage)
│       └── lib/        ← AI engine, utilities, data
├── server/             ← Express.js backend
│   ├── index.js        ← API server
│   └── db.json         ← JSON database (auto-created)
└── start.bat           ← One-click launcher
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | Sign up / Sign in with local JSON DB + JWT tokens |
| 💳 Virtual Cards | Premium card UI showing XXXX XXXX XXXX 1234 format |
| 📊 Dashboard | Points, cashback, savings, lounge visits at a glance |
| 🤖 CardMitra AI | Rule-based AI answering all rewards questions in real-time |
| 📋 Transactions | Categorized history with per-swipe rewards breakdown |
| 🎁 Benefits Hub | All card benefits + smart comparison across categories |
| ⭐ Rewards Center | Redeem points for lounges, flights, vouchers, cashback |
| 🏷️ Deals Market | Brand deals with card-specific extra discounts |
| 🛎️ Customer Care | Bank helplines, block card, disputes, WhatsApp/Email/Call |
| 🌙 Dark Mode | Full dark/light mode toggle |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET  | `/api/cards` | Get user's cards |
| POST | `/api/cards` | Add a card |
| DELETE | `/api/cards/:id` | Remove a card |
| PATCH | `/api/cards/:id/block` | Block a card |
| GET  | `/api/transactions` | Get transactions |
| POST | `/api/transactions` | Add transaction |
| GET  | `/api/redemptions` | Get redemptions |
| POST | `/api/redemptions` | Redeem points |
| GET  | `/api/summary` | Dashboard summary |
| GET  | `/api/health` | Server health check |

## 🧠 CardMitra AI

The AI engine (`src/lib/aiEngine.ts`) answers questions using your real data:
- "How many reward points do I have?"
- "Which card is best for Amazon?"
- "How many lounge visits are left?"
- "How much cashback this month?"
- "How can I maximize my rewards?"
- And much more...

No API key needed – runs entirely on device using your card & transaction data.
