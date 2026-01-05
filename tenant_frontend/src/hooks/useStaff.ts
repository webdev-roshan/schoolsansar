import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { InstructorOnboardingData, InstructorActivationData, Instructor, StaffMember } from "../types/Staff";
export type { InstructorOnboardingData, InstructorActivationData, Instructor, StaffMember };

// === ONBOARDING (HIRING) ===

export const useOnboardInstructor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: InstructorOnboardingData) => {
            const response = await axiosInstance.post("/staff/onboard-instructor/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success("Instructor onboarded successfully!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to onboard instructor";
            toast.error(message);
        }
    });
};

// === ACTIVATION (IT ACCESS) ===

export const useActivateInstructor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: InstructorActivationData) => {
            const response = await axiosInstance.post("/staff/activate-instructor/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
            toast.success("Instructor account activated successfully!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to activate instructor";
            toast.error(message);
        }
    });
};

// === LISTING ===

export const useInstructors = () => {
    return useQuery({
        queryKey: ["instructors"],
        queryFn: async () => {
            const response = await axiosInstance.get("/staff/instructors/");
            return response.data as Instructor[];
        }
    });
};

export const useStaffMembers = () => {
    return useQuery({
        queryKey: ["staff"],
        queryFn: async () => {
            const response = await axiosInstance.get("/staff/members/");
            return response.data as StaffMember[];
        }
    });
};
// === DISTRIBUTION ===

export const usePendingStaffCredentials = () => {
    return useQuery({
        queryKey: ["staff-credentials"],
        queryFn: async () => {
            const response = await axiosInstance.get("/staff/credential-distribution/");
            return response.data;
        }
    });
};
