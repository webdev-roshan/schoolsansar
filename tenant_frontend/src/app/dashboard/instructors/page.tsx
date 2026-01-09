import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function FacultyDirectoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Faculty Directory
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                        Manage your teaching staff and instructors
                    </p>
                </div>
                <Link
                    href="/dashboard/faculty/onboarding"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                >
                    <UserPlus className="h-5 w-5" />
                    Recruit Faculty
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
                <p>Instructor List Component will go here.</p>
            </div>
        </div>
    );
}
