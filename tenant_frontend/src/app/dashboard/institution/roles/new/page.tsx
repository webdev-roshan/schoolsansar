"use client";

import { useCreateRole, usePermissionsList } from "@/hooks/useRoles";
import { usePermissions } from "@/providers/PermissionProvider";
import RoleForm from "@/components/dashboard/institution/RoleForm";
import { RoleFormData } from "@/types/roles";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { Loader2 } from "lucide-react";

export default function CreateRolePage() {
    const { can, isOwner } = usePermissions();
    const { data: permissionGroups, isLoading } = usePermissionsList();
    const { mutate: createRole, isPending } = useCreateRole();
    const router = useRouter();

    const canCreate = isOwner || can("create_role");

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
            </div>
        );
    }

    if (!canCreate) {
        return <Unauthorized />;
    }

    const handleSubmit = (data: RoleFormData) => {
        createRole(data, {
            onSuccess: () => {
                router.push("/dashboard/institution/roles");
            },
        });
    };

    return (
        <div>
            <RoleForm
                permissionGroups={permissionGroups || []}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
            />
        </div>
    );
}
