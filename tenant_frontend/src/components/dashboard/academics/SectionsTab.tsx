"use client";

import { useState } from "react";
import { useSections, useAcademicLevels, useCreateSection, useUpdateSection, useDeleteSection } from "@/hooks/useAcademics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Pencil, Trash2, Users, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Section } from "@/types/Academics";

export default function SectionsTab() {
    const { data: sections, isLoading: isLoadingSections } = useSections();
    const { data: levels, isLoading: isLoadingLevels } = useAcademicLevels();
    const { mutate: createSection, isPending: isCreating } = useCreateSection();
    const { mutate: updateSection, isPending: isUpdating } = useUpdateSection();
    const { mutate: deleteSection } = useDeleteSection();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            level: formData.get("level"),
            name: formData.get("name"),
            capacity: parseInt(formData.get("capacity") as string),
        };

        if (editingSection) {
            updateSection({ id: editingSection.id, data }, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingSection(null);
                }
            });
        } else {
            createSection(data, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                }
            });
        }
    };

    const handleEdit = (section: Section) => {
        setEditingSection(section);
        setIsDialogOpen(true);
    };

    const handleDelete = () => {
        if (sectionToDelete) {
            deleteSection(sectionToDelete);
            setSectionToDelete(null);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingSection(null);
    };

    if (isLoadingSections || isLoadingLevels) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sections</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage class sections and divisions</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Section
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingSection ? "Edit Section" : "Create New Section"}</DialogTitle>
                        <DialogDescription>
                            {editingSection ? "Update section information" : "Add a new section to an academic level"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="level">Academic Level</Label>
                            <Select name="level" defaultValue={editingSection?.level} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels?.map((level) => (
                                        <SelectItem key={level.id} value={level.id}>
                                            {level.program_name} - {level.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Section Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., A, B, Morning"
                                defaultValue={editingSection?.name}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                placeholder="e.g., 40"
                                defaultValue={editingSection?.capacity}
                                required
                            />
                            <p className="text-xs text-slate-500">Maximum number of students</p>
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleDialogClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreating || isUpdating}>
                                {isCreating || isUpdating ? "Saving..." : editingSection ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                        <TableRow>
                            <TableHead>Section</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sections && sections.length > 0 ? (
                            sections.map((section) => (
                                <TableRow key={section.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <TableCell className="font-medium">{section.name}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{section.level_name}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{section.program_name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm">{section.capacity}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(section)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setSectionToDelete(section.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Users className="h-12 w-12 mb-2 opacity-20" />
                                        <p>No sections found. Create one to get started.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!sectionToDelete} onOpenChange={() => setSectionToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the section.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
