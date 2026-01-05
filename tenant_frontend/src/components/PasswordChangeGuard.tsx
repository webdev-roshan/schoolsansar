"use client";

import { useState, useEffect } from "react";
import { useMe, useChangePassword } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { ShieldAlert, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PasswordChangeGuard({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useMe();
    const { mutate: changePassword, isPending } = useChangePassword();
    const router = useRouter();

    const [showDialog, setShowDialog] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isLoading && user?.needs_password_change) {
            setShowDialog(true);
        }
    }, [user, isLoading]);

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        changePassword(newPassword, {
            onSuccess: () => {
                setShowDialog(false);
                setNewPassword("");
                setConfirmPassword("");
            }
        });
    };

    // If data is loading, we can show a loader or just render nothing to avoid flash
    if (isLoading) return null;

    // If user needs to change password, Show the FULL SCREEN blocking page
    // We DO NOT render {children} here, effectively hiding the dashboard
    if (user?.needs_password_change) {
        return (
            <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">

                    {/* Header Branding */}
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-linear-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 mb-6">
                            <ShieldAlert className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Security Check
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                            To protect your new account, please replace your temporary password with a secure one.
                        </p>
                    </div>

                    {/* Card Content */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <FloatingLabelInput
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        label="New Secure Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="h-14 pr-10 text-lg bg-slate-50 dark:bg-slate-950/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                <FloatingLabelInput
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-14 text-lg bg-slate-50 dark:bg-slate-950/50"
                                />
                            </div>

                            {/* Requirements */}
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Password Strength
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    <li className={cn("text-xs flex items-center gap-2 transition-colors", newPassword.length >= 8 ? "text-emerald-600" : "text-slate-500")}>
                                        <div className={cn("h-1.5 w-1.5 rounded-full", newPassword.length >= 8 ? "bg-emerald-500" : "bg-slate-300")} />
                                        At least 8 characters long
                                    </li>
                                    <li className={cn("text-xs flex items-center gap-2 transition-colors", newPassword === confirmPassword && newPassword !== "" ? "text-emerald-600" : "text-slate-500")}>
                                        <div className={cn("h-1.5 w-1.5 rounded-full", newPassword === confirmPassword && newPassword !== "" ? "bg-emerald-500" : "bg-slate-300")} />
                                        Passwords match
                                    </li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-base font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Lock className="mr-2 h-5 w-5 animate-pulse" />
                                        Updating Credentials...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-5 w-5" />
                                        Secure My Account
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-slate-400">
                        Protected by EDU Sekai Identity Management
                    </p>
                </div>
            </div>
        );
    }

    // If no password change needed, render dashboard
    return <>{children}</>;
}
