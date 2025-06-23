export interface CreateReportEvidenceType {
  image: string;
  description?: string;
}

export interface ReportEvidenceType extends CreateReportEvidenceType {
  location?: {
    coords: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  date?: string;
}
