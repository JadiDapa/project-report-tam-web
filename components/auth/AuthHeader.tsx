import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="">
      <div className="relative mx-auto h-16 w-40">
        <Image
          src="/images/logo.png"
          alt="Login Background"
          fill
          className={"object-contain object-center"}
        />
      </div>
      <h1 className="text-primary mt-6 text-center text-3xl font-medium lg:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm">{subtitle}</p>
    </div>
  );
}
