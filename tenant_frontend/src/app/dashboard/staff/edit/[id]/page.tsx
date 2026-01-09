"use client";

import { use } from 'react';
import StaffEditWizard from '@/components/dashboard/staff/StaffEditWizard';
import { usePermissions } from "@/providers/PermissionProvider";
import Unauthorized from "@/components/Unauthorized";

interface EditStaffPageProps {
    params: Promise<{ id: string }>;
}

export default function EditStaffPage({ params }: EditStaffPageProps) {
    const { can, isOwner } = usePermissions();
    // In Next 15, params is a Promise. Unwrap it with use()
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const canEdit = isOwner || can("change_staff");

    if (!canEdit) {
        return <Unauthorized />;
    }

    return (
        <div className="space-y-6">
            <StaffEditWizard staffId={id} />
        </div>
    );
}
