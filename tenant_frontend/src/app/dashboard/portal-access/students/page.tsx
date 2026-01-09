"use client";

import { usePermissions } from "@/providers/PermissionProvider";
import Unauthorized from "@/components/Unauthorized";
import PortalActivationManager from "@/components/dashboard/students/PortalActivationManager";

export default function CentralStudentPortalPage() {
    const { can, isOwner } = usePermissions();

    const canManage = isOwner || can("activate_student_portal");

    if (!canManage) {
        return <Unauthorized />;
    }

    return (
        // The manager handles its own layout and tabs (activation vs distribution)
        <PortalActivationManager />
    );
}
