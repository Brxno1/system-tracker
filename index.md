# Project Specification: Sure Bets Desktop App

**Context for AI Agent**: This document defines the architecture, stack, and behavior for a new Desktop Application project. Use this as the source of truth for all implementation.

---

## 1. Executive Summary

**Goal**: Build a macOS Desktop Application to track "Sure Bets" (Arbitrage Betting).

**Core Value**: Automate the manual process of recording bets, tracking profits, and managing bankroll across multiple betting houses.

**Key Workflows**:
1. **Register Bet**: Screenshot of betting sites + calculator → AI extracts data → User confirms → App tracks.
2. **Update Bankroll**: Screenshot/text of house balances → AI extracts values → Updates total bankroll.

---

## 2. Technical Stack

| Layer | Technology |
|-------|------------|
| **Platform** | **Electron** (macOS target) |
| **Build Tool** | **Vite** (via `electron-vite`) |
| **Frontend** | **React 18** + TypeScript |
| **Routing** | **React Router DOM** |
| **UI Framework** | **Tailwind CSS** + **shadcn/ui** |
| **Icons** | Lucide React |
| **State Management** | **Zustand** (Global Store) + **TanStack Query** (Async Ops) |
| **Data Persistence** | **`electron-store`** (JSON file). **Local First**. |
| **AI Integration** | **Google Gemini API** (`gemini-1.5-flash`) |

**Architecture Note**: We use a clean separation between **Main Process** (System/IO) and **Renderer Process** (UI).
- **Main**: Handles file system, secure storage, and window management.
- **Renderer**: React app with modern component patterns, identical to `chat-ai` structure.

---

## 3. Project Structure

Based on `chat-ai` reference:

```
sures/
├── electron/
│   ├── main/
│   │   ├── index.ts          # Main process entry
│   │   └── store.ts          # IPC handlers for electron-store
│   ├── preload/
│   │   └── index.ts          # ContextBridge (Audit secure API)
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn components (button, card, etc.)
│   │   ├── dashboard/        # Feature: Dashboard widgets
│   │   ├── bankroll/         # Feature: Bankroll management
│   │   └── layout/           # App shell (Sidebar, Header)
│   ├── hooks/                # Custom hooks (use-toast, etc.)
│   ├── lib/
│   │   ├── query-client.ts   # TanStack Query config
│   │   ├── gemini.ts         # AI Client
│   │   └── utils.ts          # cn() and helpers
│   ├── store/
│   │   ├── app-store.ts      # Global UI state
│   │   └── bets-store.ts     # Data store (synced with electron-store)
│   ├── App.tsx
│   └── main.tsx
├── electron.vite.config.ts
└── package.json
```

---

## 4. Design System & UX

- **Theme**: Professional Dark Mode (`zinc-950` background).
- **Accents**:
  - **Profit**: Emerald (`text-emerald-500`, `bg-emerald-500/10`).
  - **Loss/Risk**: Rose (`text-rose-500`).
- **Vibe**: Premium, Clean, Glassmorphism elements. Inspired by Vercel/Linear dashboards.

---

## 5. Feature Requirements

### A. Dashboard (Home)

**KPI Cards**:
| Metric | Description |
|--------|-------------|
| Banca Total | Sum of all house balances |
| Lucro Total | Sum of all realized profits |
| Lucro Pendente | Sum of projected profits from OPEN bets |
| ROI Médio | Average ROI across all sure bets |

**Data Table (Sure Bets)**:
- Columns: Date, Event, House A (Odds/Stake), House B (Odds/Stake), Projected Profit, Status.
- Status Badge: `OPEN` (Gray), `WON` (Green).
- **Action**: "One-Click Winner" → User clicks "House A Won" or "House B Won" → Updates Status → Adds profit to total.

---

### B. Bankroll Management (Casas)

**House Balance List**:
- Table showing each betting house and its current balance.
- Example: `Betboo: R$ 300,00 | Superbet: R$ 2,66 | BetMGM: R$ 78,45`

**AI-Powered Update**:
- User drags screenshot OR pastes text with house balances.
- AI (Gemini Vision) extracts: `{ "betboo": 300, "superbet": 2.66, ... }`
- App updates balances and recalculates Banca Total.

---

### C. Input Flow: Register Sure Bet

**Primary Method**: Drag & Drop Image.
1. User drags screenshot (betting sites + calculator visible).
2. AI extracts JSON:
   ```json
   {
     "event": "Patryk Jendrzejewski vs Krzysztof Kapik",
     "houseA": { "name": "BetMGM", "odds": 2.75, "stake": 227.71 },
     "houseB": { "name": "Superbet", "odds": 2.02, "stake": 310.00 },
     "totalInvestment": 537.71,
     "projectedProfit": 88.49,
     "roi": 16.46
   }
   ```
3. UI shows pre-filled form → User confirms → Saves to table.

**Fallback Method**: Manual Entry.
- Form with inputs for all fields above.

---

## 6. Data Models

### SureBet
```typescript
interface SureBet {
  id: string;
  createdAt: string; // ISO Date
  event: string;
  houseA: { name: string; odds: number; stake: number };
  houseB: { name: string; odds: number; stake: number };
  totalInvestment: number;
  projectedProfit: number;
  roi: number;
  status: 'OPEN' | 'WON';
  winner?: 'A' | 'B';
  realizedProfit?: number;
}
```

### HouseBalance
```typescript
interface HouseBalance {
  name: string;
  balance: number;
  updatedAt: string; // ISO Date
}
```

---

## 7. Out of Scope (v1)

- ❌ Sure bet calculator (user uses external site)
- ❌ Complex charts/graphs (future enhancement)
- ❌ Multi-currency support (R$ only)
- ❌ Cloud sync / backup
- ❌ Back/Lay calculations (Betfair Exchange)

---

## 8. Development Phases

1. **Setup**: Initialize Electron + Vite + React + shadcn.
2. **Core**: Configure generic `electron-store` handler and Zustand sync.
3. **UI: Dashboard**: Build KPI Cards + Sure Bets Table.
4. **UI: Bankroll**: Build House Balance list + update flow.
5. **AI Integration**: Implement Gemini service for image/text parsing.
6. **Polish**: Transitions, Loading States, Error Handling.
