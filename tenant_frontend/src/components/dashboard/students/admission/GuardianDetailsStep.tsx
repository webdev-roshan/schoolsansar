"use client";

import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuardianDetailsStepProps {
    form: UseFormReturn<any>;
}

export default function GuardianDetailsStep({ form }: GuardianDetailsStepProps) {
    const { register, control, setValue, formState: { errors } } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "parents"
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                        <Users className="h-5 w-5 text-sky-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Guardian Information</h3>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({
                        first_name: '',
                        last_name: '',
                        phone: '',
                        gender: 'male',
                        relation: 'father',
                        is_primary: fields.length === 0
                    })}
                    className="rounded-xl border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-800 dark:hover:bg-sky-900/20 h-10 px-4"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Parent
                </Button>
            </div>

            {fields.length === 0 && (
                <div className={cn(
                    "py-16 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-4xl border-2 border-dashed transition-colors",
                    errors.parents ? "border-red-200 bg-red-50/30 dark:border-red-900/20" : "border-slate-200 dark:border-slate-800"
                )}>
                    <Users className={cn("h-12 w-12 mx-auto mb-4", errors.parents ? "text-red-300" : "text-slate-300")} />
                    <p className={cn("font-medium", errors.parents ? "text-red-500" : "text-slate-500")}>
                        {errors.parents?.message as string || "No parents added yet."}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">At least one primary guardian is recommended.</p>
                </div>
            )}

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-8 bg-white dark:bg-slate-900/50 rounded-4xl border border-slate-100 dark:border-slate-800 relative animate-in zoom-in-95 duration-300 shadow-sm hover:shadow-md transition-shadow">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-9 w-9 rounded-xl transition-colors"
                        >
                            <Trash2 className="h-4.5 w-4.5" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <FloatingLabelInput
                                id={`parents.${index}.first_name`}
                                label="First Name"
                                {...register(`parents.${index}.first_name`)}
                                error={(errors.parents as any)?.[index]?.first_name?.message}
                            />
                            <FloatingLabelInput
                                id={`parents.${index}.last_name`}
                                label="Last Name"
                                {...register(`parents.${index}.last_name`)}
                                error={(errors.parents as any)?.[index]?.last_name?.message}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FloatingLabelInput
                                id={`parents.${index}.phone`}
                                label="Phone Number"
                                {...register(`parents.${index}.phone`)}
                                error={(errors.parents as any)?.[index]?.phone?.message}
                            />
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Relation</Label>
                                <Select
                                    onValueChange={(val) => setValue(`parents.${index}.relation`, val)}
                                    defaultValue={(field as any).relation}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white dark:bg-slate-900 shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="father">Father</SelectItem>
                                        <SelectItem value="mother">Mother</SelectItem>
                                        <SelectItem value="guardian">Legal Guardian</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center h-full pt-6 pl-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register(`parents.${index}.is_primary`)}
                                            className="peer h-6 w-6 rounded-lg border-2 border-slate-200 dark:border-slate-800 text-sky-600 focus:ring-sky-500 transition-all checked:border-sky-600 appearance-none bg-white dark:bg-slate-900"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                            <div className="h-2 w-2 bg-sky-600 rounded-full" />
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-sky-600 transition-colors">Primary Contact</span>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
