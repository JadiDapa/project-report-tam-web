import { formatDistanceToNow, format, differenceInHours } from "date-fns";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const hoursDifference = differenceInHours(now, date);

  if (hoursDifference < 48) {
    return `${formatDistanceToNow(date)} ago`;
  } else {
    return format(date, "d MMMM yyyy");
  }
};
