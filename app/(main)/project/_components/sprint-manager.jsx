import { upadteSprintStatus } from '@/actions/sprints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useFetch from '@/hooks/use-fetch'
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'

const SprintManager = ({ sprint, sprints, setSprint, projectId }) => {
    const [status, setStatus] = useState(sprint.status)


    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    const now = new Date()

    const canStart = isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED"
    const canEnd = status === "ACTIVE"

    const { fn: updateStatus, loading, data: updatedStatus, } = useFetch(upadteSprintStatus)

    const handleStatusChange = async (newStatus) => {
        updateStatus(sprint.id, newStatus)
    }

    useEffect(() => {
        if (updatedStatus && updatedStatus.success) {
            setStatus(updatedStatus.sprint.status)
            setSprint({
                ...sprint,
                status: updatedStatus.sprint.status
            })
        }
    }, [updatedStatus, loading])

    const handleSprintChange = (value) => {
        const selectedSprint = sprints.find((s) => s.id === value);
        setSprint(selectedSprint)
        setStatus(selectedSprint.status)
    }

    const getStatusText = () => {
        if (status === 'COMPLETED') return 'Sprint Ended';
        if (status === 'ACTIVE' && isAfter(now, endDate))
            return `Overdue by ${formatDistanceToNow(endDate)}`;
        if (status === 'PLANNED' && isBefore(now, startDate))
            return `Starts in ${formatDistanceToNow(startDate)}`;
        return null;
    };

    const statusText = getStatusText();

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center gap-4 w-full">
                <Select value={sprint.id} onValueChange={handleSprintChange}>
                    <SelectTrigger className="bg-slate-950 self-start w-full">
                        <SelectValue placeholder="Select Sprint" />
                    </SelectTrigger>
                    <SelectContent>
                        {sprints.map((sprint) => (
                            <SelectItem key={sprint.id} value={sprint.id}>
                                {sprint.name} ({format(sprint.startDate, 'MMM d, yyyy')}) to{' '}
                                {format(sprint.endDate, 'MMM d, yyyy')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {canStart && (
                    <Button
                        className="bg-green-900 text-white"
                        onClick={() => handleStatusChange("ACTIVE")}
                        disabled={loading}
                    >Start Sprint</Button>
                )}
                {canEnd &&
                    <Button
                        variant="destructive"
                        onClick={() => handleStatusChange("COMPLETED")}
                        disabled={loading}
                    >End Sprint</Button>}
            </div>
            {loading && <BarLoader width={"100%"} className='mt-2' color='#36d7b7' />}
            {statusText && (
                <Badge variant="secondary" className="text-sm">
                    ⏱ {statusText}
                </Badge>
            )}
        </div>
    );
};

export default SprintManager