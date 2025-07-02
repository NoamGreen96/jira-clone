"use client"

import { createIssue } from '@/actions/issues'
import { getOrganizationUsers } from '@/actions/organization'
import { issueSchema } from '@/app/lib/validators'
import { Button } from '@/components/ui/button'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import MDEditor from '@uiw/react-md-editor'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'

const IssueCreationDrawer = (
    { isOpen, onClose, sprintId, status, projectId, onIssueCreated, orgId }
) => {
    const {
        control, register, handleSubmit, formState: { errors }, reset,
    } =
        useForm({
            resolver: zodResolver(issueSchema),
            defaultValues: {
                priority: "MEDIUM",
                description: "",
                assigneeId: "",
            }
        })
    const {
        loading: createIssueLoading,
        fn: createIssueFn,
        error,
        data: newIssue,
    } = useFetch(createIssue);

    useEffect(() => {
        if (newIssue) {
            reset()
            onClose()
            onIssueCreated()
            toast.success("Issue added succsesfuly")
        }
    }, [newIssue])

    const {
        loading: usersLoading,
        fn: fetchUsers,
        data: users,
    } = useFetch(getOrganizationUsers);

    useEffect(() => {
        if (isOpen && orgId) {
            fetchUsers(orgId)
        }
    }, [isOpen, orgId])

    const onSubmit = async (data) => {
        await createIssueFn(projectId, {
            ...data,
            status,
            sprintId
        })
        
    }
    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Issue</DrawerTitle>
                </DrawerHeader>
                {usersLoading && <BarLoader width={'100%'} color='#36d7b7' />}
                <form className='p-4 space-y-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <label htmlFor="title" className='block text-sm font-medium mb-1'>Title</label>
                        <Input id="title" {...register("title")} />
                        {errors.title && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="assignee" className='block text-sm font-medium mb-1'>Assignee</label>
                        <Controller
                            name="assigneeId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        {users?.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.assigneeId && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.assigneeId.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="description" className='block text-sm font-medium mb-1'>Description</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />

                            )}
                        />

                    </div>
                    <div>
                        <label htmlFor="priority" className='block text-sm font-medium mb-1'>Priority</label>
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select prioritty" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="URGENT">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {error && <p className='text-red-500 mt-2'>{error.message}</p>}
                    <Button
                        type="submit"
                        disabled={createIssueLoading}
                        className={"w-full"}
                    >
                        {createIssueLoading ? "Creating ..." : "Craete Issue"}{" "}
                    </Button>
                </form>
            </DrawerContent>
        </Drawer>
    );
}

export default IssueCreationDrawer