export default function DownloadLoadingModal({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-lg">
        <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-gray-300"></div>

        <p className="font-medium text-gray-700">
          Generating report, please wait...
        </p>
      </div>
    </div>
  );
}
