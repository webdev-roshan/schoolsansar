"use client";

import { useState } from "react";
import { useSubjects, useCreateSubject, useAcademicLevels } from "@/hooks/useAcademics";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";

export default function SubjectsTab() {
    const { data: subjects, isLoading } = useSubjects();
    const { data: levels } = useAcademicLevels();
    const { mutate: createSubject, isPending } = useCreateSubject();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [selectedLevel, setSelectedLevel] = useState("");
    const [isElective, setIsElective] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        createSubject({
            level: selectedLevel,
            name: formData.get("name"),
            code: formData.get("code"),
            credits: parseFloat(formData.get("credits") as string),
            description: formData.get("description"),
            is_elective: isElective,
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
                <h3 className="text-lg font-medium">Curriculum & Subjects</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Subject
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Subject</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Applicable Level</Label>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Subject Name</Label>
                                    <Input id="name" name="name" placeholder="e.g. Mathematics" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Course Code</Label>
                                    <Input id="code" name="code" placeholder="e.g. MTH101" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credits">Credits</Label>
                                <Input id="credits" name="credits" type="number" step="0.5" defaultValue={1.0} required />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch id="is-elective" checked={isElective} onCheckedChange={setIsElective} />
                                <Label htmlFor="is-elective">Is Elective? (Optional for students)</Label>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Syllabus)</Label>
                                <Textarea id="description" name="description" placeholder="Brief outline..." />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={isPending || !selectedLevel}>
                                    {isPending ? "Creating..." : "Create Subject"}
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
                            <TableHead>Code</TableHead>
                            <TableHead>Subject Name</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Credits</TableHead>
                            <TableHead>Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjects?.map((subject) => (
                            <TableRow key={subject.id}>
                                <TableCell className="font-mono text-xs">{subject.code}</TableCell>
                                <TableCell className="font-medium">{subject.name}</TableCell>
                                <TableCell>{subject.level_name}</TableCell>
                                <TableCell>{subject.credits}</TableCell>
                                <TableCell>
                                    {subject.is_elective ? (
                                        <Badge variant="secondary">Elective</Badge>
                                    ) : (
                                        <Badge variant="outline">Core</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!subjects || subjects.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No subjects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
