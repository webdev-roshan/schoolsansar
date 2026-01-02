"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { RoleFormData, PermissionGroup } from "@/types/roles";
import { Role } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const roleSchema = z.object({
    name: z.string().min(1, "Role name is required"),
    description: z.string(),
    permission_ids: z.array(z.string()).min(1, "Select at least one permission"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
    initialData?: Role;
    permissionGroups: PermissionGroup[];
    onSubmit: (data: RoleFormData) => void;
    isSubmitting: boolean;
}

export default function RoleForm({ initialData, permissionGroups, onSubmit, isSubmitting }: RoleFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            permission_ids: initialData?.permissions.map(p => p.id) || [],
        },
    });

    const togglePermission = (permissionId: string) => {
        const currentIds = form.getValues("permission_ids");
        const exists = currentIds.includes(permissionId);
        const newIds = exists
            ? currentIds.filter(id => id !== permissionId)
            : [...currentIds, permissionId];

        form.setValue("permission_ids", newIds, { shouldValidate: true });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {isEditing ? `Edit Role: ${initialData.name}` : "Create New Role"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {isEditing ? "Modify role details and permissions" : "Define a new role and assign permissions"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" size="xl" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} size="xl">
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {isEditing ? "Update Role" : "Create Role"}
                    </Button>
                </div>
            </div>

            <div>
                {/* Basic Info */}
                <div>
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-xl">General Information</CardTitle>
                            <CardDescription>Basic details about this role</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FloatingLabelInput
                                {...form.register("name")}
                                id="name"
                                label="Role Name"
                                required
                                disabled={initialData?.is_system_role}
                                error={form.formState.errors.name?.message}
                            />
                            {initialData?.is_system_role && (
                                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl flex items-start gap-2 border border-amber-100 dark:border-amber-900/30">
                                    <ShieldCheck className="h-4 w-4 mt-0.5" />
                                    <span>System Role names cannot be changed, but you can modify their permissions.</span>
                                </p>
                            )}

                            <FloatingLabelInput
                                {...form.register("description")}
                                id="description"
                                label="Description"
                                error={form.formState.errors.description?.message}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Permissions */}
                <div className="mt-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                            <div>
                                <CardTitle className="text-xl">Access Permissions</CardTitle>
                                <CardDescription>Select what this role is allowed to do</CardDescription>
                            </div>
                            <div className="bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 px-3 py-1 rounded-full text-xs font-bold">
                                {form.watch("permission_ids").length} selected
                            </div>
                        </CardHeader>
                        <CardContent>
                            {form.formState.errors.permission_ids && (
                                <p className="text-sm text-red-500 font-semibold mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                                    {form.formState.errors.permission_ids.message}
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {permissionGroups.map((group) => (
                                    <div key={group.module} className="space-y-4">
                                        <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest px-1">
                                            {group.module}
                                        </h4>
                                        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            {group.permissions.map((perm) => (
                                                <div key={perm.id} className="flex items-start gap-3 group">
                                                    <Checkbox
                                                        id={perm.id}
                                                        checked={form.watch("permission_ids").includes(perm.id)}
                                                        onCheckedChange={() => togglePermission(perm.id)}
                                                        className="mt-1"
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <Label
                                                            htmlFor={perm.id}
                                                            className="text-sm font-semibold leading-none cursor-pointer group-hover:text-sky-600 transition-colors"
                                                        >
                                                            {perm.name}
                                                        </Label>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                                            {perm.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
