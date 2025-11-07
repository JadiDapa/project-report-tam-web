"use client";

import { Calendar, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@/providers/AccountProvider";
import { getAllPrograms } from "@/lib/networks/program";
import CreateProgramModal from "@/components/root/program/CreateProgramModal";
import { format } from "date-fns";
import Link from "next/link";

export const statuses = [
  {
    label: "Low",
    value: "low",
    bgColor: "bg-success-200 text-success-700 border-success-500",
    bg: "bg-success-500",
  },
  {
    label: "Medium",
    value: "medium",
    bgColor: "bg-warning-200 text-warning-700 border-warning-500",
    bg: "bg-warning-500",
  },
  {
    label: "High",
    value: "high",
    bgColor: "bg-error-200 text-error-700 border-error-500",
    bg: "bg-error-500",
  },
];

export default function ProgramsDashboard() {
  const { account } = useAccount();
  const { data: programs } = useQuery({
    queryFn: getAllPrograms,
    queryKey: ["programs"],
  });
  // const router = useRouter();

  const isProjectManager = account?.Role?.Features?.some(
    (feature) => feature.name === "Manage Project",
  );

  const programsFiltered = isProjectManager
    ? programs
    : programs?.filter((program) =>
        program.Accounts?.some((acc) => acc.accountId === account?.id),
      );

  // useEffect(() => {
  //   if (account && account.Role.name !== "Administrator") {
  //     router.replace("/my-programs");
  //   }
  // }, [account, router]);

  return (
    <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
      {/* Header Title */}
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div className="">
          <h1 className="text-4xl font-medium">Programs</h1>
          <p className="hidden lg:inline">
            These All Running Programs in Taruna Anugrah Mandiri
          </p>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          {/* <LayoutSwitch /> */}

          {isProjectManager && (
            <CreateProgramModal>
              <div className="bg-primary text-secondary grid size-10 place-items-center gap-4 rounded-md text-lg shadow-sm">
                <Plus size={24} />
              </div>
            </CreateProgramModal>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programsFiltered?.map((program) => (
            <Link
              href={`/programs/${program.id}`}
              key={program.title}
              className="border-primary flex justify-between gap-2 rounded-xl border-l-[12px] bg-white p-3 shadow-md lg:gap-4 lg:p-6"
            >
              <div className="flex w-full flex-col justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-2xl font-semibold">
                    {program.title}
                  </p>
                  <p>
                    <span
                      className={`text-primary text-5xl font-semibold max-sm:w-24`}
                    >
                      {program.Projects.length}{" "}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      {" "}
                      Projects available
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Calendar size={20} className="text-muted-foreground" />
                    <p className="text-muted-foreground text-xs font-medium">
                      Started:{" "}
                      <span className="text-primary">
                        {format(program.createdAt, "dd MMMM yyyy")}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`rounded-full px-4 text-xs font-semibold text-white lg:text-sm ${
                      program.status === "active"
                        ? "bg-green-500"
                        : program.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-rose-500"
                    }`}
                  >
                    <p className="capitalize">{program.status}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
