# EDU Sekai Backend Architecture

## Multi-Tenant Architecture: "One Identity, Many Rooms"

EDU Sekai uses a sophisticated Multi-Tenant architecture powered by `django-tenants` and a custom **Soft-Link Identity System**. This ensures maximum scalability and data isolation while allowing users to interact with multiple schools using a single account.

### 1. Database Segregation (PostgreSQL Schemas)
The database is partitioned into two distinct areas:

*   **Public Schema (`public`)**: The "Lobby". Stores global data shared across the entire SaaS platform.
    *   `User`: Authentication credentials (Email/Password).
    *   `Organization`: School metadata and subdomain settings.
    *   `Domain`: Mapping of subdomains (e.g., `oxford.edusekai.com`) to organizations.
    *   `Role/Permission`: Granular RBAC definitions (Add, View, Change, Delete) available to all tenants.
    *   `Payment`: Subscription and transaction records for the SaaS platform.

*   **Tenant Schemas (`school_slug`)**: The "Rooms". Every school gets its own isolated table set.
    *   `Profile`: Personal identity data (Name, DOB, Phone).
    *   `Student`: Academic records, enrollment status.
    *   `StaffMember`: Employment data, designations.
    *   `Parent`: Guardian information.
    *   `AcademicHistory/Levels`: School-specific academic data.

### 2. The Soft-Link (UUID) Strategy
Unlike standard Django apps, we do **not** use database-level Foreign Keys between Tenants and the Public schema. 

**Standard (Strict) Approach (NOT USED):**
`Student (Tenant) -> ForeignKey -> User (Public)`
*   *Problem*: Prevents horizontal scaling (sharding) and crashes the Global Admin when trying to "preview" deletions across schemas.

**EDU Sekai (Soft-Link) Approach:**
`Student (Tenant) -> Profile (Tenant) -> user_id (UUIDField)`
*   **The Link**: The `Profile` model stores a `user_id` which matches the `User.id` in the public schema.
*   **Integrity**: Handled via Django Signals (`pre_delete`). When a global User is deleted, the signal iterates through tenant schemas to clean up associated Profiles.
*   **Admin Stability**: The Global Admin can manage users without the database engine attempting to join tables that don't exist in the public schema.

### 3. Identity vs Role
We differentiate between who a person **is** (Profile) and what they **do** (Role).
1.  **User**: Logged in account.
2.  **Profile**: The "Identity" in a specific school (Name, Photo).
3.  **Student/Staff/Parent**: The "Role" linked to that identity.

### 4. Admin Access Control
*   **Global Admin (`localhost:8000/admin`)**: Restricted to SaaS management (Organizations, Users, Payments).
*   **Tenant Admin (`school.localhost:8000/admin`)**: Restricted to School management (Students, Staff, School Settings).

---

## Infrastructure & Setup

### Port Mapping
*   **Main Frontend (SaaS)**: `localhost:3000`
*   **Tenant Frontend (School Board)**: `schoolname.localhost:3555`
*   **API Backend**: `localhost:8000`

### Automated Seeding
The backend includes a `seed_public.py` script (executed via `entrypoint.sh`) that automatically:
1.  Creates the `public` tenant if missing.
2.  Maps the `localhost` domain to the public schema.
3.  Creates a system superuser from `.env` credentials (`SUPERUSER_EMAIL`, `SUPERUSER_PASSWORD`).

---

## Student Enrollment Workflow
The enrollment is an atomic process across schemas:
1.  **Identity Creation**: Uses the `User` model in the public schema.
2.  **Profile Initialization**: Creates a `Profile` in the tenant schema linked via `user_id`.
3.  **Role Assignment**: Signal-driven creation of `Student` or `StaffMember` records.
4.  **Branding**: Auto-initialization of `InstitutionProfile` for the organization.

## Tech Stack
*   **Backend**: Django 5.x, Django Rest Framework
*   **Tenancy**: django-tenants (Schema-based)
*   **Frontends**: Next.js (Main SaaS on :3000, Tenant Dashboard on :3555)
*   **Auth**: SimpleJWT with Secure HttpOnly Cookies
*   **Database**: PostgreSQL 15 (Alpine)
