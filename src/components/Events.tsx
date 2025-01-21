import { actions } from "astro:actions";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";
import type { Events as EventsType } from "@/db/schema";
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover"


export const Events = ({ events }: { events: EventsType[] }) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 5),
    })

    async function addEvent() {
        try {
            const { data, error } = await actions.admin.addEvent({
                title,
                description,
                startDate: date?.from?.toISOString() || '',
                endDate: date?.to?.toISOString() || ''
            })
            if (error) {
                toast.error('Error adding event')
            } else {
                toast.success('Event added successfully')
                navigate('/admin')
            }
        } catch (error) {
            toast.error('Error adding event')
        }
    }

    return (
        <div className="m-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Events</Button>
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Date</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "LLL dd, y")} -{" "}
                                                        {format(date.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(date.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            disabled={(date) => date < new Date()}
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={addEvent}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead>Event Duration</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events && events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell className="font-medium "><a href={`/admin/event/${event.id}`} className="hover:underline text-blue-500">{event.name}</a></TableCell>
                            <TableCell>
                                {format(new Date(event.startDate), "LLL dd, y")} - {format(new Date(event.endDate), "LLL dd, y")}
                            </TableCell>
                            <TableCell>{new Date(event.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</TableCell>
                            <TableCell>{new Date(event.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div>

            </div>
        </div>
    )
}