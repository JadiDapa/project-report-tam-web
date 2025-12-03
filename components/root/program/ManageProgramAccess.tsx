"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { updateProgram } from "@/lib/networks/program";
import { getAllAccounts } from "@/lib/networks/account";
import { MultiSelect } from "@/components/ui/multi-select";
import { CreateProgramType, ProgramType } from "@/lib/types/program";

interface ManageProgramAccessProps {
  children: React.ReactNode;
  program: ProgramType;
}

export default function ManageProgramAccess({
  children,
  program,
}: ManageProgramAccessProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: accounts } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["account"],
  });

  const oldAccounts = useMemo(
    () =>
      program.Accounts?.map((account) => account.accountId.toString()) || [],
    [program.Accounts],
  );

  const [selectedAccounts, setSelectedAccounts] =
    useState<string[]>(oldAccounts);

  const { mutateAsync: onUpdateProgram, isPending } = useMutation({
    mutationFn: (values: CreateProgramType) =>
      updateProgram(program.id.toString(), values),
    onSuccess: () => {
      toast.success("Program successfully updated!");
      queryClient.invalidateQueries({ queryKey: ["programs", program.id] });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong updating the program data!");
    },
  });

  console.log(oldAccounts);

  // ✅ Load old values when dialog opens
  useEffect(() => {
    if (isDialogOpen && program) {
      setSelectedAccounts(oldAccounts);
    }
  }, [oldAccounts, isDialogOpen, program]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onUpdateProgram({
      Accounts: selectedAccounts.map((id) => ({ id })),
    });
  }

  console.log(selectedAccounts);

  if (program.Accounts)
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium">
              Manage Access
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Accounts</label>
              <MultiSelect
                key={isDialogOpen ? "open" : "closed"}
                value={selectedAccounts}
                options={
                  accounts
                    ? accounts.map((account) => ({
                        label: account.fullname,
                        value: account.id.toString(),
                      }))
                    : []
                }
                onValueChange={(values) => setSelectedAccounts(values)}
                placeholder="Choose employees"  
                maxCount={3}
              />
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  Submitting
                  <ClipLoader color="#fff" loading={isPending} size={20} />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
}
