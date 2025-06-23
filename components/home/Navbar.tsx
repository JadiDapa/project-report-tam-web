import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white px-24 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-primary text-xl font-semibold">TAM / INTEGRA</p>
      </div>

      <nav className="hidden items-center space-x-8 md:flex">
        <Link
          href="#"
          className="font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          Home
        </Link>
        <Link
          href="#"
          className="font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          Contact
        </Link>
        <Link
          href="#"
          className="font-medium text-blue-500 transition-colors hover:text-blue-600"
        >
          Download App
        </Link>
      </nav>

      <Button className="rounded-full bg-gray-900 px-6 py-2 text-white hover:bg-gray-800">
        Sign In
      </Button>
    </header>
  );
}
