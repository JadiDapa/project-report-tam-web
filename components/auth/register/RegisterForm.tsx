"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye, EyeClosed, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/lib/networks/account";
import { CreateAccountType } from "@/lib/types/account";

// ✅ Validation schemas
const signupSchema = z
  .object({
    fullname: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signupData, setSignupData] = useState<z.infer<
    typeof signupSchema
  > | null>(null);

  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const { mutateAsync: createUserAsync } = useMutation({
    mutationFn: (values: CreateAccountType) => createAccount(values),
    onError: () => toast.error("Something Went Wrong!"),
  });

  // Forms
  const form = useForm({
    resolver: zodResolver(pendingVerification ? verifySchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  // ✅ Step 1: Handle Signup
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setSignupData(values);
      setPendingVerification(true);
      form.setValue("code", "");

      toast.info("Verification code sent to your email.");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Sign-up failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerify(values: z.infer<typeof verifySchema>) {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: values.code!,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });

        await createUserAsync({
          email: signupData!.email,
          fullname: signupData!.fullname,
          roleId: 11, // or your default role
        });

        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.errors?.[0]?.message || "Invalid code.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(
    values: z.infer<typeof signupSchema> | z.infer<typeof verifySchema>,
  ) {
    if (pendingVerification) {
      await onVerify(values as z.infer<typeof verifySchema>);
    } else {
      await onSubmit(values as z.infer<typeof signupSchema>);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="mt-4 w-full lg:mt-6"
        autoComplete="off"
      >
        <div className="space-y-4">
          {!pendingVerification ? (
            <>
              {/* Email */}
              <FormField
                control={form.control}
                name="fullname"
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
                          placeholder="Full Name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail
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

              {/* Password */}
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
                          {isVisible ? (
                            <Eye size={24} />
                          ) : (
                            <EyeClosed size={24} />
                          )}
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

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
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
                          {isVisible ? (
                            <Eye size={24} />
                          ) : (
                            <EyeClosed size={24} />
                          )}
                        </div>
                        <Input
                          className="border-primary h-10 w-full rounded-lg border-2 ps-12 lg:h-12"
                          placeholder="Confirm Password"
                          type={isVisible ? "text" : "password"}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div id="clerk-captcha"></div>

        {/* Submit */}
        <Button
          disabled={isLoading}
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              Submitting
              <LoaderCircle className="h-6 w-6 animate-spin text-gray-500" />
            </>
          ) : pendingVerification ? (
            "Verify Code"
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
