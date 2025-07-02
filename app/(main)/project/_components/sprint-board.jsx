'use client'

import React, { useEffect, useState } from 'react'
import SprintManager from './sprint-manager'
import { Droppable, DragDropContext, Draggable } from '@hello-pangea/dnd'
import statuses from '@/data/status'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import IssueCreationDrawer from './create-issue'
import useFetch from '@/hooks/use-fetch'
import { getIssuesForSprint } from '@/actions/issues'
import { BarLoader } from 'react-spinners'
import IssueCard from './issue-card'

const SprintBoard = ({ sprints, projectId, orgId }) => {
    const [currentSprint, setCurrentSprint] = useState(
        sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedStatus, setselectedStatus] = useState(false)

    const handleAddIssue = (status) => {
        setselectedStatus(status)
        setIsDrawerOpen(true)
    }

    const {
        loading: issuesLoading,
        error: issuesError,
        fn: fetchIssues,
        data: issues,
        setData: setIssues,
    } = useFetch(getIssuesForSprint);

    useEffect(() => {
        if (currentSprint.id) {
            fetchIssues(currentSprint.id)
        }
    }, [currentSprint.id])


    const [filteredIssues, setFilteredIssues] = useState(issues)

    const handleIssueCreated = () => {
        fetchIssues(currentSprint.id)
    }

    const onDragEnd = () => { }

    if (issuesError) return <div>Error loading issues</div>

    return (
        <div>
            {/* Sprint Manager */}
            <SprintManager
                sprint={currentSprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />
            {!issues && !issuesLoading &&
                (<BarLoader className='mt-4' width={"100%"} color='#36d7b7' />)}

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-4 bg-slate-900 p-4 rounded-lg'>
                    {statuses.map((column) => (
                        <Droppable key={column.key} droppableId={column.key}>
                            {(provided) => (
                                <div ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className='space-y-2' 
                                    >
                                    <h3 className='font-semibold mb-2 text-center' >{column.name}</h3>
                                    {provided.placeholder}

                                    {/* Issues */}
                                    {issues?.filter((issue) => issue.status === column.key)
                                        .map((issue, index) => (
                                            <Draggable
                                                key={issue.id}
                                                draggableId={issue.id}
                                                index={index}
                                            >
                                                {(provided) => {
                                                    return (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >

                                                            <IssueCard issue={issue} />
                                                        </div>
                                                    )
                                                }}
                                            </Draggable>
                                        ))}

                                    {provided.placeholder}
                                    {column.key === "TODO" &&
                                        currentSprint.status !== "COMPLETED" && (
                                            <Button
                                                variant="ghost"
                                                className="w-full"
                                                onClick={() => handleAddIssue(column.key)}
                                            >
                                                {" "}
                                                <Plus className='mr-2 h-4 w-4' />
                                                Create Issue
                                            </Button>
                                        )
                                    }
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            <IssueCreationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sprintId={currentSprint.id}
                status={selectedStatus}
                projectId={projectId}
                onIssueCreated={handleIssueCreated}
                orgId={orgId}
            />

        </div>
    )
}

export default SprintBoard
