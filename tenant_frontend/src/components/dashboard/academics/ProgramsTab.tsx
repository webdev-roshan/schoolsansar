"use client";

import { useState } from "react";
import { usePrograms, useCreateProgram } from "@/hooks/useAcademics";
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
import { Textarea } from "@/components/ui/textarea";

export default function ProgramsTab() {
    const { data: programs, isLoading } = usePrograms();
    const { mutate: createProgram, isPending } = useCreateProgram();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        createProgram({
            name: formData.get("name"),
            code: formData.get("code"),
            description: formData.get("description"),
        }, {
            onSuccess: () => setIsDialogOpen(false)
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Academic Programs</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Program
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Program</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Program Name</Label>
                                <Input id="name" name="name" placeholder="e.g. High School Science" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Program Code</Label>
                                <Input id="code" name="code" placeholder="e.g. HS-SCI" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Optional description..." />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Creating..." : "Create Program"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {programs?.map((program) => (
                    <div key={program.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-semibold text-lg">{program.name}</h4>
                                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                                    {program.code}
                                </span>
                            </div>
                            {/* Actions can go here */}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {program.description || "No description provided."}
                        </p>
                        <div className="text-xs text-muted-foreground pt-4 border-t">
                            {program.levels?.length || 0} Levels
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
