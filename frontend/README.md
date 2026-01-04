# EDU Sekai SaaS Frontend (Main Landing)

This is the public-facing portal for **EDU Sekai**. It handles branding, subscription awareness, and organization registration.

## 🚀 Features
- **Central Branding**: Modern, premium landing page for potential schools.
- **Organization Registration**: Integrated flow to capture school details.
- **Payment Integration**: Seamless **eSewa** integration for capturing subscription payments.
- **Port**: Runs on `http://localhost:3000`.

## 🛠 Tech Stack
- **Framework**: Next.js 14/15 (App Router)
- **Styling**: Tailwind CSS & Lucide React Icons
- **State Management**: React Query (TanStack Query) for API interactions.
- **Animations**: Framer Motion for premium UI transitions.

## 📦 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` based on `.env.example`:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

3.  **Run Development**:
    ```bash
    npm run dev
    ```

## 🏗 Key Pages
- `/`: Landing page.
- `/register`: School registration form.
- `/payment-success`: Post-payment verification and subdomain generation.

## 🔗 Connection to Backend
This frontend communicates solely with the **Public Schema** of the backend. It does not handle school-specific data (like student lists) — that is the job of the **Tenant Frontend**.
