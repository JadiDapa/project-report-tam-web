import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

interface ExcelExportProps {
  data: any[];
  filename: string;
}

export default function ExcelExport({ data, filename }: ExcelExportProps) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, filename);
  };

  return (
    <Button
      onClick={exportToExcel}
      className="bg-tertiary hover:text-tertiary border-primary text-primary h-10 items-center gap-4 border"
    >
      <p className="text-lg">Export</p>
      <Download />
    </Button>
  );
}
