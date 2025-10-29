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
import { Eye, EyeOff } from "lucide-react";
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

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+[\]{};:"|,.<>\/?]).{8,}$/;

const accountSchema = z
  .object({
    fullname: z.string().min(3, "Full Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    role: z.string(),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be at least 8 characters and include at least one letter, one number, and one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface CreateAccountModalProps {
  children: React.ReactNode;
}

export default function CreateAccountModal({
  children,
}: CreateAccountModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  // Get available roles
  const { data: roles } = useQuery({
    queryFn: () => getAllRoles(),
    queryKey: ["roles"],
  });

  // Create account mutation for your backend
  const { mutateAsync: onCreateAccount, isPending } = useMutation({
    mutationFn: (values: CreateAccountType) => createAccount(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong creating the account!");
    },
  });

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  // ✅ Handles creation on Clerk + Database
  async function onSubmit(values: z.infer<typeof accountSchema>) {
    try {
      const res = await onCreateAccount({
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        roleId: Number(values.role),
      });

      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Account created successfully!");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    } catch (error: any) {
      console.error("Account creation failed", error);
      toast.error(
        error?.errors?.[0]?.message ||
          "Something went wrong creating the account!",
      );
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Add a New Account
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 pt-4"
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        {showPassword ? (
                          <Eye
                            strokeWidth={1.4}
                            className="absolute top-2 right-2 size-5 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <EyeOff
                            strokeWidth={1.4}
                            className="absolute top-2 right-2 size-5 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
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
                          {...field}
                        />
                        {showPassword ? (
                          <Eye
                            strokeWidth={1.4}
                            className="absolute top-2 right-2 size-5 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <EyeOff
                            strokeWidth={1.4}
                            className="absolute top-2 right-2 size-5 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
