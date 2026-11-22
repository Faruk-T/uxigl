import type React from 'react';

export type ReportCategory = 'finance' | 'analytics' | 'security' | 'compliance';

export type ReportFormat = 'PDF' | 'XLSX' | 'CSV' | 'JSON';

export type ReportStatus = 'ready' | 'signed' | 'scheduled';

export interface ReportSummaryRow {
  label: string;
  value: string;
  delta?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  description?: string;
  category: ReportCategory;
  period: string;
  formats: ReportFormat[];
  size: string;
  status: ReportStatus;
  generatedAt: string;
  author: string;
  summaryRows?: ReportSummaryRow[];
}

export interface ReportsProps {
  /** Controlled reports list. */
  reports?: ReportItem[];
  /** Controlled reports updater. */
  onReportsChange?: (next: ReportItem[]) => void;
  /** Initial reports when uncontrolled. */
  initialReports?: ReportItem[];
  /** Display locale (`'tr' | 'en'`, default `'tr'`). */
  locale?: 'tr' | 'en';
  /** Optional localStorage key for uncontrolled persistence. */
  storageKey?: string;
  /** Callback when a report download is triggered. */
  onDownload?: (report: ReportItem, format: ReportFormat) => void;
  /** Callback when a new custom report is generated. */
  onGenerateReport?: (report: ReportItem) => void;
  className?: string;
  style?: React.CSSProperties;
}
