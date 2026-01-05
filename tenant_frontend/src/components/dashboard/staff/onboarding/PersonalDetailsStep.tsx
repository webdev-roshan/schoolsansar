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

interface PersonalDetailsStepProps {
    form: UseFormReturn<any>;
}

export default function PersonalDetailsStep({ form }: PersonalDetailsStepProps) {
    const { register, formState: { errors }, setValue, watch } = form;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FloatingLabelInput
                    id="first_name"
                    label="First Name"
                    {...register('first_name')}
                    error={errors.first_name?.message as string}
                />
                <FloatingLabelInput
                    id="middle_name"
                    label="Middle Name"
                    {...register('middle_name')}
                />
                <FloatingLabelInput
                    id="last_name"
                    label="Last Name"
                    {...register('last_name')}
                    error={errors.last_name?.message as string}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Gender</Label>
                    <Select
                        onValueChange={(val) => setValue('gender', val)}
                        defaultValue={watch('gender')}
                    >
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-sky-500 bg-white dark:bg-slate-900 shadow-sm">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-xs font-semibold text-red-500 px-1">{errors.gender.message as string}</p>}
                </div>
                <FloatingLabelInput
                    id="date_of_birth"
                    label="Date of Birth"
                    type="date"
                    {...register('date_of_birth')}
                    error={errors.date_of_birth?.message as string}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput
                    id="email"
                    label="Email Address (Contact)"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message as string}
                />
                <FloatingLabelInput
                    id="phone"
                    label="Phone Number"
                    {...register('phone')}
                    error={errors.phone?.message as string}
                />
            </div>

            <FloatingLabelInput
                id="address"
                label="Home Address"
                {...register('address')}
                error={errors.address?.message as string}
            />
        </div>
    );
}
