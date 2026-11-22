import React from 'react';
import { Download } from 'lucide-react';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { Modal } from '../Modal/Modal';
import { REPORT_CATEGORY_META, REPORT_STATUS_META } from './reportsUtils';
import type { ReportFormat, ReportItem } from './types';

export interface ReportPreviewModalProps {
  report: ReportItem | null;
  locale: 'tr' | 'en';
  onClose: () => void;
  onDownload: (report: ReportItem, format: ReportFormat) => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  report,
  locale,
  onClose,
  onDownload,
}) => {
  const isTR = locale === 'tr';
  if (!report) return null;

  const catMeta = REPORT_CATEGORY_META[report.category];
  const statusMeta = REPORT_STATUS_META[report.status];

  return (
    <Modal open={Boolean(report)} onClose={onClose} title={report.title} size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={catMeta.tone} variant="tonal" size="xs">
            {isTR ? catMeta.labelTr : catMeta.labelEn}
          </Badge>
          <Badge tone={statusMeta.tone} size="xs">
            {isTR ? statusMeta.labelTr : statusMeta.labelEn}
          </Badge>
          <span style={{ fontSize: '0.76rem', color: 'var(--uxu-text-secondary)' }}>
            {report.period} • {report.author} • {report.generatedAt}
          </span>
        </div>

        {report.description && (
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--uxu-text-secondary)', lineHeight: 1.5 }}>
            {report.description}
          </p>
        )}

        {report.summaryRows && report.summaryRows.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 10,
            }}
          >
            {report.summaryRows.map((row) => (
              <div
                key={row.label}
                style={{
                  padding: 12,
                  borderRadius: 'var(--uxu-radius-md)',
                  background: 'var(--uxu-surface-tonal)',
                  border: '1px solid var(--uxu-border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                  {row.label}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 2 }}>
                  {row.value}
                </div>
                {row.delta && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--uxu-primary)', marginTop: 2 }}>
                    {row.delta}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            paddingTop: 10,
            borderTop: '1px solid var(--uxu-border-subtle)',
            flexWrap: 'wrap',
          }}
        >
          {report.formats.map((fmt) => (
            <Button
              key={fmt}
              type="button"
              variant="tonal"
              size="sm"
              leadingIcon={<Download size={14} />}
              onClick={() => {
                onDownload(report, fmt);
                onClose();
              }}
            >
              {fmt} {isTR ? 'İndir' : 'Download'}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
