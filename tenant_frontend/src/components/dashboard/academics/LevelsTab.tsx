"use client";

import { useState } from "react";
import { useAcademicLevels, useCreateLevel, usePrograms } from "@/hooks/useAcademics";
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

export default function LevelsTab() {
    const { data: levels, isLoading: isLoadingLevels } = useAcademicLevels();
    const { data: programs } = usePrograms();
    const { mutate: createLevel, isPending } = useCreateLevel();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        createLevel({
            program: selectedProgram,
            name: formData.get("name"),
            order: parseInt(formData.get("order") as string),
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setSelectedProgram("");
            }
        });
    };

    if (isLoadingLevels) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Academic Levels</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Level
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Level</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Program</Label>
                                <Select value={selectedProgram} onValueChange={setSelectedProgram} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {programs?.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Level Name</Label>
                                <Input id="name" name="name" placeholder="e.g. Grade 10 or Semester 1" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Sort Order</Label>
                                <Input id="order" name="order" type="number" defaultValue={1} required />
                                <p className="text-xs text-muted-foreground">Used for sorting levels (1, 2, 3...)</p>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={isPending || !selectedProgram}>
                                    {isPending ? "Creating..." : "Create Level"}
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
                            <TableHead>Level Name</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Sections</TableHead>
                            {/* <TableHead className="text-right">Actions</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {levels?.map((level) => (
                            <TableRow key={level.id}>
                                <TableCell className="font-medium">{level.name}</TableCell>
                                <TableCell>{level.program_name}</TableCell>
                                <TableCell>{level.order}</TableCell>
                                <TableCell>{level.sections?.length || 0}</TableCell>
                                {/* <TableCell className="text-right">...</TableCell> */}
                            </TableRow>
                        ))}
                        {(!levels || levels.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No academic levels found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
