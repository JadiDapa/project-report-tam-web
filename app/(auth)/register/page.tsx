"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import Image from "next/image";
import RegisterForm from "@/components/auth/register/RegisterForm";

export default function RegisterPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/programs"); // or your desired protected route
    }
  }, [isLoaded, user, router]);

  return (
    <section className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <main className="relative z-10 m-6 flex flex-col items-center justify-center rounded-2xl bg-white/90 p-8 lg:px-40">
        <AuthHeader
          title="Welcome Back!"
          subtitle="Before we continue further, We need you to login using your existing account!"
        />
        <RegisterForm />
        <p className="mt-4 text-center lg:mt-6">
          Already have an account?{" "}
          <Link className="text-primary underline" href="/login">
            Login Now!
          </Link>
        </p>
      </main>
      <div className=""></div>

      <div className="absolute z-0 h-full w-full">
        <Image src="/images/login-bg.png" alt="Login Background" fill />
      </div>
    </section>
  );
}
