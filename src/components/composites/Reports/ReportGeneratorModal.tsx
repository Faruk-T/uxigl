import React, { useState } from 'react';
import { Button } from '../../primitives/Button/Button';
import { Input } from '../../primitives/Input/Input';
import { Textarea } from '../../primitives/Textarea/Textarea';
import { Modal } from '../Modal/Modal';
import type { ReportCategory, ReportFormat, ReportItem } from './types';

export interface ReportGeneratorModalProps {
  open: boolean;
  locale: 'tr' | 'en';
  onClose: () => void;
  onGenerate: (report: ReportItem) => void;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  open,
  locale,
  onClose,
  onGenerate,
}) => {
  const isTR = locale === 'tr';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>('finance');
  const [format, setFormat] = useState<ReportFormat>('PDF');
  const [period, setPeriod] = useState(isTR ? 'Kasım 2026' : 'November 2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item: ReportItem = {
      id: `rep-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      period: period.trim() || (isTR ? 'Özel Dönem' : 'Custom Period'),
      formats: [format],
      size: '1.8 MB',
      status: 'ready',
      generatedAt: isTR ? 'Az önce' : 'Just now',
      author: 'uxiGL Reports Studio',
    };
    onGenerate(item);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isTR ? 'Yeni Özel Rapor Oluştur' : 'Generate Custom Report'}
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input
          label={isTR ? 'Rapor Başlığı' : 'Report Title'}
          placeholder={isTR ? 'Örn: Q4 Bulut Maliyet Analizi' : 'e.g., Q4 Cloud Cost Analysis'}
          value={title}
          onChange={setTitle}
          required
        />

        <Textarea
          label={isTR ? 'Kapsam / Açıklama' : 'Scope / Description'}
          value={description}
          onChange={setDescription}
          rows={2}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.76rem', fontWeight: 600 }}>
            <span>{isTR ? 'Kategori' : 'Category'}</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              style={{
                height: 36,
                padding: '0 8px',
                borderRadius: 'var(--uxu-radius-sm)',
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-surface-tonal)',
                color: 'var(--uxu-text-primary)',
                fontSize: '0.82rem',
              }}
            >
              <option value="finance">{isTR ? 'Finans' : 'Finance'}</option>
              <option value="analytics">{isTR ? 'Analitik' : 'Analytics'}</option>
              <option value="security">{isTR ? 'Güvenlik' : 'Security'}</option>
              <option value="compliance">{isTR ? 'Uyumluluk' : 'Compliance'}</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.76rem', fontWeight: 600 }}>
            <span>{isTR ? 'Format' : 'Format'}</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ReportFormat)}
              style={{
                height: 36,
                padding: '0 8px',
                borderRadius: 'var(--uxu-radius-sm)',
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-surface-tonal)',
                color: 'var(--uxu-text-primary)',
                fontSize: '0.82rem',
              }}
            >
              <option value="PDF">PDF</option>
              <option value="XLSX">XLSX</option>
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
            </select>
          </label>

          <Input
            label={isTR ? 'Dönem' : 'Period'}
            value={period}
            onChange={setPeriod}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {isTR ? 'İptal' : 'Cancel'}
          </Button>
          <Button type="submit" variant="filled" size="sm">
            {isTR ? 'Raporu Oluştur' : 'Generate Report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
