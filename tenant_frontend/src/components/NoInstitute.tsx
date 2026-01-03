"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NoInstituteProps {
    subdomain: string;
}

export default function NoInstitute({ subdomain }: NoInstituteProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-4">
            <Card className="max-w-md w-full border-none shadow-2xl text-center p-6 bg-white animate-in fade-in zoom-in duration-300">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-amber-100 rounded-full">
                            <AlertTriangle className="h-10 w-10 text-amber-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-zinc-800 tracking-tight">Institution Not Found</CardTitle>
                    <CardDescription className="text-zinc-500 text-lg">
                        The subdomain <span className="font-bold text-blue-600">{subdomain}</span> does not exist or has been deactivated.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl text-sm text-zinc-600 border border-slate-100">
                        Please check the URL for typos or contact your institution administrator for access to <span className="font-semibold">EDU Sekai</span>.
                    </div>
                    <div className="pt-2 space-y-3">
                        <Button
                            className="w-full h-12 text-md font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                            onClick={() => window.location.href = "http://localhost:3000"}
                        >
                            Go to EDU Sekai Home
                            <ExternalLink className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full h-11 text-zinc-500 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
