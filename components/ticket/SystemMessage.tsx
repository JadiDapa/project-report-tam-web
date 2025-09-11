export function SystemMessage({
  content,
  type,
}: {
  content: string;
  type: string;
}) {
  const textColor =
    type === "assign-handler" ? "text-primary" : "text-slate-400";
  return (
    <p
      className={`font-cereal-medium py-4 text-center capitalize ${textColor}`}
    >
      --- {content} ---
    </p>
  );
}
