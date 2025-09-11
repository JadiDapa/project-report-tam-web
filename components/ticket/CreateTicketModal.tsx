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
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTicketType } from "@/lib/types/ticket";
import { createTicket } from "@/lib/networks/ticket";
import { useAccount } from "@/providers/AccountProvider";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

const ticketSchema = z.object({
  title: z.string().min(1, "Ticket Name is required"),
  priority: z.enum(["low", "normal", "high"]),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .refine(
      (file) => file instanceof File || file === null || file === undefined,
      "Invalid file",
    )
    .optional(),
});

const priorities = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "normal",
  },
  {
    label: "High",
    value: "high",
  },
];

interface CreateTicketModalProps {
  children: React.ReactNode;
}

export default function CreateTicketModal({
  children,
}: CreateTicketModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { account } = useAccount();

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      image: null,
    },
  });

  const { mutate: onCreateTicket, isPending } = useMutation({
    mutationFn: (values: CreateTicketType) => createTicket(values),
    onSuccess: (ticket) => {
      toast.success("Ticket successfully created!");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      router.push(`/your-ticket/${ticket.id}`);
    },

    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong!");
    },
  });

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    onCreateTicket({
      ...values,
      requester: account!.id,
    });
    setIsDialogOpen(false);
    setPreview(null);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Add a New Ticket
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-12 pt-4 lg:gap-4"
            >
              <div className="flex-1 space-y-2 lg:space-y-4">
                {/* Title */}
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

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities?.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                {/* Image Upload with Preview */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            field.onChange(file);
                            if (file) {
                              setPreview(URL.createObjectURL(file));
                            } else {
                              setPreview(null);
                            }
                          }}
                        />
                      </FormControl>
                      {preview && (
                        <div className="relative mt-2 h-40 w-60 rounded-md border">
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      )}
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
