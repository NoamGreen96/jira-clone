"use client"

import { sprintSchema } from "@/app/lib/validators"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import useFetch from "@/hooks/use-fetch"
import { createSprint } from "@/actions/sprints"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const SprintCreationForm = ({ projectTitle, projectId, ProjectKey, sprintKey }) => {
  const { loading: createSprintLoading, fn: createSprintFn } = useFetch(createSprint)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  })

  const { register, handleSubmit, formState: { errors }, control, } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${ProjectKey}=${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  })

  const onSubmit = async (data) => {
    const { from: startDate, to: endDate } = dateRange;

    if (!startDate || !endDate) {
      toast.error("Please select a valid date range");
      return;
    }

    await createSprintFn(projectId, {
      ...data,
      startDate,
      endDate,
    });

    toast.success("Sprint created successfully");
    setShowForm(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bolt mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "destructive" : "default"}
        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>

      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form className="flex gap-4 items-end" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex-1">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  readOnly
                  className="bg-sky-950"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start font-normal bg-slate-950 ${!dateRange && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from && dateRange.to ? (
                        `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-slate-900" align="start">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange(range);
                        }
                      }}
                      classNames={{
                        chevron: "fill-blue-500",
                        range_start: "bg-blue-700",
                        range_end: "bg-blue-700",
                        range_middle: "bg-blue-400",
                        day_button: "border-none",
                        today: "border-2 border-blue-700",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" disabled={createSprintLoading} >
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default SprintCreationForm
