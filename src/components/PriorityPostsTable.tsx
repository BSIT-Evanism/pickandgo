import type { PriorityPostWithPost } from "@/db/schema";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "./ui/table";

export const PriorityPostsTable = ({ priorityPosts }: { priorityPosts: PriorityPostWithPost[] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {priorityPosts.map((post, index) => (
                    <TableRow key={index}>
                        <TableCell>{post.post.title}</TableCell>
                        <TableCell>{post.priority}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}