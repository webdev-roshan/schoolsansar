"use client";

import { usePermissions } from "@/providers/PermissionProvider";
import Unauthorized from "@/components/Unauthorized";
import StaffLocalAuthManager from "@/components/dashboard/staff/StaffLocalAuthManager";

export default function CentralStaffPortalPage() {
    const { can, isOwner } = usePermissions();

    const canManage = isOwner || can("activate_staff_portal");

    if (!canManage) {
        return <Unauthorized />;
    }

    return (
        <StaffLocalAuthManager />
    );
}
