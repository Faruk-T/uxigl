import React, { useState } from 'react';
import { CreditCard, Download, Mail, Phone, Sparkles, Sun } from 'lucide-react';
import { GithubIcon } from '../../../components/brand/GithubIcon';
import { UXILogo } from '../../../components/brand/UXILogo';
import {
  Button,
  Checkbox,
  GoogleIcon,
  Input,
  Select,
  Slider,
  Switch,
  Textarea,
} from '../../../components/primitives';

export const ButtonLiveMiniDemo: React.FC = () => {
  const [syncPressed, setSyncPressed] = useState(true);
  const [filterExpanded, setFilterExpanded] = useState(false);

  return (
    <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
      <Button variant="filled" leadingIcon={<Sparkles size={15} />}>
        Filled (Birincil)
      </Button>
      <Button variant="tonal">Tonal (M3)</Button>
      <Button variant="glass">Liquid Glass</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button
        variant="glass"
        toggleable
        statusDot
        pressed={syncPressed}
        onToggle={setSyncPressed}
      >
        Switch Modu: {syncPressed ? 'Açık' : 'Kapalı'}
      </Button>
      <Button
        variant="tonal"
        collapsible
        expanded={filterExpanded}
        badgeCount={4}
        onExpandChange={setFilterExpanded}
      >
        Collapse ({filterExpanded ? 'Açık' : 'Kapalı'})
      </Button>
      <Button
        variant="filled"
        leadingIcon={<Download size={14} />}
        splitAction
        splitItems={[
          { id: 'xlsx', label: 'Excel (.xlsx) İndir' },
          { id: 'csv', label: 'CSV (.csv) İndir' },
        ]}
      >
        Dışa Aktar
      </Button>
    </div>
  );
};

export const InputLiveMiniDemo: React.FC = () => {
  const [email, setEmail] = useState('architect@truncgil.com');
  const [phone, setPhone] = useState('0532 410 88 92');
  const [card, setCard] = useState('4543 6012 8941 0098');

  return (
    <div className="uxu-stage-grid-2">
      <Input
        label="Kurumsal E-Posta (Clearable + Sayaç)"
        value={email}
        onChange={setEmail}
        leadingIcon={<Mail size={15} />}
        clearable
        showCount
        maxLength={64}
      />
      <Input
        label="Telefon Maskesi (mask='phone')"
        mask="phone"
        value={phone}
        onChange={setPhone}
        leadingIcon={<Phone size={15} />}
      />
      <Input
        label="Kredi Kartı Maskesi (mask='credit-card')"
        mask="credit-card"
        value={card}
        onChange={setCard}
        leadingIcon={<CreditCard size={15} />}
        surface="tonal"
      />
      <Input
        label="Prefix & Suffix Subdomain"
        prefixText="https://"
        suffixText=".uxigl.com"
        value="kurumsal"
        onChange={() => {}}
      />
    </div>
  );
};

export const SelectTextareaLiveMiniDemo: React.FC = () => {
  const [region, setRegion] = useState('eu-central');
  const [note, setNote] = useState(
    'İrsaliye yerine geçer. 30 gün vadeli B2B kurumsal mutabakat faturasıdır.'
  );

  return (
    <div className="uxu-stage-grid-2">
      <Select
        label="Bulut Dağıtım Bölgesi (<Select />)"
        value={region}
        onChange={setRegion}
        options={[
          {
            value: 'eu-central',
            label: 'Frankfurt M4 Kümesi (eu-central-1)',
            description: '9ms gecikme • Birincil',
            badge: 'Aktif',
          },
          {
            value: 'tr-west',
            label: 'İstanbul Edge Düğümü (tr-west-1)',
            description: '2ms yerel gecikme • GİB Uyumlu',
            badge: '2ms',
          },
          {
            value: 'us-east',
            label: 'Virginia Kuzey (us-east-1)',
            description: 'Yedek felaket kurtarma kümesi',
          },
        ]}
      />
      <Textarea
        label="e-Fatura Açıklama Notu (<Textarea />)"
        value={note}
        onChange={setNote}
        rows={3}
        maxLength={200}
        showCount
        quickTemplates={['İrsaliye yerine geçer.', 'Tevkifatlı Fatura']}
      />
    </div>
  );
};

export const SwitchCheckboxSliderLiveMiniDemo: React.FC = () => {
  const [sw, setSw] = useState(true);
  const [chk, setChk] = useState(true);
  const [sld, setSld] = useState(75);

  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-grid-2">
        <Switch
          label="Liquid Glass Adaptif Bulanıklık (<Switch />)"
          description="Kaydırıldığında geçici sıvı cam merceği aktifleşir"
          value={sw}
          onChange={setSw}
          tone="primary"
        />
        <Checkbox
          label="GİB e-Fatura & KVKK Onayı (<Checkbox />)"
          description="Animasyonlu SVG onay işareti ve indeterminate desteği"
          value={chk}
          onChange={setChk}
          tone="success"
        />
      </div>
      <Slider
        label="Kontrol Merkezi Çıkış Seviyesi (<Slider />)"
        value={sld}
        onChange={setSld}
        min={0}
        max={100}
        step={5}
        showTicks
        valueSuffix="%"
        leadingIcon={<Sun size={15} />}
      />
    </div>
  );
};

export const BrandIconsLiveMiniDemo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <UXILogo size={48} glow />
        <div>
          <strong style={{ fontSize: '0.92rem' }}>UXILogo (U + X + I Monogram)</strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)' }}>
            Tek glif 3D Liquid-Glass amblem &amp; GithubIcon
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <GithubIcon size={24} />
        <GoogleIcon name="dashboard" tone="primary" size={26} />
        <GoogleIcon name="table_chart" tone="success" size={26} filled />
        <GoogleIcon name="folder_open" tone="info" size={26} />
        <GoogleIcon name="verified_user" tone="warning" size={26} filled />
        <GoogleIcon name="bolt" tone="danger" size={26} />
      </div>
    </div>
  );
};
