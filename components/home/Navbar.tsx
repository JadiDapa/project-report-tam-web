"use client";

import { useAccount } from "@/providers/AccountProvider";
import Image from "next/image";
import Link from "next/link";

const links = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Tickets",
    url: "/your-ticket",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];

export default function Navbar() {
  const { account } = useAccount();

  return (
    <header className="flex items-center justify-between from-blue-50 px-4 py-4 shadow-md lg:px-24">
      <div className="relative h-10 w-20 lg:h-14 lg:w-24">
        <Image
          src="/images/logo.png"
          alt="logo"
          fill
          className="object-contain object-center"
        />
      </div>

      <nav className="hidden items-center space-x-8 md:flex">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            className="font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            {link.name}
          </Link>
        ))}
        <a
          href="https://github.com/JadiDapa/project-report-tam/releases/download/v.1.0.0/taruna-anugerah-mandiri.apk"
          className="font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          Download App
        </a>
      </nav>

      {account ? (
        <Link
          href={"/dashboard"}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 lg:px-6 lg:text-base"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href={"/login"}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 lg:px-6 lg:text-base"
        >
          Sign In
        </Link>
      )}
    </header>
  );
}
