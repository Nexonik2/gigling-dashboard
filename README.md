# Gigling Racing Dashboard

A high-utility, performant dashboard built for the Gigaverse "casual degen" community to track racing performance, analyze ROI, and identify high-value assets.

## 🚀 Overview

The Gigling Racing Dashboard transforms complex on-chain racing data into actionable insights. Built for speed and clarity, it allows players to monitor their Gigling's history, evaluate track performance, and participate in the wider Gigaverse metagame.

## 🛠 Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS 4
* **Data Fetching:** @tanstack/react-query
* **Visualization:** Recharts

## 📊 Key Features

* **Global Stats:** Real-time aggregate data across the Gigaverse ecosystem.
* **Gigling Profile:** Detailed racing history, payout tracking, and lineage analysis.
* **Player Analytics:** Historical performance trends using 50-race data windows.
* **Metagame Rankings:** Filterable ELO leaderboard with demographic distribution charts.

## ⚙️ Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Nexonik2/gigling-dashboard.git
cd gigling-dashboard

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Setup:**
Create a `.env.local` file in the root directory and add your required environment variables.
4. **Run development server:**
```bash
npm run dev

```



## 🏗 Architecture

* **Data Fetching:** Utilizes a centralized `lib/api.ts` utility to ensure efficient querying.
* **Component Purity:** Reusable UI elements are isolated within `components/ui/` for consistency.
* **Data Transformation:** Complex business logic (ROI calculation, rank mapping) is decoupled via `lib/chartTransformers.ts`.

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

*Built for the Gigaverse Hackathon.*
