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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount } from "@/lib/networks/account";
import { AccountType, CreateAccountType } from "@/lib/types/account";
import { getAllFeatures } from "@/lib/networks/feature";

const accountSchema = z.object({
  fullname: z.string().min(3, "Full Name must be at least 3 characters"),
  email: z.string().min(10, "Description must be at least 10 characters"),
  roleId: z.string(),
});

interface UpdateAccountModalProps {
  children: React.ReactNode;
  account: AccountType;
}

export default function UpdateAccountModal({
  children,
  account,
}: UpdateAccountModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: features } = useQuery({
    queryFn: () => getAllFeatures(),
    queryKey: ["features"],
  });

  const { mutateAsync: onUpdateAccount, isPending } = useMutation({
    mutationFn: (values: CreateAccountType) => createAccount(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong creating the account data!");
    },
  });

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    values: {
      fullname: account.fullname,
      email: account.email,
      roleId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    onUpdateAccount({ ...values, roleId: Number(values.roleId) });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Add a New Account
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-12 pt-4 lg:gap-4"
            >
              <div className="flex-1 space-y-2 lg:space-y-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl className="relative">
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
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
                          {features?.map((account) => (
                            <SelectItem
                              key={account.id}
                              value={account.id.toString()}
                            >
                              {account.name}
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
                      size={150}
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
