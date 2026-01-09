"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/providers/PermissionProvider";
import Unauthorized from "@/components/Unauthorized";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePendingCredentials } from "@/hooks/useStudents";

import ActivationTab from "./portal-activation/ActivationTab";
import DistributionTab from "./portal-activation/DistributionTab";

export default function PortalActivationManager() {
    const { can, isOwner } = usePermissions();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"activation" | "distribution">("activation");

    // Queries (for badge)
    const { data: pendingCreds } = usePendingCredentials();

    const canManage = isOwner || can("activate_student_portal");

    if (!canManage) {
        return <Unauthorized />;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        Portal Activation
                    </h1>
                    <p className="text-lg cursor-pointer text-slate-500 dark:text-slate-400">
                        Manage student identities and portal entry credentials.
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
                    {pendingCreds && pendingCreds.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-primary text-white text-[10px] rounded-full">
                            {pendingCreds.length}
                        </span>
                    )}
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
