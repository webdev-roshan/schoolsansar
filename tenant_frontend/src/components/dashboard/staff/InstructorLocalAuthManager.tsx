"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/providers/PermissionProvider";
import Unauthorized from "@/components/Unauthorized";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

import ActivationTab from "./activation/ActivationTab";
import DistributionTab from "./activation/DistributionTab";

export default function InstructorLocalAuthManager() {
    // "activate_staff_portal" is the permission we added
    const { can, isOwner } = usePermissions();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"activation" | "distribution">("activation");

    // We can show a badge if we have a way to count pending credentials, 
    // but we don't have that API yet for staff.
    const pendingCount = 0;

    const canManage = isOwner || can("activate_staff_portal");

    if (!canManage) {
        return <Unauthorized />;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <button
                        onClick={() => router.back()}
                        className="flex cursor-pointer items-center gap-2 text-sm text-sky-600 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Directory
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        Staff Portal Activation
                    </h1>
                    <p className="text-lg cursor-pointer text-slate-500 dark:text-slate-400">
                        Manage instructor identities and portal entry credentials.
                    </p>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab("activation")}
                    className={cn(
                        "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer",
                        activeTab === "activation"
                            ? "bg-white dark:bg-slate-900 text-primary shadow-sm"
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    Account Setup
                </button>
                <button
                    onClick={() => setActiveTab("distribution")}
                    className={cn(
                        "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer",
                        activeTab === "distribution"
                            ? "bg-white dark:bg-slate-900 text-primary shadow-sm"
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    Distribution List
                </button>
            </div>

            {activeTab === "activation" ? (
                <ActivationTab onSuccess={() => setActiveTab("distribution")} />
            ) : (
                <DistributionTab />
            )}
        </div>
    );
}
