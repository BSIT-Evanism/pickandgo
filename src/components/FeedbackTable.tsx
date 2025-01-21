import { Button } from "./ui/button"
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "./ui/table"
import { type Feedback } from "@/db/schema"

import { actions } from "astro:actions"
import { toast } from "sonner"


export const FeedbackTable = ({ feedback }: { feedback: Feedback[] }) => {

    async function resetFeedback() {
        try {
            toast.promise(
                actions.admin.resetFeedback(),
                {
                    loading: 'Resetting feedback...',
                    success: 'Feedback reset successfully',
                    error: 'Failed to reset feedback'
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <Button variant="outline" className="mt-4" onClick={resetFeedback}>
                Reset All Feedback
            </Button>
            <Table className="bg-slate-50 mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {feedback.map((feedback) => (
                        <TableRow key={feedback.id}>
                            <TableCell>{feedback.name}</TableCell>
                            <TableCell>{feedback.email}</TableCell>
                            <TableCell>{feedback.message}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}