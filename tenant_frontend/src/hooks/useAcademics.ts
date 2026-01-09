import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Program, AcademicLevel, Section, Subject, SubjectAssignment } from "../types/Academics";

// === PROGRAMS ===

export const usePrograms = () => {
    return useQuery({
        queryKey: ["programs"],
        queryFn: async () => {
            const response = await axiosInstance.get("/academics/programs/");
            return response.data as Program[];
        }
    });
};

export const useCreateProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post("/academics/programs/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs"] });
            toast.success("Program created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create program");
        }
    });
};

export const useUpdateProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await axiosInstance.patch(`/academics/programs/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs"] });
            toast.success("Program updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update program");
        }
    });
};

export const useDeleteProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/academics/programs/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs"] });
            toast.success("Program deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete program");
        }
    });
};

// === LEVELS ===

export const useAcademicLevels = () => {
    return useQuery({
        queryKey: ["levels"],
        queryFn: async () => {
            const response = await axiosInstance.get("/academics/levels/");
            return response.data as AcademicLevel[];
        }
    });
};

export const useCreateLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post("/academics/levels/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            queryClient.invalidateQueries({ queryKey: ["programs"] });
            toast.success("Academic Level created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create level");
        }
    });
};

export const useUpdateLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await axiosInstance.patch(`/academics/levels/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            queryClient.invalidateQueries({ queryKey: ["programs"] });
            toast.success("Level updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update level");
        }
    });
};

export const useDeleteLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/academics/levels/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            queryClient.invalidateQueries({ queryKey: ["programs"] });
            toast.success("Level deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete level");
        }
    });
};

// === SECTIONS ===

export const useSections = () => {
    return useQuery({
        queryKey: ["sections"],
        queryFn: async () => {
            const response = await axiosInstance.get("/academics/sections/");
            return response.data as Section[];
        }
    });
};

export const useCreateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post("/academics/sections/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sections"] });
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            toast.success("Section created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create section");
        }
    });
};

export const useUpdateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await axiosInstance.patch(`/academics/sections/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sections"] });
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            toast.success("Section updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update section");
        }
    });
};

export const useDeleteSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/academics/sections/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sections"] });
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            toast.success("Section deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete section");
        }
    });
};

// === SUBJECTS ===

export const useSubjects = () => {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: async () => {
            const response = await axiosInstance.get("/academics/subjects/");
            return response.data as Subject[];
        }
    });
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post("/academics/subjects/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create subject");
        }
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await axiosInstance.patch(`/academics/subjects/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update subject");
        }
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/academics/subjects/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete subject");
        }
    });
};

// === ASSIGNMENTS ===

export const useInstructorAssignments = (instructorId: string) => {
    return useQuery({
        queryKey: ["assignments", "instructor", instructorId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/academics/assignments/?instructor=${instructorId}`);
            return response.data as SubjectAssignment[];
        },
        enabled: !!instructorId
    });
};

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post("/academics/assignments/", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            toast.success("Successfully assigned subject");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to assign subject");
        }
    });
};

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await axiosInstance.patch(`/academics/assignments/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            toast.success("Assignment updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update assignment");
        }
    });
};

export const useDeleteAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (assignmentId: string) => {
            await axiosInstance.delete(`/academics/assignments/${assignmentId}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            toast.success("Assignment removed");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to remove assignment");
        }
    });
};
