# EDU Sekai: Multi-Tenant School Management Ecosystem

Welcome to the **EDU Sekai** project. This is a comprehensive, multi-tenant SaaS platform designed to manage educational institutions. It uses a high-performance, schema-based multi-tenancy architecture to provide complete data isolation for schools while maintaining a centralized identity and billing system.

---

## 🏗 Project Architecture

The project is split into three main parts, each with a specific responsibility:

### 1. Backend (Django REST Framework)
- **Role**: The centralized API, identity provider, and schema manager.
- **Tenancy Strategy**: Schema-based isolation using `django-tenants`.
- **Identity Strategy**: Cross-schema "Soft-Links" using UUIDs for maximum performance and stability.
- **Database**: PostgreSQL with individual schemas per institution.

### 2. SaaS Frontend (Next.js - Port 3000)
- **Role**: The "Public Facing" platform.
- **Features**: Landing page, eSewa payment integration, organization registration, and a centralized superuser dashboard.
- **URL**: `http://localhost:3000`

### 3. Tenant Frontend (Next.js - Port 3555)
- **Role**: The "School Operating System".
- **Features**: Student enrollment, staff management, academic tracking, and school-specific dashboards.
- **URL**: `http://[subdomain].localhost:3555`

---

## 🚀 Quick Start (Development)

The entire ecosystem is containerized for easy setup.

### Prerequisites
- Docker & Docker Compose
- Node.js (for local linting/IDE support)
- Python (for local linting/IDE support)

### Setup & Run
1.  **Environment**: Ensure `.env` files are set up in `backend/`, `frontend/`, and `tenant_frontend/`.
2.  **Launch**:
    ```bash
    # From the root directory
    # Start the backend and database
    cd backend && docker compose up --build

    # Start the SaaS frontend
    cd ../frontend && npm run dev

    # Start the Tenant Dashboard
    cd ../tenant_frontend && npm run dev
    ```

---

## 📂 Repository Structure

```text
EDU Sekai/
├── backend/            # Django API & Tenancy Logic
├── frontend/           # SaaS / Public Landing Page (Port 3000)
└── tenant_frontend/    # School Management Dashboard (Port 3555)
```

---

## 📑 Documentation
For specific details on how each module works, please refer to their individual documentation:
- [Backend Documentation](./backend/README.md)
- [SaaS Frontend Documentation](./frontend/README.md)
- [Tenant Frontend Documentation](./tenant_frontend/README.md)

---

## 🛡 Security & Design
- **Auth**: Secure HttpOnly Cookie-based JWT Authentication.
- **Isolation**: Each school's data is physically separated in the database.
- **Resilience**: Integrated audit scripts to prevent data orphaning and ensure schema integrity.
