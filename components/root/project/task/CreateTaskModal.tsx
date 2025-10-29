"use client";

import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Link, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/lib/networks/task";
import { CreateTaskType } from "@/lib/types/task";
import { Textarea } from "@/components/ui/textarea";

const taskSchema = z.object({
  type: z.string().min(1, "Type Must Be Filled"),
  item: z.string().min(1, "Item Must Be Filled"),
  quantity: z.string().min(1, "Quantity Must Be Filled"),
  description: z.string().min(1, "Description Must Be Filled"),
  projectId: z.string().min(1, "Project ID Must Be Filled"),
});

export const projectType = [
  {
    label: "Installation",
    value: "installation",
  },
  {
    label: "Configuration",
    value: "configuration",
  },
  {
    label: "Maintanance",
    value: "maintanance",
  },
  {
    label: "Daily Report",
    value: "Daily Report",
  },
];

interface CreateTaskModalProps {
  children: React.ReactNode;
  projectId: number;
}

export default function CreateTaskModal({
  children,
  projectId,
}: CreateTaskModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: onCreateTask, isPending } = useMutation({
    mutationFn: (values: CreateTaskType) => createTask(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong creating the task data!");
    },
  });

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: "",
      item: "",
      quantity: "",
      description: "",
      projectId: projectId.toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      const payload: CreateTaskType = {
        type: values.type,
        item: values.item,
        description: values.description,
        projectId: Number(values.projectId),
        quantity: Number(values.quantity),
      };

      await onCreateTask(payload);

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["projects", values.projectId],
      });
      toast.success("Task successfully created!");
    } catch (err) {
      console.error("Task creation failed", err);
      toast.error("Something went wrong creating the task data!");
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Add a New Task
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-12 pt-4 lg:gap-4"
            >
              <div className="flex-1 space-y-2 lg:space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Task Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectType?.map((task) => (
                            <SelectItem
                              key={task.value}
                              value={task.value.toString()}
                            >
                              {task.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="item"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl className="relative">
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl className="relative">
                        <Input type="number" className="w-full" {...field} />
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
                      <FormLabel>Task Descripton</FormLabel>
                      <FormControl className="relative">
                        <Textarea className="w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                disabled={isPending}
                className="flex w-full items-center gap-3"
                type="submit"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
