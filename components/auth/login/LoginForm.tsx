"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { useSignIn } from "@clerk/nextjs";

const registerSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { signIn, setActive, isLoaded } = useSignIn();

  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const { email, password } = values;
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        toast.success("Login Successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid Email or Password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid Email or Password!");
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <User
                      size={24}
                      className="text-primary absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <Input
                      className="border-primary h-10 w-full rounded-lg border-2 ps-12 lg:h-12"
                      placeholder="Email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock
                      size={24}
                      className="text-primary absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <div
                      onClick={() => setIsVisible(!isVisible)}
                      className="absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {isVisible ? <Eye size={24} /> : <EyeClosed size={24} />}
                    </div>
                    <Input
                      className="border-primary h-10 w-full rounded-lg border-2 ps-12 lg:h-12"
                      placeholder="Password"
                      type={isVisible ? "text" : "password"}
                      {...field}
                    />
                  </div>
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
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
