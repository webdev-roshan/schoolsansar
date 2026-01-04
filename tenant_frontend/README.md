# EDU Sekai Tenant Frontend (School Dashboard)

This is the "School Operating System" for **EDU Sekai**. Every institution uses this dashboard to manage their daily operations.

## 🚀 Features
- **Subdomain Detection**: Automatically connects to the correct database schema based on the URL (e.g., `oxford.localhost`).
- **Student Management**: Enrollment, listing, and academic tracking.
- **Staff Management**: Teacher and administrator records.
- **Dynamic Dashboard**: Personalized view for students, staff, and owners.
- **Port**: Runs on `http://localhost:3555`.

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS / Vanilla CSS
- **Data Fetching**: Custom hooks with `useCheckSubdomain` for schema-aware verification.
- **Auth**: JWT Cookie-based authentication sharing same login as SaaS.

## 📦 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    ```env
    NEXT_PUBLIC_BASE_DOMAIN=localhost
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

3.  **Run Development**:
    ```bash
    npm run dev
    ```

## 🏗 Key Components
- `SubdomainGuard`: A high-level wrapper that verifies the school's existence before rendering the app.
- `NoUser` / `NoInstitute`: Error handling components for database resets or invalid URLs.
- `Sidebar`: Dynamic navigation based on user roles (Owner, Admin, Teacher).

## 🌍 Domain Logic
This app uses a multi-domain strategy. To test locally:
1.  Register a school on the SaaS frontend (`localhost:3000`).
2.  Once payment is verified, you will be redirected to `[yourschool].localhost:3555`.
3.  Ensure your `hosts` file supports wildcards or manually add `your-school.localhost` to your system hosts if necessary.
