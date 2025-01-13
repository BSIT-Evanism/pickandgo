import { Button } from "./ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"


export const PostsTable = ({ posts }: { posts: any[] }) => {

    return (
        <div className="space-y-4">
            <Button className="w-full sm:w-auto">Create Post</Button>
            <div className="rounded-md border">
                <Table>
                    <TableCaption>Posts</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Content</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.content}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}