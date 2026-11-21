import React from 'react';
import {
  ButtonLiveMiniDemo,
  InputLiveMiniDemo,
  SelectTextareaLiveMiniDemo,
  SwitchCheckboxSliderLiveMiniDemo,
} from '../demos/FormBasicDemos';
import type { DocComponentGuideItem } from '../types';

export const FORM_ACTION_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'button',
    tag: '<Button />',
    navLabelTr: 'Butonlar & Eylem Çeşitleri',
    navLabelEn: 'Buttons & Action Variants',
    titleTr: 'Eylem, Switch-Toggle, Collapse & Split Menü Butonları',
    titleEn: 'Action, Switch-Toggle, Collapse & Split Menu Buttons',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    playgroundId: 'button',
    importStatement: "import { Button } from 'truncgil-uxigl';",
    architectureNoteTr:
      '8 varyant (filled, tonal, glass, outlined, ghost, success, warning, danger), Switch modu, Collapse modu ve Split Menü destekler.',
    architectureNoteEn:
      'Supports 8 variants, Switch toggle mode, Collapse expand mode, and Split dropdown actions.',
    summaryTr:
      'Kurumsal uygulamalarda birincil aksiyonlar, durum değiştiren araç çubuğu anahtarları, panel aç/kapa tetikleyicileri ve çoklu dışa aktarma menüleri için tek birleşik buton.',
    summaryEn:
      'Unified button primitive for primary actions, stateful toolbar toggles, collapsible triggers, and split dropdown menus.',
    code: `<Button variant="filled" leadingIcon={<Sparkles size={15} />}>Kaydet</Button>
<Button variant="glass" toggleable statusDot pressed={sync} onToggle={setSync}>
  Canlı Senkronizasyon
</Button>
<Button variant="tonal" collapsible expanded={open} badgeCount={4} onExpandChange={setOpen}>
  Filtreler
</Button>`,
    propsTable: [
      {
        name: 'variant',
        type: "'filled' | 'tonal' | 'glass' | 'outlined' | 'ghost' | 'success' | 'warning' | 'danger'",
        defaultValue: "'filled'",
        description: 'Buton yüzey ve semantik ton varyantı.',
      },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Yükseklik ve iç boşluk ölçeği.',
      },
      {
        name: 'toggleable / pressed / onToggle',
        type: 'boolean / boolean / (next: boolean) => void',
        defaultValue: 'false',
        description: 'Switch/Toggle modu ve canlı durum noktası (statusDot).',
      },
      {
        name: 'collapsible / expanded / onExpandChange',
        type: 'boolean / boolean / (next: boolean) => void',
        defaultValue: 'false',
        description: 'Collapse/Expand modu ve dönen ok ikonu.',
      },
      {
        name: 'splitAction / splitItems',
        type: 'boolean / SplitButtonMenuItem[]',
        defaultValue: 'false / []',
        description: 'Sağ kenarda ayrılmış açılır menü ekler.',
      },
    ],
    renderLiveDemo: () => <ButtonLiveMiniDemo />,
  },
  {
    id: 'input',
    tag: '<Input />',
    navLabelTr: 'Metin & Maskeli Giriş',
    navLabelEn: 'Text & Masked Input',
    titleTr: 'Metin Girişi, Otomatik Maskeleme & Floating Label',
    titleEn: 'Text Input, Auto-Masking & Floating Label',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    playgroundId: 'input',
    importStatement: "import { Input } from 'truncgil-uxigl';",
    architectureNoteTr:
      '7 yerleşik maske (phone, credit-card, iban, date, time, currency, tax-id), prefix/suffix, clearable ve şifre göster/gizle içerir.',
    architectureNoteEn:
      'Includes 7 built-in masks, prefix/suffix affixes, clearable button, and password reveal toggle.',
    summaryTr:
      'Liquid Glass veya M3 Tonal yüzeylerde çalışan, anlık doğrulama, karakter sayacı ve akıllı formatlama sunan giriş alanı.',
    summaryEn:
      'Smart input field with Liquid Glass or M3 Tonal surfaces, live validation, character counter, and auto-formatting.',
    code: `<Input
  label="Kurumsal Telefon"
  mask="phone"
  value={phone}
  onChange={setPhone}
  leadingIcon={<Phone size={15} />}
  clearable
/>`,
    propsTable: [
      {
        name: 'mask',
        type: "'none' | 'phone' | 'credit-card' | 'iban' | 'date' | 'time' | 'currency' | 'tax-id'",
        defaultValue: "'none'",
        description: 'Otomatik formatlama maskesi uygular.',
      },
      {
        name: 'surface',
        type: "'glass' | 'tonal' | 'outlined'",
        defaultValue: "'glass'",
        description: 'Giriş alanı yüzey stili.',
      },
      {
        name: 'clearable / showCount',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Tek tıkla temizleme ve karakter sayacı.',
      },
      {
        name: 'prefixText / suffixText',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Sabit ön ek ve son ek metinleri.',
      },
    ],
    renderLiveDemo: () => <InputLiveMiniDemo />,
  },
  {
    id: 'select-textarea',
    tag: '<Select /> & <Textarea />',
    navLabelTr: 'Açılır Liste & Çok Satırlı Metin',
    navLabelEn: 'Select & Textarea',
    titleTr: 'Özel Açılır Seçici (<Select />) & Şablonlu Metin Alanı (<Textarea />)',
    titleEn: 'Custom Dropdown (<Select />) & Quick-Template <Textarea />',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    importStatement: "import { Select, Textarea } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Select bileşeni arama, açıklama ve rozet destekler; Textarea ise tek tıkla hızlı şablon cümleleri ekler.',
    architectureNoteEn:
      'Select supports search, descriptions, and badges; Textarea supports one-click quick sentence templates.',
    summaryTr:
      'Tarayıcının yerel select kısıtlamalarını aşan özel tasarım açılır liste ve fatura/not açıklamaları için gelişmiş metin alanı.',
    summaryEn:
      'Custom-styled dropdown overcoming native select limits and rich textarea with quick-insert templates.',
    code: `<Select
  label="Bulut Bölgesi"
  value={region}
  onChange={setRegion}
  options={[{ value: 'eu-central', label: 'Frankfurt M4', badge: '9ms' }]}
/>
<Textarea
  label="Açıklama"
  value={note}
  onChange={setNote}
  quickTemplates={['İrsaliye yerine geçer.']}
/>`,
    propsTable: [
      {
        name: 'options',
        type: 'SelectOption[]',
        defaultValue: '[]',
        required: true,
        description: 'Seçenek listesi (value, label, description, badge).',
      },
      {
        name: 'quickTemplates',
        type: 'string[]',
        defaultValue: '[]',
        description: 'Textarea altına tek tıkla eklenen hazır metin çipleri.',
      },
    ],
    renderLiveDemo: () => <SelectTextareaLiveMiniDemo />,
  },
  {
    id: 'switch-checkbox-slider',
    tag: '<Switch />, <Checkbox /> & <Slider />',
    navLabelTr: 'Anahtar, Onay Kutusu & Kaydırıcı',
    navLabelEn: 'Switch, Checkbox & Slider',
    titleTr: 'iOS 26 Sıvı Mercek Switch, Animasyonlu Checkbox & Tonal Slider',
    titleEn: 'iOS 26 Liquid-Lens Switch, Animated Checkbox & Tonal Slider',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    playgroundId: 'switch',
    importStatement: "import { Switch, Checkbox, Slider } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Tamamı klavye ve ARIA uyumludur; tema motorundaki tonal renkleri ve köşe yarıçaplarını otomatik miras alır.',
    architectureNoteEn:
      'Fully keyboard and ARIA compliant; automatically inherits theme tonal colors and radius tokens.',
    summaryTr:
      'Ayarlar, izin onayları ve sayısal yoğunluk/parlaklık kontrolleri için dokunsal hisli üçlü temel kontrol seti.',
    summaryEn:
      'Tactile trio of controls for toggles, consent checkboxes, and numeric range sliders.',
    code: `<Switch label="Liquid Glass" value={sw} onChange={setSw} tone="primary" />
<Checkbox label="KVKK Onayı" value={chk} onChange={setChk} tone="success" />
<Slider label="Yoğunluk" value={sld} onChange={setSld} min={0} max={100} showTicks />`,
    propsTable: [
      {
        name: 'value / onChange',
        type: 'boolean | number / (val) => void',
        defaultValue: '-',
        required: true,
        description: 'Kontrollü değer ve değişiklik geri çağrısı.',
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
        defaultValue: "'primary'",
        description: 'Aktif durum vurgu rengi.',
      },
      {
        name: 'showTicks / valueSuffix',
        type: 'boolean / string',
        defaultValue: 'false / ""',
        description: 'Slider üzerinde kademe işaretleri ve birim eki gösterir.',
      },
    ],
    renderLiveDemo: () => <SwitchCheckboxSliderLiveMiniDemo />,
  },
];
