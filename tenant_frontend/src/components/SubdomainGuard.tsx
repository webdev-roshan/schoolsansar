"use client";

import { useEffect, useState } from "react";
import { useCheckSubdomain } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";
import NoInstitute from "./NoInstitute";
import NoUser from "./NoUser";

export default function SubdomainGuard({ children }: { children: React.ReactNode }) {
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [isUserMissing, setIsUserMissing] = useState(false);
    const { mutate: checkDomain, isPending } = useCheckSubdomain();
    const [subdomain, setSubdomain] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const host = window.location.hostname;
            const parts = host.split(".");
            if (parts.length >= 2) {
                const sub = parts[0];
                setSubdomain(sub);
                checkDomain(sub, {
                    onSuccess: (exists) => {
                        setIsVerified(exists);
                    },
                    onError: (error: any) => {
                        const errorCode = error.response?.data?.code;
                        const errorDetail = error.response?.data?.detail;

                        // If backend says user not found, the domain itself might be valid
                        // but the session is broken (e.g. after DB reset)
                        if (errorCode === "user_not_found" || errorDetail === "User not found") {
                            setIsVerified(true); // Domain is implicitly verified if we get this far
                            setIsUserMissing(true);
                        } else {
                            setIsVerified(false);
                        }
                    }
                });
            } else {
                setIsVerified(false);
            }
        }
    }, [checkDomain]);

    if (isPending || isVerified === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-zinc-500 font-medium">Verifying your institution...</p>
            </div>
        );
    }

    if (isUserMissing) {
        return <NoUser />;
    }

    if (isVerified === false) {
        return <NoInstitute subdomain={subdomain} />;
    }

    return <>{children}</>;
}
