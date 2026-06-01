# LTLG — Indian Constitution Learning Platform

An AI-powered Indian Constitution learning platform built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Dashboard** — Bookmarks (articles & cases), quick actions, quiz history (localStorage)
- **Constitution Chat** — Premium legal-tech UI; ask **any** article (1–395, 51A, 300A, etc.)
- **Constitution Explorer** — All **465 articles**, **12 schedules**, search & bookmarks
- **Quiz Center** — Scored quizzes with explanations
- **Landmark Cases** & **Amendments Hub** — Browse cases and major amendments
- **Exam prep modules** — Flashcards, Legal News, Current Affairs, CLAT (coming soon)

No login, signup, or authentication required.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |
| `npm run build:constitution` | Regenerate `src/data/constitution.json` from source |

## Constitution data

Full article text is loaded from `src/data/constitution.json` (built from [civictech-India/constitution-of-india](https://github.com/civictech-India/constitution-of-india)). Run `npm run build:constitution` after updating `scripts/source-constitution.json`.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
