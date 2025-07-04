import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]

const BoardFilters = ({ issues, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAssignees, setSelectedAssignees] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState("");

    const assignees = issues
        .map((issue) => issue.assignee).filter(
            (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );

    const isFilterApplied = searchTerm !== "" || selectedAssignees.length > 0 || selectedPriority !== ""
    const clearFilters = () => {
        setSearchTerm("")
        setSelectedAssignees([])
        setSelectedPriority("")
    }

    useEffect(() => {
        const filteredIssues = issues.filter((issue) =>
            issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedAssignees.length === 0 || selectedAssignees.includes(issue.assignee?.id)) &&
            (selectedPriority === "" || issue.priority === selectedPriority)
        )
        onFilterChange(filteredIssues)
    }, [searchTerm, selectedAssignees, selectedPriority, issues])

    const toggleAssignee = (assigneeId) => {
        setSelectedAssignees((prev) =>
            prev.includes(assigneeId)
                ? prev.filter((id) => id !== assigneeId)
                : [...prev, assigneeId]
        );
    };

    return (
        <div>
            <div className='flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6'>
                <Input
                    className="w-full sm:w-72"
                    placeholder="Search Issues ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-full sm:w-52">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                                {priority}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className='flex-shrink-0'>
                    <div className='flex gap-2 flex-wrap'>
                        {assignees.map((assignee, i) => {
                            const selected = selectedAssignees.includes(assignee.id)
                            return (
                                <div key={assignee.id}
                                    className={`rounded-full ring ${selected ? "ring-blue-600" : "ring-black"} ${i > 0 ? "-ml-6" : ""}`}
                                    style={{
                                        zIndex: i,

                                    }}
                                    onClick={() => toggleAssignee(assignee.id)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={assignee.imageUrl} />
                                        <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                            )
                        })}
                        {isFilterApplied && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="flex items-center"
                            >
                                <X className="h-4 w-4" /> Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoardFilters