import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
            <div className="p-6 bg-red-50 dark:bg-red-500/10 rounded-full mb-6">
                <Building2 className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Access Denied</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                You do not have permission to view this page.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-sky-600 px-8 h-12 rounded-xl">
                Return to Dashboard
            </Button>
        </div>
    );
}