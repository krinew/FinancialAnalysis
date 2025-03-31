

# MicroFinancer – Personal Finance Management App

## 🪙 Overview

MicroFinancer is an all-in-one personal finance management application, designed to help users gain real-time insights into their financial habits, investments, and spending behavior. It also introduces **MicroInvestor**, a feature that helps users effortlessly invest small amounts (spare change) into investment opportunities.

---

## 💡 Problem Statement

Managing personal finances is a juggling act with data coming from various platforms. Users often:

- Lack real-time insights like spending trends, budget status, and breakdowns.
- Want to explore investment opportunities but don't know where to start.
- Hesitate to invest while spending impulsively.

---

## 🚀 What MicroFinancer Offers

- Seamless integration of transaction data via APIs from banks, investment portfolios, and budget managers
- Real-time, customizable insights using AI and natural language queries.
- Automated analysis to discover potential investment opportunities.
- A smart **MicroInvestment** system prompting users to invest spare change effortlessly.

---

## 🛠️ Tech Stack

### Backend

- **Django + Django REST Framework** – Robust and scalable backend.
- **Pathway** – Real-time vector store for transaction analysis.
- **Fetch AI** – AI agents for financial insights and recommendations.
- **MySQL** – Database to store user data and transaction history.

### Frontend

- **React + Vite** – Lightweight and fast front-end framework.
- **Recharts** – Interactive data visualization.
- **Tailwind CSS** – Utility-first CSS framework for quick and clean UI.

---

## ⚙️ Key Features

- Real-time transaction analysis and visualization.
- Natural language insights for spending and investment recommendations.
- AI-powered financial guidance with dynamic vector search.
- Micro-investment system suggesting high-probability small investment opportunities.
- Interactive dashboards and charts for user-friendly experience.

---

## 🟣 Workflow Plan

### Backend Setup

- Configure **Django REST Framework** with **MySQL**.
- Integrate **Plaid/Yodlee** APIs to fetch transaction data.
- Ingest transaction data into **Pathway** vector store.
- Design database schema for users, transactions, and virtual accounts using Django ORM.

### AI Integration

- Integrate market data APIs (e.g., Alpha Vantage, IEX Cloud).
- Retrieved dummy data from SandBox API.
- Implement **Fetch AI** for insights, natural language queries, and financial simulations (Digital Twin).

### Frontend Development & API Integration

- Build the React dashboard using **Tailwind CSS**.
- Integrate \*\*jscharts \*\*for dynamic expense and investment charts.
- Connect frontend to backend APIs.

### Testing & Optimization

- Optimize vector store and query performance.
- Improve real-time updates and Digital Twin logic.
- Final UI/UX refinement and user testing.

---

## 👥 Team

- Ansh Varma
- Devaj Rathore
- Parth Goyal

