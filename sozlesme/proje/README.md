# 🚀 Kuzenler: Next-Gen Web3 Logistics Platform

## 📖 Overview
**Kuzenler** is a decentralized logistics and supply chain management application built to revolutionize traditional shipping. By leveraging the **Stellar Network** and Web3 technologies, we solve critical industry challenges: lack of transparency, delayed payments, and data manipulation.

Our platform offers a dual-interface system (Admin & Customer) where shipments are tracked via an immutable timeline, and payments are settled instantly using **XLM** through the **Freighter Wallet**.

---

## ✨ Features

### 🔗 Stellar Blockchain Integration
* **Instant Payments:** Seamless crypto payments using **XLM** via Freighter Wallet integration.
* **Secure Authentication:** Wallet-based login system eliminating the need for traditional passwords.
* **Low Transaction Fees:** Cost-effective logic suitable for micro-logistics operations.

### 🚚 Advanced Logistics Management
* **Timeline Tracking:** A detailed history view for every shipment (e.g., *Shanghai -> Dubai -> Istanbul*).
* **Real-Time Updates:** Status changes (Pending, In Transit, Delivered) are instantly reflected on both Admin and Customer panels.
* **Smart Admin Dashboard:** Full control to manage customers, edit details, and update shipment locations.

### 🌐 Modern User Experience
* **Customer Portal:** Easy product entry and automated shipping cost calculation.
* **Interactive UI:** Built with Next.js and TailwindCSS for a responsive and smooth experience.
* **Live Status Badges:** Visual indicators for shipment states.

---

## 🛠 Tech Stack

* **Frontend:** Next.js 14 + React + TypeScript
* **Styling:** TailwindCSS + Shadcn/ui
* **Blockchain:** Stellar Network (Integration via Freighter API)
* **Wallet:** Freighter Wallet
* **State Management:** Custom Store Logic (Simulating On-Chain Data)
* **Icons:** Lucide React

---

## 📂 Project Architecture

```bash
/app
├── app/
│   ├── admin/             # Admin Dashboard & Logic
│   ├── page.tsx           # Customer Portal & Landing
│   └── layout.tsx         # Global Styles & Metadata
├── components/
│   ├── admin-dashboard.tsx    # Admin Management & Tracking Timeline
│   ├── customer-portal.tsx    # Customer Product Entry & Payment
│   ├── cargo-status-manager.tsx # Status Update Logic
│   └── ui/                    # Reusable UI Components
├── lib/
│   ├── store.ts           # Data Logic & Blockchain Simulation
│   └── freighter-utils.ts # Stellar Wallet Connections
└── context/               # Language & Theme Contexts
⚡️ Installation & Setup
Follow these steps to run the project locally:

1. Clone Repository

Bash

git clone [https://github.com/derdevz/kuzenler.git](https://github.com/derdevz/kuzenler.git)
cd kuzenler
2. Install Dependencies

Bash

npm install
# or
yarn install
3. Configure Environment

Ensure you have the Freighter Wallet extension installed in your browser.

No complex .env configuration is needed for the local demo version.

4. Run Local Development

Bash

npm run dev
Open http://localhost:3000 with your browser to see the result.

👥 Team
Team Name: Kuzenler

Abdulkadir Pekel – Full Stack Developer & Blockchain Lead

📧 Email: pekelabdulkadir@gmail.com