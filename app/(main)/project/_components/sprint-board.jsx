'use client'

import React, { useEffect, useState } from 'react'
import SprintManager from './sprint-manager'
import { Droppable, DragDropContext, Draggable } from '@hello-pangea/dnd'
import statuses from '@/data/status'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import IssueCreationDrawer from './create-issue'
import useFetch from '@/hooks/use-fetch'
import { getIssuesForSprint, updateIssueOrder } from '@/actions/issues'
import { BarLoader } from 'react-spinners'
import IssueCard from './issue-card'
import { toast } from 'sonner'
import BoardFilters from './board-filters'

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

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

    const handleFilterChange = (newFilteredIssues) => {
        setFilteredIssues(newFilteredIssues)
    }

    const handleIssueCreated = () => {
        fetchIssues(currentSprint.id)
    }

    const {
        fn: updateIssueOrderFn,
        loading: updateIssuesLoading,
        error: updateIssuesError,
    } = useFetch(updateIssueOrder);


    const onDragEnd = async (result) => {
        if (currentSprint.status === "PLANNED") {
            toast.warning("Start the sprint to update board");
            return;
        }
        if (currentSprint.status === "COMPLETED") {
            toast.warning("Cannot update board after sprint end");
            return;
        }

        const { destination, source } = result

        if (!destination) return
        if (destination.droppableId === source.droppableId && destination.index === source.index) return

        const newOrderData = [...issues]

        // source and destination lists
        const sourceList = newOrderData.filter(
            (list) => list.status === source.droppableId
        )

        const destinationList = newOrderData.filter(
            (list) => list.status === destination.droppableId
        )

        // if source and dest same
        if (source.droppableId === destination.droppableId) {
            const reorderCards = reorder(
                sourceList,
                source.index,
                destination.index
            )
            reorderCards.forEach((card, i) => {
                card.order = i
            })
        } else {
            const [movedCard] = sourceList.splice(source.index, 1)

            movedCard.status = destination.droppableId

            destinationList.splice(destination.index, 0, movedCard)

            sourceList.forEach((card, i) => {
                card.order = i
            })

            destinationList.forEach((card, i) => {
                card.order = i
            })
        }

        const sortedIssues = newOrderData.sort((a, b) => a.order - b.order)
        setIssues(newOrderData, sortedIssues)

        updateIssueOrderFn(sortedIssues)

    };

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

            {issues && !issuesLoading && (
                <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
            )}

            {updateIssuesError &&
                <p className='text-red-500 mt-2'>{updateIssuesError.message}</p>
            }

            {(updateIssuesLoading || issuesLoading) &&
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
                                                isDragDisabled={updateIssuesLoading}
                                            >
                                                {(provided) => {
                                                    return (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >

                                                            <IssueCard issue={issue}
                                                                onDelete={() => fetchIssues(currentSprint.id)}
                                                                onUpdate={(updated) => {
                                                                    setIssues((issues) =>
                                                                        issues.map((issue) =>
                                                                            issue.id === updated.id ? updated : issue
                                                                        )
                                                                    )
                                                                }} />
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
