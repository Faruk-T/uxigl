import React, { useCallback, useMemo, useState } from 'react';
import { BarChart2, Plus, Search } from 'lucide-react';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { Input } from '../../primitives/Input/Input';
import { Card } from '../Card/Card';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { ReportCard } from './ReportCard';
import { ReportGeneratorModal } from './ReportGeneratorModal';
import { ReportPreviewModal } from './ReportPreviewModal';
import { buildSeedReports, filterReports } from './reportsUtils';
import type {
  ReportCategory,
  ReportFormat,
  ReportItem,
  ReportsProps,
} from './types';

/**
 * ============================================================================
 * uxiGL COMPOSITE — MODULAR EXECUTIVE REPORTS & AUDIT CENTER
 * ============================================================================
 * SOLID Architecture:
 * - reportsUtils: pure filtering, metadata & seed builders
 * - ReportCard: single report presentation, preview & download triggers
 * - ReportPreviewModal: interactive report summary & multi-format export
 * - ReportGeneratorModal: custom report creation flow
 * - Reports: state orchestration, controlled/uncontrolled sync & storageKey
 */
export const Reports: React.FC<ReportsProps> = ({
  reports: controlledReports,
  onReportsChange,
  initialReports,
  locale = 'tr',
  storageKey,
  onDownload,
  onGenerateReport,
  className = '',
  style,
}) => {
  const isTR = locale === 'tr';

  const [internalReports, setInternalReports] = useState<ReportItem[]>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore malformed storage
      }
    }
    return initialReports ?? buildSeedReports(locale);
  });

  const reports = controlledReports ?? internalReports;

  const commitReports = useCallback(
    (updater: (prev: ReportItem[]) => ReportItem[]) => {
      if (controlledReports !== undefined) {
        onReportsChange?.(updater(controlledReports));
        return;
      }
      setInternalReports((prev) => {
        const next = updater(prev);
        if (storageKey && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {
            // ignore storage quota errors
          }
        }
        onReportsChange?.(next);
        return next;
      });
    },
    [controlledReports, onReportsChange, storageKey]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ReportCategory | 'all'>('all');
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);

  const filteredReports = useMemo(
    () => filterReports(reports, searchQuery, activeCategory),
    [reports, searchQuery, activeCategory]
  );

  const handleDownload = (report: ReportItem, format: ReportFormat) => {
    onDownload?.(report, format);
  };

  const handleGenerate = (report: ReportItem) => {
    commitReports((prev) => [report, ...prev]);
    onGenerateReport?.(report);
  };

  const signedCount = reports.filter((r) => r.status === 'signed').length;
  const readyCount = reports.filter((r) => r.status === 'ready').length;

  return (
    <div
      className={`uxu-reports-module ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        width: '100%',
        ...style,
      }}
    >
      {/* Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 10,
        }}
      >
        {[
          { label: isTR ? 'Toplam Rapor' : 'Total Reports', value: reports.length, tone: 'primary' as const },
          { label: isTR ? 'İndirmeye Hazır' : 'Ready to Export', value: readyCount, tone: 'success' as const },
          { label: isTR ? 'İmzalı Denetim' : 'Signed Audits', value: signedCount, tone: 'info' as const },
          { label: isTR ? 'SLA Uyumluluk' : 'SLA Compliance', value: '%99.98', tone: 'primary' as const },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--uxu-radius-md)',
              border: '1px solid var(--uxu-border-subtle)',
              background: 'var(--uxu-surface-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--uxu-text-secondary)', fontWeight: 600 }}>
              {item.label}
            </span>
            <Badge tone={item.tone} variant="tonal" size="sm">
              {item.value}
            </Badge>
          </div>
        ))}
      </div>

      {/* Main Reports Card */}
      <Card
        variant="glass"
        padding="lg"
        eyebrow={isTR ? 'REPORTS CENTER • YÖNETİCİ RAPORLARI' : 'REPORTS CENTER • EXECUTIVE EXPORTS'}
        title={isTR ? 'Yönetici Raporları & Denetim Çıktıları' : 'Executive Reports & Audit Exports'}
        subtitle={
          isTR
            ? 'Finansal özetleri, analitik çıktılarını ve SLA denetim kayıtlarını önizleyin veya indirin'
            : 'Preview or export financial summaries, telemetry snapshots, and SLA audit logs'
        }
        headerIcon={<BarChart2 size={18} />}
        headerAction={
          <Button
            type="button"
            variant="filled"
            size="sm"
            leadingIcon={<Plus size={15} />}
            onClick={() => setGeneratorOpen(true)}
          >
            {isTR ? 'Yeni Rapor' : 'New Report'}
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <div style={{ flex: 1, minWidth: 220 }}>
              <Input
                placeholder={isTR ? 'Rapor adı, dönem veya yazar ara...' : 'Search report title, period, author...'}
                value={searchQuery}
                onChange={setSearchQuery}
                leadingIcon={<Search size={15} />}
              />
            </div>

            <SegmentedControl<ReportCategory | 'all'>
              size="sm"
              value={activeCategory}
              onChange={setActiveCategory}
              options={[
                { value: 'all', label: isTR ? 'Tümü' : 'All' },
                { value: 'finance', label: isTR ? 'Finans' : 'Finance' },
                { value: 'analytics', label: isTR ? 'Analitik' : 'Analytics' },
                { value: 'security', label: isTR ? 'Güvenlik' : 'Security' },
                { value: 'compliance', label: isTR ? 'Uyumluluk' : 'Compliance' },
              ]}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: 12,
            }}
          >
            {filteredReports.map((rep) => (
              <ReportCard
                key={rep.id}
                report={rep}
                locale={locale}
                onPreview={setPreviewReport}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>
      </Card>

      <ReportPreviewModal
        report={previewReport}
        locale={locale}
        onClose={() => setPreviewReport(null)}
        onDownload={handleDownload}
      />

      <ReportGeneratorModal
        open={generatorOpen}
        locale={locale}
        onClose={() => setGeneratorOpen(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
};
