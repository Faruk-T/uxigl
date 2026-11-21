import React from 'react';
import { BrandIconsLiveMiniDemo } from '../demos/FormBasicDemos';
import {
  CurrencyInputLiveMiniDemo,
  DateTimeLiveMiniDemo,
  FileDropzoneLiveMiniDemo,
  MultiSelectTagsLiveMiniDemo,
} from '../demos/FormEnterpriseDemos';
import type { DocComponentGuideItem } from '../types';

export const FORM_ENTERPRISE_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'currency-input',
    tag: '<CurrencyInput />',
    navLabelTr: 'Para Birimi & KDV Girişi',
    navLabelEn: 'Currency & VAT Input',
    titleTr: 'Çoklu Döviz (TRY/USD/EUR/GBP) & Canlı KDV Hesaplayıcı',
    titleEn: 'Multi-Currency (TRY/USD/EUR/GBP) & Live VAT Calculator',
    categoryLabelTr: 'Kurumsal Form',
    categoryLabelEn: 'Enterprise Form',
    importStatement: "import { CurrencyInput } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Intl.NumberFormat ile yerel para formatı uygular ve alt satırda Net + KDV = Genel Toplam dökümünü otomatik hesaplar.',
    architectureNoteEn:
      'Formats currency natively with Intl.NumberFormat and renders live Net + VAT = Total breakdown.',
    summaryTr:
      'ERP, faturalandırma ve B2B ödeme ekranları için para birimi seçicili, vergi oranı hesaplayan akıllı tutar girişi.',
    summaryEn:
      'Smart monetary input with currency switcher and automatic VAT breakdown for ERP and billing screens.',
    code: `<CurrencyInput
  label="Fatura Tutarı"
  value={amount}
  onChange={setAmount}
  currency={currency}
  onCurrencyChange={setCurrency}
  vatRate={20}
  showVatBreakdown
/>`,
    propsTable: [
      {
        name: 'value / onChange',
        type: 'number / (val: number) => void',
        defaultValue: '0',
        required: true,
        description: 'Sayısal tutar değeri.',
      },
      {
        name: 'currency / onCurrencyChange',
        type: "'TRY' | 'USD' | 'EUR' | 'GBP'",
        defaultValue: "'TRY'",
        description: 'Aktif döviz birimi.',
      },
      {
        name: 'vatRate / showVatBreakdown',
        type: 'number / boolean',
        defaultValue: '20 / true',
        description: 'KDV oranı (%) ve canlı döküm şeridi.',
      },
    ],
    renderLiveDemo: () => <CurrencyInputLiveMiniDemo />,
  },
  {
    id: 'datetime-input',
    tag: '<DateTimePickerInput />',
    navLabelTr: 'Tarih & Saat Seçici',
    navLabelEn: 'Date & Time Picker',
    titleTr: 'Vade Kısayollu Tarih & Saat Seçici',
    titleEn: 'Date & Time Picker with Quick Due Presets',
    categoryLabelTr: 'Kurumsal Form',
    categoryLabelEn: 'Enterprise Form',
    importStatement: "import { DateTimePickerInput } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Tek tıkla Bugün, +7 Gün, +15 Gün ve +30 Gün vade hesaplayan hızlı çip butonlarıyla gelir.',
    architectureNoteEn:
      'Ships with one-click Today, +7D, +15D, and +30D due-date preset chips.',
    summaryTr:
      'Fatura vadesi, teslimat planlama ve randevu saatleri için çift alanlı tarih ve saat seçici.',
    summaryEn:
      'Dual date & time picker with fast invoice due-date presets.',
    code: `<DateTimePickerInput
  label="Vade Tarihi"
  dateValue={date}
  timeValue={time}
  onDateChange={setDate}
  onTimeChange={setTime}
  includeTime
  showPresets
/>`,
    propsTable: [
      {
        name: 'dateValue / timeValue',
        type: 'string',
        defaultValue: "''",
        required: true,
        description: 'YYYY-MM-DD ve HH:mm formatında değerler.',
      },
      {
        name: 'includeTime / showPresets',
        type: 'boolean',
        defaultValue: 'true / true',
        description: 'Saat alanını ve +7G/+15G/+30G çiplerini kontrol eder.',
      },
    ],
    renderLiveDemo: () => <DateTimeLiveMiniDemo />,
  },
  {
    id: 'multiselect-tags',
    tag: '<MultiSelectTagInput />',
    navLabelTr: 'Çoklu Etiket Seçici',
    navLabelEn: 'Multi-Select Tag Input',
    titleTr: 'Çoklu Etiket (Tag/Chip) & Hızlı Öneri Seçici',
    titleEn: 'Multi-Select Tag & Quick Suggestion Input',
    categoryLabelTr: 'Kurumsal Form',
    categoryLabelEn: 'Enterprise Form',
    importStatement: "import { MultiSelectTagInput } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Enter veya virgül ile etiket ekler, Backspace ile son etiketi siler ve maxTags sınırını korur.',
    architectureNoteEn:
      'Adds tags on Enter/comma, removes last tag on Backspace, and enforces maxTags limit.',
    summaryTr:
      'Cari segmentasyon, görev etiketleme ve kategori filtreleme için etkileşimli çoklu etiket girişi.',
    summaryEn:
      'Interactive multi-tag input for segmentation, task labeling, and filtering.',
    code: `<MultiSelectTagInput
  label="Cari Etiketler"
  tags={tags}
  onChange={setTags}
  maxTags={8}
/>`,
    propsTable: [
      {
        name: 'tags / onChange',
        type: 'string[] / (tags: string[]) => void',
        defaultValue: '[]',
        required: true,
        description: 'Seçili etiket dizisi.',
      },
      {
        name: 'suggestions / maxTags',
        type: 'string[] / number',
        defaultValue: 'preset / 10',
        description: 'Hızlı öneri listesi ve maksimum etiket limiti.',
      },
    ],
    renderLiveDemo: () => <MultiSelectTagsLiveMiniDemo />,
  },
  {
    id: 'file-dropzone',
    tag: '<FileUploadDropzone />',
    navLabelTr: 'Dosya Yükleme Alanı',
    navLabelEn: 'File Upload Dropzone',
    titleTr: 'Sürükle-Bırak Kurumsal Dosya Yükleyici',
    titleEn: 'Drag & Drop Enterprise File Uploader',
    categoryLabelTr: 'Kurumsal Form',
    categoryLabelEn: 'Enterprise Form',
    importStatement: "import { FileUploadDropzone } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Sürükle-bırak vurgulama, dosya boyutu/türü rozetleri ve yükleme ilerleme çubukları içerir.',
    architectureNoteEn:
      'Includes drag-over highlight, file type/size badges, and upload progress bars.',
    summaryTr:
      'e-Fatura XML, PDF sözleşme ve görsel ekleri için hazır kurumsal dosya yükleme alanı.',
    summaryEn:
      'Ready-to-use drag-and-drop file uploader for XML, PDF, and media attachments.',
    code: `<FileUploadDropzone files={files} onChange={setFiles} maxSizeMb={25} />`,
    propsTable: [
      {
        name: 'files / onChange',
        type: 'UploadedFileItem[]',
        defaultValue: '[]',
        required: true,
        description: 'Yüklenen dosya listesi ve güncelleme fonksiyonu.',
      },
      {
        name: 'accept / maxSizeMb',
        type: 'string / number',
        defaultValue: "'*' / 25",
        description: 'İzin verilen MIME/uzantı ve MB cinsinden boyut sınırı.',
      },
    ],
    renderLiveDemo: () => <FileDropzoneLiveMiniDemo />,
  },
  {
    id: 'brand-icons',
    tag: '<UXILogo />, <GithubIcon /> & <GoogleIcon />',
    navLabelTr: 'Marka Logosu & İkonlar',
    navLabelEn: 'Brand Logos & Icons',
    titleTr: '3D Liquid-Glass Monogram, GitHub İkonu & Değişken Vektör İkonlar',
    titleEn: '3D Liquid-Glass Monogram, GitHub Icon & Variable Vector Icons',
    categoryLabelTr: 'Marka & İkon',
    categoryLabelEn: 'Brand & Icons',
    importStatement: "import { UXILogo, GithubIcon, GoogleIcon } from 'truncgil-uxigl';",
    architectureNoteTr:
      'GoogleIcon bileşeni ThemeProvider üzerinden Rounded, Outlined, Sharp stillerini ve FILL/wght eksenlerini otomatik alır.',
    architectureNoteEn:
      'GoogleIcon inherits Rounded, Outlined, Sharp styles and FILL/wght axes from ThemeProvider.',
    summaryTr:
      'uxiGL marka amblemi, temiz SVG GitHub ikonu ve Google Material Symbols değişken vektör ikon sarmalayıcısı.',
    summaryEn:
      'uxiGL brand emblem, crisp SVG GitHub icon, and Google Material Symbols variable icon wrapper.',
    code: `<UXILogo size={48} glow />
<GithubIcon size={22} />
<GoogleIcon name="dashboard" tone="primary" size={24} filled />`,
    propsTable: [
      {
        name: 'size (UXILogo / GithubIcon)',
        type: 'number',
        defaultValue: '40 / 16',
        description: 'Piksel cinsinden logo/ikon boyutu.',
      },
      {
        name: 'name / tone / filled',
        type: 'string / Tone / boolean',
        defaultValue: "- / 'inherit' / false",
        description: 'Google Material Symbols glif adı, tonu ve dolgu ekseni.',
      },
    ],
    renderLiveDemo: () => <BrandIconsLiveMiniDemo />,
  },
];
