"use client";

import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Link, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProject } from "@/lib/networks/project";
import { CreateProjectType } from "@/lib/types/project";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getAllAccounts } from "@/lib/networks/account";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["low", "medium", "high"]),
  Employees: z.array(z.number()),
});

interface CreateProjectModalProps {
  children: React.ReactNode;
}

export default function CreateProjectModal({
  children,
}: CreateProjectModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const queryClient = useQueryClient();

  const { data: accounts } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["account"],
  });

  const { mutateAsync: onCreateProject, isPending } = useMutation({
    mutationFn: (values: CreateProjectType) => createProject(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsDialogOpen(false);
      toast.success("Project successfully created!");
    },
    onError: () => {
      toast.error("Something went wrong creating the project data!");
    },
  });

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "low",
      Employees: [],
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    onCreateProject({
      ...values,
      Employees: values.Employees.map((id) => ({ id: id })),
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Add a New Project
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-12 pt-4 lg:gap-4"
            >
              <div className="flex-1 space-y-2 lg:space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="w-full" />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Date</FormLabel>
                        <FormControl className="flex-1">
                          <Popover open={openStart} onOpenChange={setOpenStart}>
                            <PopoverTrigger className="w-full" asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-56 justify-between font-normal"
                              >
                                {field.value
                                  ? field.value.toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setOpenStart(false);
                                }}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Popover open={openEnd} onOpenChange={setOpenEnd}>
                            <PopoverTrigger className="w-full" asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-56 justify-between font-normal"
                              >
                                {field.value
                                  ? field.value.toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setOpenEnd(false);
                                }}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage className="text-start" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses?.map((account) => (
                            <SelectItem
                              key={account.value}
                              value={account.value.toString()}
                            >
                              {account.label}
                            </SelectItem>
                          ))}
                          <Link
                            href="/accounts"
                            className="flex items-center gap-2 py-1.5 pr-8 pl-2 text-sm"
                          >
                            <p>Create New Product</p>
                            <Plus className="size-4" />
                          </Link>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Employees"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Employees</FormLabel>
                      <Controller
                        control={form.control}
                        name="Employees"
                        render={({ field }) => (
                          <MultiSelect
                            options={
                              accounts
                                ? accounts.map((account) => ({
                                    label: account.fullname,
                                    value: account.id.toString(),
                                  }))
                                : []
                            }
                            onValueChange={(values) =>
                              field.onChange(values.map(Number))
                            }
                            placeholder="Choose employees"
                            maxCount={3}
                          />
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                disabled={isPending}
                className="flex w-full items-center gap-3"
                type="submit"
              >
                {isPending ? (
                  <>
                    Submitting
                    <ClipLoader
                      color={"#fff"}
                      loading={isPending}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export const statuses = [
  {
    label: "Low",
    value: "low",
    bgColor: "bg-success-200 text-success-700 border-success-500",
    bg: "bg-success-500",
  },
  {
    label: "Medium",
    value: "medium",
    bgColor: "bg-warning-200 text-warning-700 border-warning-500",
    bg: "bg-warning-500",
  },
  {
    label: "High",
    value: "high",
    bgColor: "bg-error-200 text-error-700 border-error-500",
    bg: "bg-error-500",
  },
];
