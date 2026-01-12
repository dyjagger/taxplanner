# Canadian Tax Planner

A comprehensive Canadian tax return planning web application for sole proprietors and families. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of tax situation with quick access to all modules
- **Income Tracking**: T4, T5, self-employment, and other income sources
- **Expense Management**: T2125 business expense categories with deduction rates
- **RRSP Optimizer**: Visual tax bracket analysis and contribution recommendations
- **Tax Credits**: Medical, charitable, tuition, and other non-refundable credits
- **Family Module**: Spouse, children, and dependents for CCB and other benefits
- **GST/HST Management**: Registration tracking and Quick Method calculator
- **Reports**: Tax summaries, T2125 preview, and data export (CSV/JSON)

## Tech Stack

- **React 18+** with TypeScript (strict mode)
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Zustand** for state management with localStorage persistence
- **React Router** (HashRouter for GitHub Pages compatibility)
- **React Query** for data fetching
- **Recharts** for tax bracket and savings visualizations
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Sidebar, Footer, AppLayout
│   └── dashboard/       # Dashboard components
├── pages/               # Route pages (Income, Expenses, RRSP, etc.)
├── stores/              # Zustand stores for state management
├── lib/
│   ├── types/           # TypeScript types and interfaces
│   ├── constants/       # Province data, expense categories
│   ├── taxData/         # Tax data fetching and fallback
│   └── calculations/    # Federal/provincial tax, RRSP optimization
└── App.tsx              # Main app with routing
```

## Tax Data

Tax rates and brackets are sourced from CRA published data with a fallback chain:
1. Cached data (if fresh)
2. Hardcoded fallback data (2024-2025)

Data includes:
- Federal and provincial tax brackets
- Basic personal amounts
- CPP/EI rates and maximums
- RRSP limits
- CCA mileage rates

## Deployment

The app is configured for GitHub Pages deployment:

```bash
npm run deploy
```

This builds the app and deploys to the `gh-pages` branch.

## Disclaimer

⚠️ **This tool provides estimates only and is not professional tax advice.** Always verify calculations with CRA-certified software or a licensed tax professional before filing your tax return.

## Privacy

All data is stored locally in your browser using localStorage. No data is sent to any server. Your tax information never leaves your device.

## License

MIT
