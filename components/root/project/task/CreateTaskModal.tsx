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
import { Eye, EyeOff, Link, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount } from "@/lib/networks/account";
import { CreateAccountType } from "@/lib/types/account";
import { getAllRoles } from "@/lib/networks/role";

const taskSchema = z.object({
  type: z.string().min(1, "Type Must Be Filled"),
  item: z.string().min(1, "Item Must Be Filled"),
  quantity: z.string().min(1, "Quantity Must Be Filled"),
  description: z.string().min(1, "Description Must Be Filled"),
  projectId: z.string().min(1, "Project ID Must Be Filled"),
});
interface CreateTaskModalProps {
  children: React.ReactNode;
}

export default function CreateTaskModal({ children }: CreateTaskModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { data: roles } = useQuery({
    queryFn: () => getAllRoles(),
    queryKey: ["roles"],
  });

  const { mutateAsync: onCreateAccount, isPending } = useMutation({
    mutationFn: (values: CreateAccountType) => createAccount(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong creating the account data!");
    },
  });

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      await onCreateAccount({
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        roleId: Number(values.role),
      });

      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account successfully created!");
    } catch (err) {
      console.error("Account creation failed", err);
      toast.error("Something went wrong creating the account data!");
    }
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
                  name="role"
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
                          {roles?.map((account) => (
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl className="relative">
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="w-full"
                            {...field}
                          />
                          {showPassword ? (
                            <Eye
                              strokeWidth={1.4}
                              className="absolute top-2 right-2 size-5"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <EyeOff
                              strokeWidth={1.4}
                              className="absolute top-2 right-2 size-5"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="w-full"
                            {...field}
                          />
                          {showPassword ? (
                            <Eye
                              strokeWidth={1.4}
                              className="absolute top-2 right-2 size-5"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <EyeOff
                              strokeWidth={1.4}
                              className="absolute top-2 right-2 size-5"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </div>
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
