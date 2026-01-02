import { AnyProfile } from "./Profile";

export interface User {
    id: string;
    email: string;
    is_active: boolean;
    profile: AnyProfile;
    roles: string[];
    active_role: string | null;
    permissions?: string[];
}

export interface Permission {
    id: string;
    name: string;
    codename: string;
    module: string;
    description: string;
}

export interface Role {
    id: string;
    name: string;
    slug: string;
    description: string;
    is_system_role: boolean;
    permissions: Permission[];
    user_count: number;
    created_at: string;
}

export interface AuthResponse {
    message: string;
    user?: User;
}
