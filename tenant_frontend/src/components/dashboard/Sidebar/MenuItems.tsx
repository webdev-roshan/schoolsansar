import {
    LayoutDashboard,
    Users,
    UserPlus,
    GraduationCap,
    BookOpen,
    FileText,
    Shield,
    Settings,
    Briefcase,
    School,
    Lock,
    UserCog,
    Bus,
    Baby,
    Receipt,
    CalendarCheck
} from "lucide-react";
import { SidebarItemType } from "@/components/dashboard/Sidebar/SidebarItem";

export const getMenuItems = (user: any, can: (permission: string) => boolean): SidebarItemType[] => {
    // 1. Dashboard (Global)
    const menuItems: SidebarItemType[] = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard"
        }
    ];

    // 2. Student Management (Core Domain)
    const studentChildren: SidebarItemType[] = [];
    if (can("view_student")) {
        studentChildren.push({ label: "Student Directory", href: "/dashboard/students" });
    }
    if (can("add_student")) {
        studentChildren.push({ label: "Admissions", href: "/dashboard/students/admissions" });
    }
    if (can("activate_student_portal")) {
        studentChildren.push({ label: "Portal Access", href: "/dashboard/students/portal-activation" });
    }
    // Future: Attendance
    // studentChildren.push({ label: "Attendance", href: "/dashboard/students/attendance" });

    if (studentChildren.length > 0) {
        menuItems.push({
            label: "Student Management",
            icon: Users,
            children: studentChildren
        });
    }

    // 3. Human Resources (Staff & Instructors) -> Focus on Employment
    const hrChildren: SidebarItemType[] = [];
    if (can("view_staff")) {
        hrChildren.push({ label: "Staff Directory", href: "/dashboard/staff" }); // Updated to correct route
    }
    if (can("add_staff")) {
        hrChildren.push({ label: "Recruitment", href: "/dashboard/staff/onboarding" });
    }
    if (can("activate_staff_portal")) {
        hrChildren.push({ label: "Portal Access", href: "/dashboard/staff/activation" });
    }
    // Future: Payroll
    // hrChildren.push({ label: "Payroll", href: "/dashboard/hr/payroll" });

    if (hrChildren.length > 0) {
        menuItems.push({
            label: "Human Resources",
            icon: Briefcase,
            children: hrChildren
        });
    }

    // 4. Academics (The "Work" of Instructors) -> Focus on Teaching
    const academicChildren: SidebarItemType[] = [];
    // Currently placeholders, but this is where your "Heavy" instructor modules will grow
    academicChildren.push({ label: "Courses & Classes", href: "/dashboard/courses" });
    academicChildren.push({ label: "Examinations", href: "/dashboard/exams" });
    // Future: Timetable, Syllabus, Assignments, Live Classes
    // academicChildren.push({ label: "Live Classes", href: "/dashboard/academics/live" });

    if (academicChildren.length > 0) {
        menuItems.push({
            label: "Academics",
            icon: GraduationCap,
            children: academicChildren
        });
    }

    // 5. Administration (Settings, Roles, Families)
    const adminChildren: SidebarItemType[] = [];

    if (can("view_institution_profile")) {
        adminChildren.push({ label: "Institution Profile", href: "/dashboard/institution/settings" });
    }

    if (can("view_role")) {
        adminChildren.push({ label: "Roles & Permissions", href: "/dashboard/institution/roles" });
    }

    if (can("view_family")) {
        adminChildren.push({ label: "Family Accounts", href: "/dashboard/institution/families" });
    }

    // Future: Transport, Fees (Could be separate Finance module)
    // adminChildren.push({ label: "Transport", href: "/dashboard/admin/transport", icon: Bus });

    if (adminChildren.length > 0) {
        menuItems.push({
            label: "Administration",
            icon: Settings,
            children: adminChildren
        });
    }

    return menuItems;
};
