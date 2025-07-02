import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useOrganization, useUser } from '@clerk/nextjs'
import useFetch from '@/hooks/use-fetch'
import { deleteIssue, updateIssue } from '@/actions/issues'
import { BarLoader } from 'react-spinners'
import statuses from '@/data/status'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'
import UserAvatar from './user-avatar'
import { toast } from 'sonner'

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"]

const IssueDetailsDialog = ({
    isOpen,
    onClose,
    issue,
    onDelete = () => { },
    onUpdate = () => { },
    borderCol = " ",
}) => {
    const [status, setStatus] = useState(issue.status)
    const [priority, setPriority] = useState(issue.priority)

    const { user } = useUser()
    const { membership } = useOrganization()

    const router = useRouter()
    const pathname = usePathname()
    const isProjectPage = !pathname.startsWith("/project/")
    const canChange = user.id === issue.reporter.clerkUserId || membership.role === "org:admin"

    const {
        loading: deleteLoading,
        error: deleteError,
        fn: deleteIssueFn,
        data: deleted
    } = useFetch(deleteIssue)

    const {
        loading: updateLoading,
        error: updateError,
        fn: updateIssueFn,
        data: updated
    } = useFetch(updateIssue)

    const handleGoToProject = () => {
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`)
    }

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus)
        await toast.promise(
            updateIssueFn(issue.id, { status: newStatus, priority }),
            {
                loading: "Updating status...",
                success: "Status updated successfully",
                error: "Failed to update status",
            }
        )
    }

    const handlePriorityChange = async (newPriority) => {
        setPriority(newPriority)
        await toast.promise(
            updateIssueFn(issue.id, { status, priority: newPriority }),
            {
                loading: "Updating priority...",
                success: "Priority updated successfully",
                error: "Failed to update priority",
            }
        )
    }
    
    const handleDelete = async () => {
        await toast.promise(
            deleteIssueFn(issue.id),
            {
                loading: "Deleting issue...",
                success: "Issue deleted successfully",
                error: "Failed to delete issue",
            }
        )
    }

    useEffect(() => {
        if (deleted) {
            onClose();
            onDelete();
        }
        if (updated) {
            onUpdate(updated);
        }
    }, [deleted, updated, deleteLoading, updateLoading]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div className='flex justify-between items-center'>
                        <DialogTitle className={"text-3xl"}>{issue.title}</DialogTitle>
                    </div>
                    {isProjectPage && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleGoToProject}
                            title="Go to project"
                        >
                            <ExternalLink className='h-4 w-4' />
                        </Button>
                    )}

                </DialogHeader>
                {(updateLoading || deleteLoading) && (
                    <BarLoader width={"100%"} color='#36d7b7' />
                )}
                <div className='space-y-4'>
                    <div className='flex items-center space-x-2'>
                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((option) => (
                                    <SelectItem key={option.key} value={option.key}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={priority} onValueChange={handlePriorityChange} disabled={!canChange}>
                            <SelectTrigger className={`w-full border ${borderCol} rounded`}>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {priorityOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <h4 className="font-semibold">Description</h4>
                        <MDEditor.Markdown
                            className="rounded px-2 py-1"
                            source={issue.description ? issue.description : "--"}
                        />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold">Assignee</h4>
                            <UserAvatar user={issue.assignee} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold">Reporter</h4>
                            <UserAvatar user={issue.reporter} />
                        </div>
                    </div>
                    {canChange && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={deleteLoading}>
                                    {deleteLoading ? "Deleting..." : "Delete Issue"}
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this issue.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                                    <AlertDialogAction asChild>
                                        <Button
                                            variant="destructive"
                                            className={'text-white'}
                                            onClick={handleDelete}
                                            disabled={deleteLoading}
                                        >
                                            {deleteLoading ? "Deleting..." : "Delete"}
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {(deleteError || updateError) && (
                        <p className="text-red-500">
                            {deleteError?.message || updateError?.message}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>)
}

export default IssueDetailsDialog