import React from 'react';
import { Calendar, Download, Eye, FileText } from 'lucide-react';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { REPORT_CATEGORY_META, REPORT_STATUS_META } from './reportsUtils';
import type { ReportFormat, ReportItem } from './types';

export interface ReportCardProps {
  report: ReportItem;
  locale: 'tr' | 'en';
  onPreview: (report: ReportItem) => void;
  onDownload: (report: ReportItem, format: ReportFormat) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  locale,
  onPreview,
  onDownload,
}) => {
  const isTR = locale === 'tr';
  const catMeta = REPORT_CATEGORY_META[report.category];
  const statusMeta = REPORT_STATUS_META[report.status];

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 'var(--uxu-radius-md)',
        background: 'var(--uxu-surface-tonal)',
        border: '1px solid var(--uxu-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Badge tone={catMeta.tone} variant="tonal" size="xs">
            {isTR ? catMeta.labelTr : catMeta.labelEn}
          </Badge>
          <Badge tone={statusMeta.tone} size="xs">
            {isTR ? statusMeta.labelTr : statusMeta.labelEn}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 'var(--uxu-radius-sm)',
              background: 'var(--uxu-bg-elevated)',
              border: '1px solid var(--uxu-border-subtle)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--uxu-primary)',
              flexShrink: 0,
            }}
          >
            <FileText size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.35 }}>
              {report.title}
            </div>
            {report.description && (
              <div style={{ fontSize: '0.76rem', color: 'var(--uxu-text-secondary)', marginTop: 3, lineHeight: 1.4 }}>
                {report.description}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          paddingTop: 10,
          borderTop: '1px solid var(--uxu-border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.73rem',
            color: 'var(--uxu-text-secondary)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} />
            {report.period}
          </span>
          <span>• {report.size}</span>
          <span>• {report.formats.join(' / ')}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            leadingIcon={<Eye size={13} />}
            onClick={() => onPreview(report)}
          >
            {isTR ? 'Önizle' : 'Preview'}
          </Button>
          <Button
            type="button"
            variant="tonal"
            size="xs"
            leadingIcon={<Download size={13} />}
            onClick={() => onDownload(report, report.formats[0] ?? 'PDF')}
          >
            {isTR ? 'İndir' : 'Download'}
          </Button>
        </div>
      </div>
    </div>
  );
};
