import { Download, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 h-4 w-4 rounded-full bg-blue-500"></div>
      <div className="absolute right-40 bottom-40 h-6 w-6 rounded-full bg-blue-600"></div>

      <div className="container mx-auto px-4 py-14 lg:px-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Content */}
          <div className="space-y-8">
            {/* App name badge */}
            <div className="border-primary mx-auto flex max-w-fit items-center space-x-2 rounded-full border px-4 py-2 lg:mx-0">
              <div className="bg-primary h-2 w-2 rounded-full"></div>
              <span className="text-primary text-sm font-medium">
                TAM & INTEGRA
              </span>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-center text-5xl leading-tight font-bold text-gray-900 lg:text-start lg:text-6xl">
                One App.
                <br />
                Every Role.
                <br />
                Total Control.
              </h1>

              <p className="mx-auto max-w-xs text-center text-sm text-gray-600 lg:mx-0 lg:max-w-md lg:text-start lg:text-lg">
                Everything you need to manage your projects in one place. From
                team collaboration to detailed analytics, We make it easy for
                you!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 lg:justify-normal lg:gap-6">
              <a
                href="https://expo.dev/artifacts/eas/gcwfCj9wHHjdsjL1pNPuWE.apk"
                download
                className="bg-primary group border-primary hover:text-primary flex w-40 items-center justify-center gap-3 rounded-full border-2 py-2 text-white transition-all hover:bg-transparent lg:w-44"
              >
                <Download className="group-hover:text-primary size-4 text-white lg:size-5" />
                <span className="text-sm">Download App</span>
              </a>
              <Link
                href={"/login"}
                className="border-primary group hover:bg-primary flex w-40 items-center justify-center gap-3 rounded-full border-2 bg-transparent py-2 transition-all lg:w-44"
              >
                <Play className="text-primary size-4 group-hover:text-white lg:size-5" />
                <span className="text-primary text-sm group-hover:text-white">
                  Get Started
                </span>
              </Link>
            </div>
          </div>

          {/* Right side - Phone mockup */}
          <div className="relative">
            {/* Large blue circle background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-96 w-96 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div>
            </div>

            {/* Phone mockup */}
            <div className="relative z-10 mx-auto h-[520px] w-96">
              <Image
                src="/images/mockup.png"
                alt="Mockup"
                fill
                className="object-contain object-center"
              />
            </div>

            {/* Floating avatar */}
            <div className="bg-primary absolute bottom-20 -left-8 flex h-16 w-16 items-center justify-center rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
