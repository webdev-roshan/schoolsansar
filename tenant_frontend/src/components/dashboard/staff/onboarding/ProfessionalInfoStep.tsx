"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';

interface ProfessionalInfoStepProps {
    form: UseFormReturn<any>;
}

export default function ProfessionalInfoStep({ form }: ProfessionalInfoStepProps) {
    const { register, formState: { errors } } = form;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput
                    id="specialization"
                    label="Specialization (e.g., Mathematics)"
                    {...register('specialization')}
                    error={errors.specialization?.message as string}
                />
                <FloatingLabelInput
                    id="qualification"
                    label="Qualification (e.g., PhD, MSc)"
                    {...register('qualification')}
                    error={errors.qualification?.message as string}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput
                    id="joining_date"
                    label="Joining Date"
                    type="date"
                    {...register('joining_date')}
                    error={errors.joining_date?.message as string}
                />
                <FloatingLabelInput
                    id="experience_years"
                    label="Years of Experience"
                    type="number"
                    {...register('experience_years', { valueAsNumber: true })}
                    error={errors.experience_years?.message as string}
                />
            </div>

            <div className="space-y-1">
                <FloatingLabelInput
                    id="bio"
                    label="Short Bio / Profile Summary"
                    {...register('bio')}
                    error={errors.bio?.message as string}
                />
            </div>
        </div>
    );
}
