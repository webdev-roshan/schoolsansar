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
        }
    ];

    // 2. Academic Management (Permission Protected)
    const academicChildren: SidebarItemType[] = [];

    if (can("view_student")) {
        academicChildren.push({
            label: "Students",
            icon: Users,
            href: "/dashboard/students",
            children: [
                { label: "Active Students", href: "/dashboard/students" },
                { label: "Admissions", href: "/dashboard/students/admissions" },
            ]
        });
    }

    // Courses and Exams currently use placeholders or will need permissions later
    academicChildren.push({
        label: "Courses",
        icon: BookOpen,
        href: "/dashboard/courses"
    });

    academicChildren.push({
        label: "Examinations",
        icon: FileText,
        href: "/dashboard/exams"
    });

    if (academicChildren.length > 0) {
        menuItems.push({
            label: "Academic Management",
            icon: GraduationCap,
            children: academicChildren
        });
    }

    // 3. Institution Management Section (Permission Protected)
    const institutionChildren: SidebarItemType[] = [];

    if (can("view_institution_profile")) {
        institutionChildren.push({
            label: "Settings",
            icon: Settings,
            href: "/dashboard/institution/settings"
        });
    }

    if (can("view_staff")) {
        institutionChildren.push({
            label: "Staff Directory",
            icon: Users,
            href: "/dashboard/institution/staff"
        });
    }

    if (can("view_role")) {
        institutionChildren.push({
            label: "Roles & Permissions",
            icon: Shield,
            href: "/dashboard/institution/roles"
        });
    }

    if (can("view_family")) {
        institutionChildren.push({
            label: "Family Portal",
            icon: Users,
            href: "/dashboard/institution/families"
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
