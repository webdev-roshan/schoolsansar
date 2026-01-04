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

## Student Portal Access Workflow

The portal activation process bridges admitted students to their global digital identity:

### **Phase 1: Admission (Profile Creation)**
1.  **Admin Dashboard**: School staff admit a new student
2.  **Profile Creation**: Creates `Profile` in tenant schema with personal data
3.  **No Login Access**: `user_id = NULL`, `local_username = NULL`
4.  **Student Record**: Creates domain-specific `Student` record

**Result**: Student is admitted to the school but CANNOT log in yet.

### **Phase 2: Portal Activation (Identity Bridge)**
1.  **Username Generation**:
    - **Local Username**: `firstname + middlename + lastname` (e.g., `johnprasaddoe`)
    - **Uniqueness Check**: If exists in THIS school → append number (e.g., `johnprasaddoe2`)
    - **Global Username**: `local_username + _ + random_hex` (e.g., `johnprasaddoe_a1b2c3`)

2.  **User Creation**: Creates `User` in public schema with:
    - `username`: Global username (for Django auth)
    - `password`: Hashed temporary password
    - `needs_password_change`: `True` (force reset on first login)
    - `initial_password_display`: Plain text (for admin distribution only)

3.  **Profile Linking**:
    - `profile.user_id = user.id`
    - `profile.local_username = local_username` (e.g., `johnprasaddoe`)

4.  **Role Assignment**: Creates `UserRole` linking user to "student" role for THIS organization

**Result**: Student can now log in with their `local_username` and temporary password.

### **Phase 3: Student Login**
1.  **User Input**: Student enters `local_username` (e.g., `johnprasaddoe`) and password
2.  **Username Resolution**:
    - System queries `Profile` in current tenant: `local_username = "johnprasaddoe"`
    - Retrieves linked `User` from public schema via `user_id`
    - Gets global `username` (e.g., `johnprasaddoe_a1b2c3`)
3.  **Authentication**: Django authenticates using global `username` + password
4.  **Password Change**: If `needs_password_change = True`, redirect to password reset modal
5.  **Success**: User logged in and sees dashboard

### **Key Design Principles:**
- **School Isolation**: Each school has its own `local_username` namespace
- **Global Uniqueness**: `User.username` is globally unique across all schools
- **User-Friendly**: Students see simple usernames like `johnprasaddoe`, not `johnprasaddoe_a1b2c3`
- **Security**: Forced password change on first login, hashed storage
- **Scalability**: No cross-schema joins, ready for horizontal sharding

## 🛠 Developer Tools & Management

### 1. Automated Setup (`entrypoint.sh`)
The backend is designed to be "self-healing" during development:
- **Auto-Migrations**: Automatically runs `makemigrations` and `migrate_schemas` on boot.
- **Seeding**: Automatically creates the public tenant, maps `localhost`, and creates a superuser using `.env` credentials.
- **Cleanup (Optional)**: Contains commented-out logic to hard-reset migration files.

### 2. Audit & Integrity Scripts
To handle the unique challenges of cross-schema "Soft-Links", we have dedicated tools:

*   **`audit_orphans` Command (Critical)**:
    Scans every tenant schema for broken links (profiles pointing to deleted accounts).
    ```bash
    # Report orphans
    docker compose exec backend python manage.py audit_orphans
    
    # Purge orphans
    docker compose exec backend python manage.py audit_orphans --fix
    ```

*   **`audit_unlinked` Command (Inventory)**:
    Lists profiles that have no assigned login account (e.g. students without emails).
    ```bash
    docker compose exec backend python manage.py audit_unlinked
    ```

*   **`seed_public.py`**:
    Ensures the infrastructure layer (SaaS admin) is always ready.

### 3. Migration Strategies
- **Persistent Mode (Default)**: Standard Django flow. Data is preserved across restarts.
- **Clean Slate Mode**: To reset everything including schemas, run `docker compose down -v`.

---

## 🧪 Testing
The backend includes an integrity suite to ensure tenancy logic never fails.
```bash
# Run accounts and tenancy integrity tests
docker compose exec backend python manage.py test accounts
```

## 🚀 Local API Usage
- **Base URL**: `http://localhost:8000/api/`
- **Admin**: `http://localhost:8000/admin/` (Global)
- **Tenant Admin**: `http://[slug].localhost:8000/admin/` (School Specific)

---

## Tech Stack
*   **Backend**: Django 5.x, Django Rest Framework
*   **Tenancy**: django-tenants (PostgreSQL Schemas)
*   **Security**: PyJWT, Secure HttpOnly Cookies
*   **Storage**: PostgreSQL 15-Alpine
