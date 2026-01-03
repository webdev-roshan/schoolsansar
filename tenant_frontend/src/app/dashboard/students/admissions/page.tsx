"use client";

import { usePermissions } from "@/providers/PermissionProvider";
import Unauthorized from "@/components/Unauthorized";
import AdmissionWizard from "@/components/dashboard/students/AdmissionWizard";

export default function AdmissionsPage() {
    const { can, isOwner } = usePermissions();

    const canEnroll = isOwner || can("add_student");

    if (!canEnroll) {
        return <Unauthorized />;
    }

    return (
        <div className="space-y-6">
            <AdmissionWizard />
        </div>
    );
}
