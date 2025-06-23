"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const { username, email, password } = values;
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        username,
        email,
        password,
        redirect: false,
      });
      if (response?.error) {
        toast.error("Invalid Email or Password!");
      } else {
        toast.success("Login Successful!");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("TSomething Went Wrong!");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 w-full lg:mt-6"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="relative">
                <User
                  size={24}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                />
                <FormControl>
                  <Input
                    className="h-10 w-full border-2 border-primary ps-12 lg:h-12"
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <Mail
                  size={24}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                />
                <FormControl>
                  <Input
                    className="h-10 w-full border-2 border-primary ps-12 lg:h-12"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <Lock
                  size={24}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                />
                <div
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute right-3 top-1 text-slate-800"
                >
                  {isVisible ? <Eye size={24} /> : <EyeClosed size={24} />}
                </div>
                <FormControl>
                  <Input
                    className="h-10 w-full border-2 border-primary ps-12 lg:h-12"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isLoading}
          className="mt-6 flex h-10 w-full items-center gap-3 text-lg lg:mt-10 lg:h-12"
        >
          {isLoading ? (
            <>
              Submitting
              <ClipLoader size={32} color="#fff" />
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
}
