"use client";

import { useState } from "react";
import { useSections, useCreateSection, useAcademicLevels } from "@/hooks/useAcademics";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function SectionsTab() {
    const { data: sections, isLoading } = useSections();
    const { data: levels } = useAcademicLevels();
    const { mutate: createSection, isPending } = useCreateSection();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Group levels by program for easier selection
    const [selectedLevel, setSelectedLevel] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        createSection({
            level: selectedLevel,
            name: formData.get("name"),
            capacity: parseInt(formData.get("capacity") as string),
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setSelectedLevel("");
            }
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Class Sections</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Section
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Section</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Level</Label>
                                <Select value={selectedLevel} onValueChange={setSelectedLevel} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Grade/Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels?.map((lvl) => (
                                            <SelectItem key={lvl.id} value={lvl.id}>
                                                {lvl.program_name} - {lvl.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Section Name</Label>
                                <Input id="name" name="name" placeholder="e.g. A, Morning, Group 1" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input id="capacity" name="capacity" type="number" defaultValue={40} required />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={isPending || !selectedLevel}>
                                    {isPending ? "Creating..." : "Create Section"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Section</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Capacity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sections?.map((section) => (
                            <TableRow key={section.id}>
                                <TableCell className="font-medium">{section.name}</TableCell>
                                <TableCell>{section.level_name}</TableCell>
                                <TableCell>{section.program_name}</TableCell>
                                <TableCell>{section.capacity}</TableCell>
                            </TableRow>
                        ))}
                        {(!sections || sections.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No sections found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
