"use client"

import UserAvatar from './user-avatar';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import IssueDetailsDialog from './issue-detail-dialog';


const priorityColor = {
  LOW: "bg-green-600",
  MEDIUM: "bg-yellow-300",
  HIGH: "bg-orange-400",
  URGENT: "bg-red-400",
};

const priorityBorder = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

const IssueCard = ({ issue, showStatus = false, onDelete = () => { }, onUpdate = () => { } }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter()

  const onDeleteHandler = (...params) => {
    router.refresh()
    onDelete(...params)
  }

  const onUpdateHandler = (...params) => {
    router.refresh()
    onUpdate(...params)
  }

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true
  });

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow bg-slate-950 rounded-lg border border-slate-800 p-0 "
        onClick={() => setIsDialogOpen(true)}
      >
        <div className={`h-1 w-full ${priorityColor[issue.priority]} rounded-lg`} />

        <CardHeader className="px-4 ">
          <CardTitle className="capitalize text-white text-lg font-semibold tracking-tight">
            {issue.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex items-center gap-2 px-4">
          {showStatus && (
            <Badge variant="secondary" className="rounded-full">
              {issue.status}
            </Badge>
          )}
          <Badge variant="secondary" className="rounded-full text-xs capitalize -mt-6 ">
            {issue.priority}
          </Badge>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-2 px-4 pb-4 ">
          <UserAvatar user={issue.assignee} />
          <div className="text-xs text-gray-400">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityBorder[issue.priority]}

        />)}
    </>
  );
};

export default IssueCard;