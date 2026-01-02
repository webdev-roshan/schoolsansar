"use client";

import { useRoles, useUpdateRole, usePermissionsList } from "@/hooks/useRoles";
import { usePermissions } from "@/providers/PermissionProvider";
import RoleForm from "@/components/dashboard/institution/RoleForm";
import { RoleFormData } from "@/types/roles";
import { useRouter, useParams } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { Loader2 } from "lucide-react";
import React from "react";

export default function EditRolePage() {
    const { id } = useParams();
    const { can, isOwner } = usePermissions();
    const { data: roles, isLoading: isRolesLoading } = useRoles();
    const { data: permissionGroups, isLoading: isPermissionsLoading } = usePermissionsList();
    const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
    const router = useRouter();

    const role = roles?.find((r) => r.id === id);
    const canEdit = isOwner || can("edit_role");

    if (isRolesLoading || isPermissionsLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
            </div>
        );
    }

    if (!canEdit) {
        return <Unauthorized />;
    }

    if (!role) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h1 className="text-2xl font-bold">Role not found</h1>
                <p className="text-slate-500">The role you are looking for does not exist or has been deleted.</p>
                <Button onClick={() => router.push("/dashboard/institution/roles")} className="mt-4">
                    Back to Roles
                </Button>
            </div>
        );
    }

    const handleSubmit = (data: RoleFormData) => {
        updateRole({ id: id as string, payload: data }, {
            onSuccess: () => {
                router.push("/dashboard/institution/roles");
            },
        });
    };

    return (
        <div className="max-w-7xl mx-auto py-6">
            <RoleForm
                initialData={role}
                permissionGroups={permissionGroups || []}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
            />
        </div>
    );
}

// Helper Button import for the "not found" state
import { Button } from "@/components/ui/button";
