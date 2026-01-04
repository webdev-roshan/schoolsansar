"use client";

import { useStudents } from "@/hooks/useStudents";
import { usePermissions } from "@/providers/PermissionProvider";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    UserPlus,
    Upload,
    MoreHorizontal,
    Filter,
    GraduationCap,
    LoaderCircle,
    Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { cn } from "@/lib/utils";

export default function StudentsPage() {
    const { can, isOwner } = usePermissions();
    const { data: students, isLoading } = useStudents();
    const router = useRouter();

    const canView = isOwner || can("view_student");

    if (!canView) {
        return <Unauthorized />;
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <LoaderCircle className="h-12 w-12 animate-spin text-sky-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        Student Directory
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        View and manage all students enrolled in your institution
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {(isOwner || can("add_student")) && (
                        <>
                            <Button
                                onClick={() => router.push("/dashboard/students/portal-activation")}
                                variant="outline"
                                size="xl"
                            >
                                <Lock className="h-4 w-4 mr-2" />
                                Portal Activation
                            </Button>
                            <Button
                                onClick={() => router.push("/dashboard/students/admissions")}
                                size="xl"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                New Admission
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Summary could go here */}

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search students by name or ID..."
                        className="pl-10 h-10 rounded-xl border-slate-100 dark:border-slate-800 focus:border-sky-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="lg">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead className="py-4 pl-6">Student Name</TableHead>
                                <TableHead>Enrollment ID</TableHead>
                                <TableHead>Level / Grade</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Account</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students && students.length > 0 ? (
                                students.map((student: any) => (
                                    <TableRow key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 flex items-center justify-center font-bold text-sm">
                                                    {student.full_name[0]}
                                                </div>
                                                <span className="font-semibold">{student.full_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs">
                                                {student.enrollment_id}
                                            </code>
                                        </TableCell>
                                        <TableCell className="font-medium text-sky-600">{student.level}</TableCell>
                                        <TableCell>{student.section || 'Unassigned'}</TableCell>
                                        <TableCell className="capitalize">
                                            {student.status}
                                        </TableCell>
                                        <TableCell>
                                            {student.has_account ? (
                                                <>
                                                    Activated
                                                </>
                                            ) : (
                                                <>
                                                    Offline
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                                            <GraduationCap className="h-12 w-12 mb-2 opacity-20" />
                                            <p className="font-medium">No students found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
