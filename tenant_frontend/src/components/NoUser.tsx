"use client";

import { UserX, LogOut, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";

export default function NoUser() {
    const { mutate: logout, isPending } = useLogout();

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-4">
            <Card className="max-w-md w-full border-none shadow-2xl text-center p-6 bg-white animate-in fade-in zoom-in duration-300">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-red-100 rounded-full">
                            <UserX className="h-10 w-10 text-red-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-zinc-800 tracking-tight">Account Not Found</CardTitle>
                    <CardDescription className="text-zinc-500 text-lg">
                        Your session is active, but the user account associated with it could not be found.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-red-50 p-4 rounded-xl text-sm text-red-600 border border-red-100 text-left">
                        <p className="font-semibold mb-1">Why am I seeing this?</p>
                        <ul className="list-disc list-inside space-y-1 opacity-90">
                            <li>The database might have been reset</li>
                            <li>Your account was recently deleted</li>
                            <li>You are using an expired session</li>
                        </ul>
                    </div>

                    <div className="pt-2 space-y-3">
                        <Button
                            className="w-full h-12 text-md font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                            onClick={() => logout()}
                            disabled={isPending}
                        >
                            {isPending ? "Logging out..." : "Logout & Clear Session"}
                            <LogOut className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full h-11 text-zinc-500 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                            onClick={() => window.location.reload()}
                        >
                            Refresh
                            <RefreshCcw className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
