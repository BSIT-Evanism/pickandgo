import { actions } from "astro:actions";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";
import type { FarmActivity } from "@/db/schema";


export const FarmActivities = ({ activities }: { activities: Omit<FarmActivity, 'image' | 'description'>[] }) => {

    const [title, setTitle] = useState('')

    async function addFarmActivity() {
        try {
            const response = actions.admin.addFarmActivity({
                title: title
            })

            toast.promise(response, {
                loading: 'Adding farm activity...',
                success: (data) => {
                    setTitle('')
                    setTimeout(() => {
                        navigate('/admin/activity/' + data.data?.activity.id)
                    }, 2000)
                    return 'Farm activity added!'
                },
                error: 'Failed to add farm activity'
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="m-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Farm Activity</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Farm Activity</DialogTitle>
                        <DialogDescription>
                            Make sure to double check the dates. Click submit when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Title
                            </Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={addFarmActivity}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Table className="bg-slate-50 mt-4">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>Active</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activities && activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell className="font-medium "><a href={`/admin/activity/${activity.id}`} className="hover:underline text-blue-500">{activity.name}</a></TableCell>
                            <TableCell>{new Date(activity.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</TableCell>
                            <TableCell>{new Date(activity.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</TableCell>
                            <TableCell>{activity.active ? <p className="text-green-500">Active</p> : <p className="text-red-500">Inactive</p>}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 space-y-2 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-xs font-semibold text-gray-800 hover:text-gray-900">Head Section Priority</h2>
                <p className="text-xs text-gray-500">Please be advised that only a max of 3 activities can be active at a time.</p>
                {activities.filter((activity) => activity.active).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-1 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md">
                        <h2 className="text-xs font-semibold text-gray-800 hover:text-gray-900">{activity.name}</h2>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};