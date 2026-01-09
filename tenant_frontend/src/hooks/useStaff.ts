import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { InstructorOnboardingData, InstructorActivationData, Instructor, StaffMember, StaffActivationData, StaffOnboardingData } from "../types/Staff";
export type { InstructorOnboardingData, InstructorActivationData, Instructor, StaffMember, StaffActivationData, StaffOnboardingData };

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

export const useOnboardStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post("/staff/onboard-staff/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success("Staff member onboarded successfully!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to onboard staff";
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

export const useActivateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post("/staff/activate-staff/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success("Staff account activated successfully!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to activate staff";
            toast.error(message);
        }
    });
};

// === LISTING ===

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

export const useInstructor = (id: string) => {
    return useQuery({
        queryKey: ["instructors", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/staff/instructors/${id}/`);
            return response.data as Instructor;
        },
        enabled: !!id
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

export const useStaffMember = (id: string) => {
    return useQuery({
        queryKey: ["staff", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/staff/members/${id}/`);
            return response.data as StaffMember;
        },
        enabled: !!id
    });
};

// === MANAGEMENT (EDIT / DELETE) ===

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await axiosInstance.patch(`/staff/members/${id}/`, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            queryClient.invalidateQueries({ queryKey: ["staff", variables.id] });
            toast.success("Staff member updated successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to update staff member";
            toast.error(message);
        }
    });
};

export const useDeleteStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/staff/members/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success("Staff member deleted successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to delete staff member";
            toast.error(message);
        }
    });
};

export const useUpdateInstructor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string | number; data: any }) => {
            const response = await axiosInstance.patch(`/staff/instructors/${id}/`, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
            queryClient.invalidateQueries({ queryKey: ["instructors", variables.id.toString()] });
            toast.success("Instructor updated successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to update instructor";
            toast.error(message);
        }
    });
};

export const useDeleteInstructor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string | number) => {
            await axiosInstance.delete(`/staff/instructors/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
            toast.success("Instructor deleted successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to delete instructor";
            toast.error(message);
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

export const useRoles = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const response = await axiosInstance.get("/roles/");
            return response.data;
        }
    });
};
