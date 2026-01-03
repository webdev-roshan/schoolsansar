"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Check, ShieldCheck, User, GraduationCap, Users as UsersIcon } from 'lucide-react';

interface ReviewStepProps {
    form: UseFormReturn<any>;
}

export default function ReviewStep({ form }: ReviewStepProps) {
    const values = form.getValues();

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center py-6">
                <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                    <Check className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Ready to Enroll</h2>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">Please review the student details carefully before final submission.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Student Info Card */}
                <div className="bg-white dark:bg-slate-900/50 p-8 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                            <User className="h-5 w-5 text-sky-600" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Student Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {values.first_name} {values.middle_name ? `${values.middle_name} ` : ''}{values.last_name}
                            </p>
                            <p className="text-slate-500 text-sm mt-1">{values.gender} • Born {values.date_of_birth}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Email</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{values.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Phone</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{values.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Card */}
                <div className="bg-white dark:bg-slate-900/50 p-8 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <GraduationCap className="h-5 w-5 text-amber-600" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Academic Placement</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-2xl font-bold text-sky-600">{values.level}</p>
                            <p className="text-slate-500 text-sm mt-1">Section {values.section || 'N/A'} • Session {values.academic_year}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Admission Date</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{values.admission_date || 'Current'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Previous School</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{values.previous_school || 'None'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guardian List Card */}
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <UsersIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Guardians</h4>
                </div>
                {values.parents && values.parents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {values.parents.map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{p.first_name} {p.last_name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-1 uppercase tracking-tighter">
                                        <Check className="h-3 w-3 text-emerald-500" /> {p.relation}
                                        {p.is_primary && <span className="text-[10px] bg-sky-100 dark:bg-sky-900/40 text-sky-600 px-1.5 py-0.5 rounded ml-1 font-black">PRIMARY</span>}
                                    </p>
                                </div>
                                <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{p.phone}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm">No guardians added.</div>
                )}
            </div>

            <div className="flex items-center gap-2 justify-center py-4 text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-medium tracking-tight">Records will be securely stored in the organization database.</span>
            </div>
        </div>
    );
}
