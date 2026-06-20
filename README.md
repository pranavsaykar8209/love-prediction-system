# 💕 Love Prediction System

A fun, beautifully designed love compatibility calculator built with **React + TypeScript + Vite**. Enter two names and get a unique compatibility score, complete with a personalized message — backed by **Supabase** for persistent results and localStorage as a seamless offline fallback.

🌐 **Live Demo → [lovematch-omega.vercel.app](https://lovematch-omega.vercel.app)**

---

## ✨ Features

### 🧮 Love Calculator
- Enter your name and your crush's name to generate a compatibility score (0–100%)
- Scores are **deterministic** — the same name pair always returns the same score
- Special rule: names including *Pranav* are guaranteed a high score 😏
- Rich animated result reveal with a count-up score animation and loading messages

### 📜 Match History (PIN-protected)
- View all previously calculated compatibility results in a clean table
- **PIN lock screen** — every visit requires entering the correct 4-digit PIN
- PIN is securely stored in `.env` (never in source code)
- Search/filter results by name (order-insensitive)
- Select multiple rows and **bulk delete** with a custom confirm modal
- On mobile, tap the score badge to see the timestamp in a tooltip
- Accessible only by navigating directly to `/history` — no public links

### 🎨 UI / UX
- Glassmorphism design with pink/purple gradient theme
- Floating animated hearts on every page
- Smooth micro-animations and hover effects
- Fully responsive — optimised for mobile, tablet, and desktop
- Custom PIN entry screen styled like a mobile lock screen
- Toast notifications for all actions

### 🗄️ Data Layer
- **Supabase** as the primary database — results are shared across all users
- **localStorage fallback** — works fully offline if Supabase is not configured
- In-flight deduplication prevents race conditions on double-renders (React 18 StrictMode safe)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/pranavsaykar8209/love-prediction-system.git
cd love-prediction-system
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Optional | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Optional | Your Supabase anon/public key |
| `VITE_HISTORY_PIN` | Required | 4-digit PIN to unlock the history page |

> **Note:** If Supabase variables are omitted, the app falls back to `localStorage` automatically.

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

The app is deployed at **[lovematch-omega.vercel.app](https://lovematch-omega.vercel.app)**.

To deploy your own fork:
1. Import the repo into [Vercel](https://vercel.com)
2. Set the following **Environment Variables** in the Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_HISTORY_PIN`
3. Vercel will auto-build and deploy on every push to `main`

> ⚠️ Never commit your `.env` file — keep secrets in Vercel's environment variable settings only.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Card/               # Reusable card wrapper
│   ├── ConfirmModal/       # Custom confirm dialog (replaces window.confirm)
│   ├── FloatingHearts/     # Animated heart background
│   ├── HeartIcon/          # SVG heart icon component
│   ├── Navbar/             # Top navigation bar
│   └── Section/            # Generic section layout wrapper
│
├── data/                   # JSON config files (copy, messages, formula)
│
├── lib/
│   └── supabaseClient.ts   # Supabase client initialisation
│
├── pages/
│   ├── AboutCalculation/   # Landing / How It Works page
│   ├── CalculatorForm/     # Name input form
│   ├── HistoryPage/        # Match history table + PinLock screen
│   │   ├── HistoryPage.tsx
│   │   ├── HistoryPage.module.css
│   │   ├── PinLock.tsx     # 4-digit mobile-style PIN entry
│   │   └── PinLock.module.css
│   └── ResultPage/         # Animated compatibility result reveal
│
├── router/
│   └── AppRouter.tsx       # React Router v7 browser router config
│
├── services/
│   ├── historyService.ts   # Fetch/delete history (Supabase + localStorage)
│   ├── searchExistingResult.ts
│   ├── storeNewResult.ts
│   └── supabaseService.ts  # getOrCreateLoveResult with fallback logic
│
├── types/                  # Shared TypeScript interfaces
└── utils/                  # Helpers (name normalisation, score → message)
```

---

## 🛣️ Routes

| Path | Page | Protected |
|---|---|---|
| `/` | Landing / How It Works | No |
| `/calculator` | Name input form | No |
| `/result` | Compatibility result | No (requires names in state) |
| `/history` | Match history table | ✅ PIN required on every visit |

---

## 🔒 History Page PIN

The history page is intentionally hidden from the public UI — there are no navigation links to it. Access it by visiting `/history` directly.

On every visit a mobile-style 4-digit PIN pad is shown. The PIN is configured in `.env`:

```env
VITE_HISTORY_PIN=your_4_digit_pin
```

- Entering the correct PIN reveals the history list
- Wrong PIN triggers a shake animation and clears the input
- The PIN is **never stored in source code**

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | React Router v7 |
| Database | Supabase (PostgreSQL) |
| Offline storage | Browser localStorage |
| Styling | CSS Modules (Vanilla CSS) |
| Fonts | Google Fonts — Inter + Outfit |

---

## 📸 Pages Overview

### Landing Page (`/`)
Explains how the love algorithm works with a "How It Works" section and a prominent CTA to launch the calculator.

### Calculator Form (`/calculator`)
Clean two-field form for entering names. Validates non-empty inputs and navigates to the result page.

### Result Page (`/result`)
- 5-second animated loading sequence with cycling messages and a circular progress ring
- Score is fetched from Supabase (or generated locally) and revealed with a count-up animation
- Displays a personalised compatibility message and paragraph

### History Page (`/history`)
- PIN lock gate on every visit
- Searchable, selectable table of all past calculations
- Bulk delete with a custom animated confirm modal
- Mobile: Time column hidden; tap score badge to see timestamp tooltip

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 Disclaimer

This is a **fun project** built for entertainment purposes only. Compatibility scores are randomly generated and have no scientific basis. Don't break up with anyone based on this. 💔➡️💕
