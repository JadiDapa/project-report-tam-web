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
import { ClipLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProgram } from "@/lib/networks/program";
import { CreateProgramType } from "@/lib/types/program";

const programSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.string().min(1, "Status is required"),
});

interface CreateProgramModalProps {
  children: React.ReactNode;
}

export default function CreateProgramModal({
  children,
}: CreateProgramModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: onCreateProgram, isPending } = useMutation({
    mutationFn: (values: CreateProgramType) => createProgram(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setIsDialogOpen(false);
      toast.success("Program successfully created!");
    },
    onError: () => {
      toast.error("Something went wrong creating the program data!");
    },
  });

  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
    },
  });

  async function onSubmit(values: z.infer<typeof programSchema>) {
    onCreateProgram({
      ...values,
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Add a New Program
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
                            <SelectValue placeholder="Select Status" />
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
    label: "Active",
    value: "active",
    bgColor: "bg-success-200 text-success-700 border-success-500",
    bg: "bg-success-500",
  },
  {
    label: "Pending",
    value: "pending",
    bgColor: "bg-warning-200 text-warning-700 border-warning-500",
    bg: "bg-warning-500",
  },
  {
    label: "Completed",
    value: "completed",
    bgColor: "bg-muted-200 text-muted-700 border-muted-500",
    bg: "bg-muted-500",
  },
];
