interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="">
      <div className="flex  mx-auto max-w-fit gap-3 items-center border rounded-full py-2 px-6">
        <div className="size-10 grid place-items-center rounded-full bg-primary">
          <p className="text-xl font-bold text-secondary">LG</p>
        </div>

        <p className="font-semibold text-lg">PSYCHOLOGY</p>
      </div>
      <h1 className="text-3xl mt-6 font-medium text-primary lg:text-5xl text-center">
        {title}
      </h1>
      <p className="mt-2 text-sm  text-center max-w-sm mx-auto">{subtitle}</p>
    </div>
  );
}
