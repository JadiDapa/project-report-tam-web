import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { formatDate } from "@/lib/format-date";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllNotifications } from "@/lib/networks/notification";

export default function Notifications() {
  const { data: notifications } = useQuery({
    queryFn: getAllNotifications,
    queryKey: ["notifications"],
  });

  if (!notifications) return null;

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Bell strokeWidth={1.8} size={24} className="text-secondary" />
        {notifications.length > 0 && (
          <div className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-red-500">
            <p className="text-xs text-white">{notifications?.length}</p>
          </div>
        )}
      </PopoverTrigger>
      {notifications && (
        <PopoverContent align="end" className="bg-tertiary w-96 bg-white p-0">
          <div className="relative flex items-center justify-between border-b px-6 py-4">
            <p className="">Notifications</p>
            <div className="bg-primary/70 rounded-md px-3 py-0.5 text-sm text-white">
              <p>{notifications.length} New</p>
            </div>
          </div>
          <div className="">
            {notifications.map((notif) => (
              <Link
                href={`/requests/${notif.id}`}
                key={notif.id}
                className="flex cursor-pointer items-center gap-6 border-b p-4 transition hover:bg-slate-100"
              >
                <div className="bg-primary grid size-10 place-items-center rounded-full">
                  <p className="text-xl text-white">{"DA"}</p>
                </div>
                <div className="flex-1">
                  <p className="text-primary text-sm font-medium">
                    {notif.title}
                  </p>
                  <p className="mt-1 text-xs font-light">{notif.description}</p>
                  <p className="mt-1 text-xs font-light text-slate-400">
                    {formatDate(new Date(notif.createdAt) as unknown as string)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
