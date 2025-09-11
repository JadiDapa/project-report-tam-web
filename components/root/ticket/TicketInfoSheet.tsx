import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar,
  Clock,
  User,
  UserCheck,
  AlertCircle,
  Ticket,
  Flag,
  Edit3,
  UserPlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketType } from "@/lib/types/ticket";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/lib/networks/account";
import { useAccount } from "@/providers/AccountProvider";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "processed", label: "Processed" },
  { value: "completed", label: "Completed" },
];

// Form schemas
const statusFormSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

const handlerFormSchema = z.object({
  handlerId: z.string().min(1, "Handler is required"),
});

type StatusFormValues = z.infer<typeof statusFormSchema>;
type HandlerFormValues = z.infer<typeof handlerFormSchema>;

interface UpdateStatusFormProps {
  ticket: TicketType;
  onUpdate: (status: string) => Promise<void>;
}

function UpdateStatusForm({ ticket, onUpdate }: UpdateStatusFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status: ticket.status?.toLowerCase().replace(" ", "-") || "",
    },
  });

  const onSubmit = async (values: StatusFormValues) => {
    setIsLoading(true);
    try {
      await onUpdate(values.status);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <Edit3 className="mr-1 h-3 w-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Ticket Status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem
                          className=""
                          key={option.value}
                          value={option.value}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                getStatusColor(option.value)
                                  .split(" ")[0]
                                  .replace("bg-", "bg-"),
                              )}
                            />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Status
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface UpdateHandlerFormProps {
  ticket: TicketType;
  onUpdate: (handlerId: number) => Promise<void>;
}

function UpdateHandlerForm({ ticket, onUpdate }: UpdateHandlerFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAllAccounts(),
  });

  const form = useForm<HandlerFormValues>({
    resolver: zodResolver(handlerFormSchema),
    defaultValues: {
      handlerId: ticket.handler?.toString() || "",
    },
  });

  const onSubmit = async (values: HandlerFormValues) => {
    setIsLoading(true);
    try {
      await onUpdate(parseInt(values.handlerId));
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to update handler:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <UserPlus className="mr-1 h-3 w-3" />
          {ticket.Handler ? "Change" : "Assign"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {ticket.Handler ? "Change Handler" : "Assign Handler"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="handlerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handler</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a handler" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.map((handler) => (
                        <SelectItem
                          className=""
                          key={handler.id}
                          value={handler.id.toString()}
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={handler.image} />
                              <AvatarFallback className="text-xs">
                                {getInitials(handler.fullname)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{handler.fullname}</p>
                              <p className="text-muted-foreground text-xs">
                                {handler.email}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {ticket.Handler ? "Change Handler" : "Assign Handler"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface TicketInfoSheetProps {
  children: React.ReactNode;
  ticket: TicketType;
  onTicketUpdate?: (status: string, handlerId: number) => Promise<void>;
}

export default function TicketInfoSheet({
  children,
  ticket,
  onTicketUpdate,
}: TicketInfoSheetProps) {
  const handleUpdate = async (updates: {
    status?: string;
    handlerId?: number;
  }) => {
    if (!onTicketUpdate) return;

    const status = updates.status ?? ticket.status ?? "";
    const handlerId = updates.handlerId ?? ticket.handler ?? 0;

    await onTicketUpdate(status, handlerId);
  };

  const handleStatusUpdate = (status: string) => handleUpdate({ status });
  const handleHandlerUpdate = (handlerId: number) =>
    handleUpdate({ handlerId });

  const { account } = useAccount();

  const isTicketManager = account?.Role?.Features?.some(
    (feature) => feature.name === "Manage Ticket",
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-2xl overflow-hidden sm:max-w-2xl">
        <ScrollArea className="h-full px-12 py-6">
          <SheetHeader className="space-y-4 px-0 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ticket className="text-muted-foreground h-5 w-5" />
                <SheetTitle className="text-xl font-semibold">
                  {ticket.code}
                </SheetTitle>
                {ticket.priority && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium capitalize",
                      getPriorityColor(ticket.priority),
                    )}
                  >
                    <Flag className="mr-1 h-3 w-3" />
                    {ticket.priority}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {ticket.status && (
                  <div className="flex items-center space-x-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium capitalize",
                        getStatusColor(ticket.status),
                      )}
                    >
                      {ticket.status}
                    </Badge>
                    {isTicketManager && (
                      <UpdateStatusForm
                        ticket={ticket}
                        onUpdate={handleStatusUpdate}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-primary text-2xl leading-tight font-bold">
                {ticket.title}
              </h2>
              {ticket.description && (
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {ticket.description}
                </p>
              )}
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* People Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <User className="mr-2 h-4 w-4 text-blue-600" />
                    Requester
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          ticket.Requester.image ||
                          "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                        }
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(ticket.Requester.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate font-medium">
                        {ticket.Requester.fullname}
                      </p>
                      <p className="text-muted-foreground truncate text-sm">
                        {ticket.Requester.email}
                      </p>
                      {/* {ticket.Requester.role && (
                        <p className="text-muted-foreground text-xs">
                          {ticket.Requester.role}
                        </p>
                      )} */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  "border-l-4",
                  ticket.Handler ? "border-l-green-500" : "border-l-gray-300",
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <UserCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        ticket.Handler ? "text-green-600" : "text-gray-400",
                      )}
                    />
                    Handler
                  </CardTitle>
                  {isTicketManager && (
                    <UpdateHandlerForm
                      ticket={ticket}
                      onUpdate={handleHandlerUpdate}
                    />
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  {ticket.Handler ? (
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            ticket.Handler.image ||
                            "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                          }
                        />
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {getInitials(ticket.Handler.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate font-medium">
                          {ticket.Handler.fullname}
                        </p>
                        <p className="text-muted-foreground truncate text-sm">
                          {ticket.Handler.email}
                        </p>
                        {/* {ticket.Handler.role && (
                          <p className="text-muted-foreground text-xs">
                            {ticket.Handler.role}
                          </p>
                        )} */}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground text-sm">
                          No handler assigned
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Timestamps Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm font-medium">
                  <Clock className="mr-2 h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(ticket.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "in progress":
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "closed":
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
