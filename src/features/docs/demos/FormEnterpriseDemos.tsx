import React, { useState } from 'react';
import {
  CurrencyInput,
  DateTimePickerInput,
  FileUploadDropzone,
  MultiSelectTagInput,
  type CurrencyCode,
  type UploadedFileItem,
} from '../../../components/primitives';

export const CurrencyInputLiveMiniDemo: React.FC = () => {
  const [amount, setAmount] = useState<number>(148500);
  const [currency, setCurrency] = useState<CurrencyCode>('TRY');

  return (
    <CurrencyInput
      label="B2B Hakediş & Fatura Tutarı (Canlı KDV Hesaplayıcı)"
      value={amount}
      onChange={setAmount}
      currency={currency}
      onCurrencyChange={setCurrency}
      vatRate={20}
      showVatBreakdown
    />
  );
};

export const DateTimeLiveMiniDemo: React.FC = () => {
  const [date, setDate] = useState('2026-11-15');
  const [time, setTime] = useState('14:30');

  return (
    <DateTimePickerInput
      label="Fatura Vade & Teslimat Zamanı (+15G / +30G Hızlı Çipler)"
      dateValue={date}
      timeValue={time}
      onDateChange={setDate}
      onTimeChange={setTime}
      includeTime
      showPresets
    />
  );
};

export const MultiSelectTagsLiveMiniDemo: React.FC = () => {
  const [tags, setTags] = useState<string[]>([
    'e-Fatura Mükellefi',
    'SOC2-Type-II',
    'Öncelikli SLA',
  ]);

  return (
    <MultiSelectTagInput
      label="Kurumsal Cari Etiketler (Enter ile ekle / öneriye tıkla)"
      tags={tags}
      onChange={setTags}
      maxTags={8}
    />
  );
};

export const FileDropzoneLiveMiniDemo: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([
    {
      id: 'doc-1',
      name: 'GIB_eFatura_Zarf_2026.xml',
      sizeKb: 312,
      type: 'xml',
      progress: 100,
      status: 'completed',
    },
    {
      id: 'doc-2',
      name: 'Kurumsal_SLA_Sozlesmesi.pdf',
      sizeKb: 1420,
      type: 'pdf',
      progress: 100,
      status: 'completed',
    },
  ]);

  return <FileUploadDropzone files={files} onChange={setFiles} />;
};
