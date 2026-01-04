"use client";

import { useState, useEffect } from "react";
import {
    useStudents,
    usePortalActivation,
    usePendingCredentials,
    AccountCreationData,
    Student,
    PendingCredential
} from "@/hooks/useStudents";
import { usePermissions } from "@/providers/PermissionProvider";
import { Button } from "@/components/ui/button";
import {
    Users,
    Key,
    ShieldCheck,
    Info,
    TriangleAlert,
    LoaderCircle,
    ArrowLeft,
    Plus,
    RefreshCw,
    WandSparkles,
    Trash2,
    CircleCheck,
    Lock,
    Copy,
    Eye,
    EyeOff,
    Send
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function PortalActivationPage() {
    const { can, isOwner } = usePermissions();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"activation" | "distribution">("activation");

    // Queries
    const { data: unenrolledStudents, isLoading: loadingStudents } = useStudents(true);
    const { data: pendingCreds, isLoading: loadingCreds } = usePendingCredentials();
    const { mutate: activatePortal, isPending } = usePortalActivation();

    const [selections, setSelections] = useState<AccountCreationData[]>([]);
    const [errors, setErrors] = useState<any[]>([]);
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

    const canManage = isOwner || can("add_student");

    if (!canManage) {
        return <Unauthorized />;
    }

    // Passwords Generation helper
    const generateUniquePassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const generateCredentials = (student: Student): AccountCreationData => {
        // Generate username: firstname + middlename (if exists) + lastname
        // Backend will handle uniqueness by appending numbers if needed
        const parts = [
            student.first_name.toLowerCase(),
            student.middle_name?.toLowerCase() || '',
            student.last_name.toLowerCase()
        ].filter(Boolean);

        const username = parts.join('').replace(/\s+/g, ''); // Remove any spaces

        return {
            student_id: student.id,
            username: username,  // e.g., "johnprasaddoe"
            password: generateUniquePassword(),
        };
    };

    const addStudentToSelection = (student: Student) => {
        if (selections.find(s => s.student_id === student.id)) return;
        setSelections([...selections, generateCredentials(student)]);
    };

    const addAllStudents = () => {
        if (!unenrolledStudents) return;
        const newSelections = unenrolledStudents.map(s => generateCredentials(s));
        setSelections(newSelections);
    };

    const updateSelection = (id: string, field: keyof AccountCreationData, value: string) => {
        setSelections(selections.map(s => s.student_id === id ? { ...s, [field]: value } : s));
    };

    const removeSelection = (id: string) => {
        setSelections(selections.filter(s => s.student_id !== id));
    };

    const handleActivation = () => {
        if (selections.length === 0) {
            toast.error("Please add at least one student to activate.");
            return;
        }

        activatePortal(selections, {
            onSuccess: () => {
                setSelections([]);
                setActiveTab("distribution");
            },
            onError: (error: any) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                }
            }
        });
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    const togglePasswordVisibility = (id: string) => {
        setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <button
                        onClick={() => router.back()}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Directory
                    </button>
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
                    <Key className="h-4 w-4" />
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
                    <Send className="h-4 w-4" />
                    Distribution List
                    {pendingCreds && pendingCreds.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-primary text-white text-[10px] rounded-full">
                            {pendingCreds.length}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === "activation" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Available Students List */}
                    <Card className="border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm h-fit pb-0 gap-2">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Users className="h-5 w-5 text-slate-400" />
                                Admitted Students
                            </CardTitle>
                            <CardDescription>
                                Unactivated student profiles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-2">
                            {loadingStudents ? (
                                <div className="p-8 flex justify-center">
                                    <LoaderCircle className="h-8 w-8 text-slate-300 animate-spin" />
                                </div>
                            ) : !unenrolledStudents || unenrolledStudents.length === 0 ? (
                                <div className="p-12 text-center space-y-4">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-full w-fit mx-auto">
                                        <CircleCheck className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <p className="text-slate-500 font-medium">All students have portal access!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                                    {unenrolledStudents.map((student) => {
                                        const isAdded = selections.find(s => s.student_id === student.id);
                                        return (
                                            <div key={student.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white capitalize">{student.full_name}</p>
                                                    <p className="text-xs text-slate-500 font-mono tracking-tighter uppercase">{student.enrollment_id} • {student.level}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={isAdded ? "ghost" : "outline"}
                                                    onClick={() => addStudentToSelection(student)}
                                                    disabled={!!isAdded}
                                                    className={cn(
                                                        "rounded-lg h-9 w-9 p-0",
                                                        isAdded && "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20"
                                                    )}
                                                >
                                                    {isAdded ? <CircleCheck className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Preparation Grid */}
                    <Card className="lg:col-span-2 border-none shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-0">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-bold">Account Setup</CardTitle>
                                    <CardDescription>Generated accounts will require a password change on first login.</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={addAllStudents}
                                        variant="outline"
                                        size="lg"
                                        disabled={!unenrolledStudents || unenrolledStudents.length === 0}
                                    >
                                        Batch Generate
                                    </Button>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 shadow-lg rounded-sm border border-blue-100 dark:border-blue-800">
                                        <span className="text-primary dark:text-blue-400 font-bold">{selections.length}</span>
                                        <span className="text-primary text-xs ml-2 font-medium">Ready</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto min-h-[400px]">
                                {selections.length === 0 ? (
                                    <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 space-y-4">
                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                            <Users className="h-12 w-12 opacity-20" />
                                        </div>
                                        <p className="font-medium">Selected students will appear here.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-slate-50/80 dark:bg-slate-800/50">
                                            <TableRow className="border-b border-slate-200 dark:border-slate-800">
                                                <TableHead className="pl-8 text-xs font-bold py-4 uppercase">Student</TableHead>
                                                <TableHead className="text-xs font-bold uppercase w-1/3">Username</TableHead>
                                                <TableHead className="text-xs font-bold uppercase w-1/3">Temp Password</TableHead>
                                                <TableHead className="w-16 pr-8"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selections.map((item, index) => {
                                                const student = unenrolledStudents?.find(s => s.id === item.student_id);
                                                const error = errors.find(e => e.index === index);
                                                return (
                                                    <TableRow key={item.student_id} className={cn(
                                                        "group transition-all duration-200 hover:bg-indigo-50/10",
                                                        error && "bg-red-50/40"
                                                    )}>
                                                        <TableCell className="pl-8 py-5">
                                                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{student?.full_name}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono italic truncate">{student?.enrollment_id}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                value={item.username}
                                                                onChange={(e) => updateSelection(item.student_id, "username", e.target.value)}
                                                                className="h-10 text-sm border-slate-200 dark:border-slate-800 bg-white/50"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="relative group/pass">
                                                                <Input
                                                                    value={item.password}
                                                                    type="text"
                                                                    onChange={(e) => updateSelection(item.student_id, "password", e.target.value)}
                                                                    className="h-10 text-sm pr-10 border-indigo-200 bg-white/50"
                                                                />
                                                                <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="pr-8">
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => removeSelection(item.student_id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                                <Button
                                    onClick={handleActivation}
                                    disabled={isPending || selections.length === 0}
                                    size="xxl"
                                    className="w-full"
                                >
                                    {isPending ? (
                                        <>
                                            <LoaderCircle className="h-6 w-6 mr-3 animate-spin" />
                                            Activating Portal Access...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-6 w-6 mr-3" />
                                            Activate {selections.length} Student Accounts
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <>
                    <Card className="border-none ring-1 ring-slate-200 gap-0 dark:ring-slate-800 overflow-hidden bg-white dark:bg-slate-900 py-0">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800 p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl">
                                        Unclaimed Credentials
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        List of students who haven't performed their first security reset yet.
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="lg" onClick={() => toast.info("Export CSV coming soon")}>
                                        Export List
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                    </Card>

                    <Card className="border-none shadow-2xl ring-1 ring-slate-200 gap-0 dark:ring-slate-800 overflow-hidden bg-white dark:bg-slate-900 py-0">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto min-h-[400px]">
                                {loadingCreds ? (
                                    <div className="p-12 flex justify-center">
                                        <LoaderCircle className="h-10 w-10 text-indigo-400 animate-spin" />
                                    </div>
                                ) : !pendingCreds || pendingCreds.length === 0 ? (
                                    <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 space-y-4">
                                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-full">
                                            <CircleCheck className="h-12 w-12 text-emerald-500" />
                                        </div>
                                        <p className="font-medium">All students have successfully changed their passwords!</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                            <TableRow>
                                                <TableHead className="pl-10 py-5 uppercase text-xs font-bold tracking-wider">Student & ID</TableHead>
                                                <TableHead className="uppercase text-xs font-bold tracking-wider">Portal Username</TableHead>
                                                <TableHead className="uppercase text-xs font-bold tracking-wider">Initial Password</TableHead>
                                                <TableHead className="text-right pr-10 uppercase text-xs font-bold tracking-wider">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingCreds.map((cred) => (
                                                <TableRow key={cred.id} className="group hover:bg-slate-50 transition-colors">
                                                    <TableCell className="pl-10 py-3">
                                                        <p className="font-bold text-slate-900 dark:text-white text-base">{cred.full_name}</p>
                                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{cred.enrollment_id}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm px-3 py-1 font-bold">
                                                                {cred.username}
                                                            </code>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7"
                                                                onClick={() => copyToClipboard(cred.username, "Username")}
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm px-3 py-1 font-bold">
                                                                {showPasswords[cred.id] ? cred.initial_password : "••••••••••"}
                                                            </code>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7"
                                                                onClick={() => togglePasswordVisibility(cred.id)}
                                                            >
                                                                {showPasswords[cred.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7"
                                                                onClick={() => copyToClipboard(cred.initial_password, "Password")}
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-10">
                                                        <Button variant="outline" size="sm" className="rounded-lg h-9 border-slate-200">
                                                            Send Mail
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </CardContent>

                    </Card>
                </>
            )}

            {/* Error Reporting */}
            {errors.length > 0 && (
                <div className="bg-red-50/50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-3xl p-8 space-y-4">
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                        <TriangleAlert className="h-6 w-6" />
                        <h3 className="text-xl font-bold">Process Conflicts</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {errors.map((err, i) => (
                            <div key={i} className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-red-100 dark:border-red-900/20">
                                <p className="text-sm text-red-600 font-bold">Row {err.index + 1}: {JSON.stringify(err.errors || err.error)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
