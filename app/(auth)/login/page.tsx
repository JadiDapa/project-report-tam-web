"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import LoginForm from "@/components/auth/login/LoginForm";
import AuthHeader from "@/components/auth/AuthHeader";
import Image from "next/image";

export default function LoginPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/programs"); // or your desired protected route
    }
  }, [isLoaded, user, router]);

  return (
    <section className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div className="absolute z-0 h-full w-full">
        <Image src="/images/login-bg.png" alt="Login Background" fill />
      </div>
      <div className=""></div>
      <main className="relative z-10 m-6 flex flex-col items-center justify-center rounded-2xl bg-white/90 p-8 lg:px-40">
        <AuthHeader
          title="Welcome Back!"
          subtitle="Before we continue further, We need you to login using your existing account!"
        />
        <LoginForm />
        <p className="mt-4 text-center lg:mt-6">
          Don&apos;t have an account?{" "}
          <Link className="text-primary underline" href="/register">
            Create Now!
          </Link>
        </p>
      </main>
    </section>
  );
}
