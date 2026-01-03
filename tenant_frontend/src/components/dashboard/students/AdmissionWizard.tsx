"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User,
    GraduationCap,
    Users,
    ArrowRight,
    ArrowLeft,
    Check,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEnrollStudent, StudentEnrollmentData } from '@/hooks/useStudents';
import { useRouter } from 'next/navigation';

// Sub-components
import PersonalDetailsStep from './admission/PersonalDetailsStep';
import AcademicInfoStep from './admission/AcademicInfoStep';
import GuardianDetailsStep from './admission/GuardianDetailsStep';
import ReviewStep from './admission/ReviewStep';

const enrollmentSchema = z.object({
    // Personal Info
    first_name: z.string().min(2, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
    gender: z.enum(['male', 'female', 'other']),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    phone: z.string().optional(),
    address: z.string().min(1, "Current address is required"),

    // Academic Info
    level: z.string().min(1, "Grade level is required"),
    section: z.string().optional(),
    academic_year: z.string().min(1, "Academic year is required"),
    admission_date: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
    previous_school: z.string().optional(),
    last_grade_passed: z.string().optional(),

    // Parents
    parents: z.array(z.object({
        first_name: z.string().min(2, "First name is required"),
        last_name: z.string().min(2, "Last name is required"),
        phone: z.string().min(1, "Phone is required"),
        gender: z.string(),
        occupation: z.string().optional(),
        relation: z.string(),
        is_primary: z.boolean()
    })).min(1, "At least one guardian information is required").default([])
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

const STEPS = [
    { title: "Student Details", icon: User },
    { title: "Academic Info", icon: GraduationCap },
    { title: "Guardians", icon: Users },
    { title: "Finalize", icon: Check }
];

export default function AdmissionWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const { mutate: enrollStudent, isPending } = useEnrollStudent();
    const router = useRouter();

    const form = useForm<EnrollmentFormData>({
        resolver: zodResolver(enrollmentSchema) as any,
        defaultValues: {
            gender: 'male',
            academic_year: new Date().getFullYear().toString(),
            parents: []
        },
        mode: "onBlur"
    });

    const nextStep = async () => {
        const fieldsToValidate = getFieldsForStep(currentStep);
        const isValid = await form.trigger(fieldsToValidate as any);

        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getFieldsForStep = (step: number) => {
        switch (step) {
            case 0: return ['first_name', 'last_name', 'gender', 'date_of_birth', 'address'];
            case 1: return ['level', 'academic_year'];
            case 2: return ['parents'];
            default: return [];
        }
    };

    const onSubmit = async (data: EnrollmentFormData) => {
        // Prevent submission if not on final step
        if (currentStep < STEPS.length - 1) {
            await nextStep();
            return;
        }

        enrollStudent(data as unknown as StudentEnrollmentData, {
            onSuccess: () => {
                router.push('/dashboard/students');
            },
            onError: (error: any) => {
                // If the error response has field-specific errors, map them to form
                const serverErrors = error.response?.data;
                if (serverErrors && typeof serverErrors === 'object') {
                    Object.keys(serverErrors).forEach((key) => {
                        form.setError(key as any, {
                            type: 'manual',
                            message: Array.isArray(serverErrors[key])
                                ? serverErrors[key][0]
                                : 'Invalid value'
                        });
                    });
                }
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* Step Indicator */}
            <div className="flex justify-between mb-16 relative max-w-2xl mx-auto">
                <div className="absolute top-[22px] left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 z-0" />
                <div
                    className="absolute top-[22px] left-0 h-[2px] bg-sky-500 transition-all duration-500 ease-in-out z-0"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;

                    return (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                            <div className={cn(
                                "h-12 w-12 rounded-[1.25rem] flex items-center justify-center border-4 transition-all duration-500",
                                isActive ? "bg-sky-600 border-sky-100 dark:border-sky-900/50 text-white shadow-lg shadow-sky-600/20 scale-110" :
                                    isCompleted ? "bg-emerald-500 border-emerald-50 dark:border-emerald-900/40 text-white" :
                                        "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 shadow-sm"
                            )}>
                                <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                            </div>
                            <span className={cn(
                                "absolute top-16 text-[10px] font-black whitespace-nowrap uppercase tracking-[0.2em]",
                                isActive ? "text-sky-600" : isCompleted ? "text-emerald-500" : "text-slate-400"
                            )}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
                <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 md:p-16">
                        {currentStep === 0 && <PersonalDetailsStep form={form} />}
                        {currentStep === 1 && <AcademicInfoStep form={form} />}
                        {currentStep === 2 && <GuardianDetailsStep form={form} />}
                        {currentStep === 3 && <ReviewStep form={form} />}
                    </CardContent>

                    {/* Footer Controls */}
                    <div className="px-8 md:px-16 py-10 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="rounded-2xl h-14 px-8 text-slate-500 font-bold hover:bg-white dark:hover:bg-slate-800 shadow-sm disabled:opacity-30 transition-all hover:translate-x-[-4px]"
                        >
                            <ArrowLeft className="h-5 w-5 mr-3" /> Previous
                        </Button>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-400 mr-4 uppercase tracking-widest hidden md:block">
                                Step {currentStep + 1} of {STEPS.length}
                            </span>

                            {currentStep < STEPS.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    size="xxl"
                                >
                                    Next Step <ArrowRight className="h-5 w-5 ml-3" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-12 font-black shadow-2xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isPending ? (
                                        <div className="flex items-center">
                                            <Loader2 className="h-5 w-5 animate-spin mr-3" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Check className="h-5 w-5 mr-3" />
                                            Complete Admission
                                        </div>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
}
