import { actions } from "astro:actions";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";
import type { Promotions as PromotionsType } from "@/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";


export const Promotions = ({ promotions }: { promotions: PromotionsType[] }) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tier, setTier] = useState<'bronze' | 'silver' | 'gold'>('bronze')

    async function addPromotion() {
        const response = actions.admin.addPromotion({
            title,
            description,
            tier
        })
    }

    return (
        <div className="m-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Promotion</Button>
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
                            <Label htmlFor="tier" className="text-right">Tier</Label>
                            <Select value={tier} onValueChange={(value) => setTier(value as 'bronze' | 'silver' | 'gold')}>
                                <SelectTrigger>
                                    {tier}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bronze">Bronze</SelectItem>
                                    <SelectItem value="silver">Silver</SelectItem>
                                    <SelectItem value="gold">Gold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={addPromotion}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {promotions && promotions.map((promotion) => (
                        <TableRow key={promotion.id}>
                            <TableCell className="font-medium "><a href={`/admin/promotion/${promotion.id}`} className="hover:underline text-blue-500">{promotion.name}</a></TableCell>
                            <TableCell>{new Date(promotion.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</TableCell>
                            <TableCell>{new Date(promotion.updatedAt).toLocaleDateString('en-US', {
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