"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AcademicInfoStepProps {
    form: UseFormReturn<any>;
}

export default function AcademicInfoStep({ form }: AcademicInfoStepProps) {
    const { register, formState: { errors }, setValue, watch } = form;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Enrolling Into Grade/Level</Label>
                    <Select
                        onValueChange={(val) => setValue('level', val)}
                        defaultValue={watch('level')}
                    >
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-sky-500 bg-white dark:bg-slate-900 shadow-sm">
                            <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="Playgroup">Playgroup</SelectItem>
                            <SelectItem value="Nursery">Nursery</SelectItem>
                            <SelectItem value="LKG">LKG</SelectItem>
                            <SelectItem value="UKG">UKG</SelectItem>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.level && <p className="text-xs font-semibold text-red-500 px-1">{errors.level.message as string}</p>}
                </div>
                <FloatingLabelInput
                    id="section"
                    label="Section (Optional)"
                    {...register('section')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput
                    id="academic_year"
                    label="Academic Year"
                    {...register('academic_year')}
                    error={errors.academic_year?.message as string}
                />
                <FloatingLabelInput
                    id="admission_date"
                    label="Admission Date"
                    type="date"
                    {...register('admission_date')}
                    error={errors.admission_date?.message as string}
                />
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-6">Previous Academic History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingLabelInput
                        id="previous_school"
                        label="Previous School Name"
                        {...register('previous_school')}
                    />
                    <FloatingLabelInput
                        id="last_grade_passed"
                        label="Last Grade Passed"
                        {...register('last_grade_passed')}
                    />
                </div>
            </div>
        </div>
    );
}
