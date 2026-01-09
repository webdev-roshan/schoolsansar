"use client";

import { useRouter } from "next/navigation";
import {
    School,
    Briefcase,
    ArrowRight,
    GraduationCap,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecruitSelectionPage() {
    const router = useRouter();

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Recruit New Staff
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                    Select the type of staff member you wish to onboard. This will determine their system roles, permissions, and available features.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Option 1: Instructor */}
                <button
                    onClick={() => router.push("/dashboard/faculty/onboarding")}
                    className="group relative flex flex-col items-start p-8 h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-left hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl group-hover:bg-indigo-100/50 dark:group-hover:bg-indigo-900/20 transition-all -mr-16 -mt-16" />

                    <div className="relative space-y-6 w-full">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <School className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Recruit Instructor
                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500" />
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Onboard academic staff who will teach courses, manage classes, and grade examinations. They will have access to academic modules.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                                Academic Access
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                Class Management
                            </span>
                        </div>
                    </div>
                </button>

                {/* Option 2: General Staff */}
                <button
                    onClick={() => router.push("/dashboard/staff/onboarding")}
                    className="group relative flex flex-col items-start p-8 h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-left hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-3xl group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-900/20 transition-all -mr-16 -mt-16" />

                    <div className="relative space-y-6 w-full">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Briefcase className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Recruit General Staff
                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-500" />
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Onboard operational staff for HR, Admin, Finance, or other support roles. Access is determined by their assigned role.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                                Operational Access
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                Role Based
                            </span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
