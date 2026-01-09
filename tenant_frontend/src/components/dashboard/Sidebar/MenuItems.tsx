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

    if (studentChildren.length > 0) {
        menuItems.push({
            label: "Student Management",
            icon: Users,
            children: studentChildren
        });
    }

    // 3. Staff (Operational HR)
    const staffChildren: SidebarItemType[] = [];
    if (can("view_staff")) {
        staffChildren.push({ label: "Staff Directory", href: "/dashboard/staff" });
    }
    if (can("add_staff")) {
        staffChildren.push({ label: "Recruit Staff", href: "/dashboard/hr/recruit" });
    }

    if (staffChildren.length > 0) {
        menuItems.push({
            label: "Staff",
            icon: Briefcase,
            children: staffChildren
        });
    }

    // 4. Instructors (Academic Faculty)
    const instructorChildren: SidebarItemType[] = [];
    if (can("view_staff") || can("view_student")) {
        instructorChildren.push({ label: "Instructors Directory", href: "/dashboard/instructors" });
    }

    if (instructorChildren.length > 0) {
        menuItems.push({
            label: "Instructors",
            icon: School,
            children: instructorChildren
        });
    }

    // 5. Academics
    const academicChildren: SidebarItemType[] = [];
    academicChildren.push({ label: "Courses & Classes", href: "/dashboard/courses" });

    if (academicChildren.length > 0) {
        menuItems.push({
            label: "Academics",
            icon: GraduationCap,
            children: academicChildren
        });
    }

    // 6. Portal Access (Restored)
    const accessChildren: SidebarItemType[] = [];
    if (can("activate_student_portal")) {
        accessChildren.push({ label: "Student Portal", href: "/dashboard/portal-access/students" });
    }
    if (can("activate_staff_portal")) {
        accessChildren.push({ label: "Staff Portal", href: "/dashboard/portal-access/staff" });
    }

    if (accessChildren.length > 0) {
        menuItems.push({
            label: "Portal Access",
            icon: Lock,
            children: accessChildren
        });
    }

    // 7. Administration
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

    if (adminChildren.length > 0) {
        menuItems.push({
            label: "Administration",
            icon: Settings,
            children: adminChildren
        });
    }

    return menuItems;
};
