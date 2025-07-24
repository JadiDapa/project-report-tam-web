import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useAccount } from "@/providers/AccountProvider";

type DeleteDialogProps = {
  label?: string;
  name: string;
  onDelete: () => Promise<boolean>;
  isLoading: boolean;
  setSuccessMessage?: string;
  setErrorMessage?: string;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  label = "Delete",
  name,
  onDelete,
  isLoading,
  setErrorMessage,
}) => {
  const { account } = useAccount();
  if (!account) {
    return null; // or handle loading state
  }

  const isAdmin = account.Role.name === "Administrator";

  const handleDelete = async () => {
    const success = await onDelete();
    // You can choose to handle notifications outside this component
    if (!success) {
      console.error(setErrorMessage || "Deletion failed");
    }
  };

  if (!isAdmin) {
    return null; // or handle loading state
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-primary">
        <Button
          variant="destructive"
          className="flex h-10 items-center gap-3 text-lg"
        >
          <span>{label}</span> <Trash className="text-white" />{" "}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Data: <span className="text-red-500">{name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete this and
            all related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? <>Submitting ...</> : "Submit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
