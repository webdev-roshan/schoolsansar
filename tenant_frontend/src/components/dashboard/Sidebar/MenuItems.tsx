import {
    LayoutDashboard,
    UserCircle,
    School,
    Settings,
    GraduationCap,
    Users,
    BookOpen,
    FileText,
    Shield
} from "lucide-react";
import { SidebarItemType } from "@/components/dashboard/Sidebar/SidebarItem";

export const getMenuItems = (user: any, can: (permission: string) => boolean): SidebarItemType[] => {
    // 1. Core Menu Items (Always Visible to logged-in users)
    const menuItems: SidebarItemType[] = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard"
        },
        {
            label: "Academic Management",
            icon: GraduationCap,
            children: [
                {
                    label: "Students",
                    icon: Users,
                    href: "/dashboard/students",
                    children: [
                        { label: "Active Students", href: "/dashboard/students/active" },
                        { label: "Admissions", href: "/dashboard/students/admissions" },
                    ]
                },
                {
                    label: "Courses",
                    icon: BookOpen,
                    href: "/dashboard/courses"
                },
                {
                    label: "Examinations",
                    icon: FileText,
                    href: "/dashboard/exams"
                }
            ]
        },
    ];

    // 2. Institution Management Section (Permission Protected)
    const institutionChildren: SidebarItemType[] = [];

    if (can("view_institution_profile")) {
        institutionChildren.push({
            label: "Settings",
            icon: Settings,
            href: "/dashboard/institution/settings"
        });
    }

    // "Staff Directory" currently has no permission, allowing for now if staff/owner
    // ideally we should add view_staff permission later.
    const isManagement = user?.active_role === "owner" || user?.active_role === "staff";
    if (isManagement) {
        institutionChildren.push({
            label: "Staff Directory",
            icon: Users,
            href: "/dashboard/institution/staff"
        });

        // Security or other catch-all
        institutionChildren.push({
            label: "Security",
            icon: Shield,
            href: "/dashboard/institution/security"
        });
    }

    if (can("view_role")) {
        institutionChildren.push({
            label: "Roles & Permissions",
            icon: Shield,
            href: "/dashboard/institution/roles"
        });
    }

    // Only add the Institution section if there are actually items to show
    if (institutionChildren.length > 0) {
        menuItems.push({
            label: "Institution",
            icon: School,
            children: institutionChildren
        });
    }

    return menuItems;
};
