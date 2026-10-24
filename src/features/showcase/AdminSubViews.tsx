import React, { useState } from 'react';
import {
  Users,
  Package,
  FileText,
  Layers,
  BarChart2,
  MessageSquare,
  Calendar as CalendarIcon,
  Settings,
  Shield,
  Plus,
  Send,
  Download,
  Key,
  Lock,
  Sparkles,
  Bell,
  Sliders,
  ArrowUpRight,
  Building2,
  Phone,
  CreditCard,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Chip,
  CurrencyInput,
  type CurrencyCode,
  DateTimePickerInput,
  FileUploadDropzone,
  type UploadedFileItem,
  Input,
  MultiSelectTagInput,
  Progress,
  Slider,
  Switch,
} from '../../components/primitives';
import {
  Card,
  DataTable,
  SegmentedControl,
  SheetGLGridAdapter,
} from '../../components/composites';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { COMPONENT_CATALOG } from '../catalog/componentCatalog';

export type ExtendedAdminViewId =
  | 'users'
  | 'products'
  | 'forms'
  | 'elements-overview'
  | 'reports'
  | 'messages'
  | 'calendar'
  | 'settings'
  | 'security';

interface UserDirectoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastLogin: string;
}

const INITIAL_USERS: UserDirectoryRow[] = [
  {
    id: 'usr-1',
    name: 'Deniz Kaya',
    email: 'deniz.kaya@uxigl.dev',
    role: 'Principal Architect',
    department: 'Platform Mühendisliği',
    status: 'Active',
    lastLogin: '2 dk önce',
  },
  {
    id: 'usr-2',
    name: 'Selin Yılmaz',
    email: 'selin.yilmaz@uxigl.dev',
    role: 'Design Systems Lead',
    department: 'UI / UX Tasarım',
    status: 'Active',
    lastLogin: '14 dk önce',
  },
  {
    id: 'usr-3',
    name: 'Mert Can',
    email: 'mert.can@uxigl.dev',
    role: 'Staff DevSecOps',
    department: 'Siber Güvenlik',
    status: 'Active',
    lastLogin: '38 dk önce',
  },
  {
    id: 'usr-4',
    name: 'Zeynep Ak',
    email: 'zeynep.ak@uxigl.dev',
    role: 'Senior WebGL Engineer',
    department: 'Grafik & Shader',
    status: 'Active',
    lastLogin: '1 saat önce',
  },
  {
    id: 'usr-5',
    name: 'Barış Özdemir',
    email: 'baris.ozdemir@uxigl.dev',
    role: 'Product Manager',
    department: 'Ürün Yönetimi',
    status: 'Invited',
    lastLogin: 'Davet Bekliyor',
  },
];

const MESSAGES_DATA = [
  {
    id: 'msg-1',
    sender: 'Selin Yılmaz',
    role: 'Design Systems Lead',
    time: '10:42',
    unread: true,
    subject: 'Yeni Liquid Glass × Material 3 Grafikleri Onaylandı',
    preview:
      'Analytics sayfasındaki yeni Spline Area ve Donut grafiklerinin kontrast testleri tamamlandı.',
    body: 'Merhaba ekip, Analytics Dashboard üzerindeki yeni çok modlu gelir grafiği (Spline Area / Bar / Combo), Trafik Kaynakları Donut halkası ve Kullanıcı Davranış Akışı (Funnel) bileşenleri hem karanlık hem aydınlık temada WCAG AAA kontrast testlerinden başarıyla geçti.',
  },
  {
    id: 'msg-2',
    sender: 'Mert Can',
    role: 'Staff DevSecOps',
    time: '09:18',
    unread: true,
    subject: 'Zero-Trust API Anahtar Rotasyonu Tamamlandı',
    preview:
      'Frankfurt ve İstanbul uç düğümlerindeki TLS 1.3 sertifikaları yenilendi.',
    body: 'Tüm üretim ortamı API anahtarları ve FileManGL NTFS/POSIX izin tabloları otomatik rotasyondan geçirildi. Güvenlik skoru %98.4 seviyesindedir.',
  },
  {
    id: 'msg-3',
    sender: 'Zeynep Ak',
    role: 'Senior WebGL Engineer',
    time: 'Dün',
    unread: true,
    subject: 'SheetGL 100.000 Satır Bellek Optimizasyonu',
    preview: 'OffscreenCanvas iş parçacığı ile kaydırma gecikmesi 1.2ms altına indi.',
    body: 'SheetGL veri tablosunda yapılan son sanal pencereleme güncellemesiyle 100.000 satırlık finansal veri setinde sıfır kare kaybı sağlandı.',
  },
];

const CALENDAR_EVENTS = [
  {
    day: 4,
    title: 'uxiGL v2.5.0 Tasarım Sistemi Yayını',
    tag: 'Release',
    tone: 'primary' as const,
    time: '10:00',
  },
  {
    day: 11,
    title: 'SheetGL Finansal Tablo Yük Testi',
    tag: 'QA & Benchmark',
    tone: 'success' as const,
    time: '14:30',
  },
  {
    day: 16,
    title: 'FileManGL VFS Güvenlik Denetimi',
    tag: 'SecOps',
    tone: 'warning' as const,
    time: '11:00',
  },
  {
    day: 22,
    title: 'Analytics & Grafik Motoru Sunumu',
    tag: 'Bugün • Canlı',
    tone: 'info' as const,
    time: '16:00',
  },
  {
    day: 28,
    title: 'Q4 Kurumsal Yol Haritası Toplantısı',
    tag: 'Planlama',
    tone: 'primary' as const,
    time: '15:00',
  },
];

export interface AdminSubViewsProps {
  viewId: ExtendedAdminViewId;
  onSelectElementComponent?: (compId: string) => void;
}

export const AdminSubViews: React.FC<AdminSubViewsProps> = ({
  viewId,
  onSelectElementComponent,
}) => {
  const { notify } = useToast();
  const {
    preferences,
    resolvedMode,
    setMode,
    setFontScale,
    setCustomRadiusPx,
    setReducedMotion,
  } = useTheme();

  // Users view state
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [userEngineMode, setUserEngineMode] = useState<'native' | 'sheetgl'>(
    'native'
  );

  // Forms view state (Enterprise B2B / Muhasebe / E-Ticaret Form Studio)
  const [formProjectName, setFormProjectName] = useState(
    'Anadolu Bulut Teknoloji A.Ş.'
  );
  const [formAdminEmail, setFormAdminEmail] = useState('finans@anadolubulut.com.tr');
  const [formPhone, setFormPhone] = useState('+90 (532) 480 19 23');
  const [formTaxId, setFormTaxId] = useState('8940284910');
  const [formIban, setFormIban] = useState('TR33 0006 1005 1978 6457 8413 26');
  const [formCard, setFormCard] = useState('4543 6012 8941 0098');
  const [formAmount, setFormAmount] = useState<number>(248500);
  const [formCurrency, setFormCurrency] = useState<CurrencyCode>('TRY');
  const [formInvoiceDate, setFormInvoiceDate] = useState('2026-10-25');
  const [formInvoiceTime, setFormInvoiceTime] = useState('14:30');
  const [formTags, setFormTags] = useState<string[]>([
    'B2B Kurumsal',
    'e-Fatura Mükellefi',
    'Öncelikli SLA',
    'KDV %20',
  ]);
  const [formFiles, setFormFiles] = useState<UploadedFileItem[]>([
    {
      id: 'doc-1',
      name: 'Kurumsal_Cerceve_Sozlesmesi_2026.pdf',
      sizeKb: 1840,
      type: 'pdf',
      status: 'completed',
      progress: 100,
    },
    {
      id: 'doc-2',
      name: 'Imza_Sirkuleri_ve_Vergi_Levhasi.pdf',
      sizeKb: 642,
      type: 'pdf',
      status: 'completed',
      progress: 100,
    },
  ]);
  const [formAdvancedExpanded, setFormAdvancedExpanded] = useState<boolean>(true);
  const [formEInvoiceSync, setFormEInvoiceSync] = useState<boolean>(true);
  const [formRegion, setFormRegion] = useState<'eu' | 'us' | 'tr'>('tr');
  const [formQuota, setFormQuota] = useState<number>(75);
  const [formAutoScale, setFormAutoScale] = useState<boolean>(true);
  const [formZeroTrust, setFormZeroTrust] = useState<boolean>(true);
  const [formTerms, setFormTerms] = useState<boolean>(true);

  // Messages view state
  const [selectedMsgId, setSelectedMsgId] = useState<string>('msg-1');
  const [replyText, setReplyText] = useState<string>('');

  // Security view state
  const [mfaEnforced, setMfaEnforced] = useState<boolean>(true);
  const [ipAllowlist, setIpAllowlist] = useState<boolean>(true);
  const [auditStream, setAuditStream] = useState<boolean>(true);

  // 1. USERS VIEW
  if (viewId === 'users') {
    const filteredUsers =
      roleFilter === 'all'
        ? INITIAL_USERS
        : INITIAL_USERS.filter((u) => u.status.toLowerCase() === roleFilter);

    return (
      <div className="uxu-stack-md">
        <Card
          variant="glass"
          padding="md"
          eyebrow="USERS DIRECTORY • KULLANICI VE YETKİ YÖNETİMİ"
          title="Users & Team Directory"
          subtitle="Kullanıcı listesi, departman rolleri ve İK & Bordro SheetGL görünümü"
          headerIcon={<Users size={18} />}
          headerAction={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SegmentedControl<'native' | 'sheetgl'>
                size="sm"
                value={userEngineMode}
                onChange={setUserEngineMode}
                options={[
                  { value: 'native', label: 'Kullanıcı Tablosu' },
                  { value: 'sheetgl', label: 'SheetGL İK Matrisi' },
                ]}
              />
              <Button
                variant="filled"
                size="sm"
                leadingIcon={<Plus size={14} />}
                onClick={() =>
                  notify({
                    title: 'Yeni Kullanıcı Daveti',
                    description: 'Davet bağlantısı oluşturuldu.',
                    tone: 'success',
                  })
                }
              >
                Kullanıcı Ekle
              </Button>
            </div>
          }
        >
          {userEngineMode === 'native' ? (
            <div className="uxu-stack-md">
              <div className="uxu-stage-row">
                {[
                  { id: 'all', label: 'Tümü (5)' },
                  { id: 'active', label: 'Aktif (4)' },
                  { id: 'invited', label: 'Davetli (1)' },
                ].map((f) => (
                  <Chip
                    key={f.id}
                    size="sm"
                    tone="primary"
                    selected={roleFilter === f.id}
                    onClick={() => setRoleFilter(f.id)}
                  >
                    {f.label}
                  </Chip>
                ))}
              </div>

              <DataTable<UserDirectoryRow>
                rowKey="id"
                variant="striped"
                selectable
                searchable
                data={filteredUsers}
                columns={[
                  {
                    key: 'name',
                    header: 'Kullanıcı',
                    sortable: true,
                    render: (row) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar
                          name={row.name}
                          size="sm"
                          status={row.status === 'Active' ? 'online' : 'away'}
                          tone="primary"
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{row.name}</div>
                          <div
                            style={{
                              fontSize: '0.74rem',
                              color: 'var(--uxu-text-secondary)',
                            }}
                          >
                            {row.email}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  { key: 'role', header: 'Rol / Unvan', sortable: true },
                  { key: 'department', header: 'Departman', sortable: true },
                  {
                    key: 'status',
                    header: 'Durum',
                    render: (row) => (
                      <Badge
                        size="xs"
                        tone={row.status === 'Active' ? 'success' : 'warning'}
                        pulse={row.status === 'Active'}
                      >
                        {row.status}
                      </Badge>
                    ),
                  },
                  {
                    key: 'lastLogin',
                    header: 'Son Etkinlik',
                    align: 'right',
                  },
                ]}
              />
            </div>
          ) : (
            <SheetGLGridAdapter
              datasetPreset="hr-payroll"
              initialRowCount={150}
              height={480}
            />
          )}
        </Card>
      </div>
    );
  }

  // 2. PRODUCTS VIEW
  if (viewId === 'products') {
    return (
      <div className="uxu-stack-md">
        <Card
          variant="glass"
          padding="md"
          eyebrow="PRODUCTS & INVENTORY • SHEETGL STOK MATRİSİ"
          title="Product Catalog & Hardware Inventory"
          subtitle="Tüm ürünlerin, donanım düğümlerinin ve depo stoklarının canlı SheetGL tablosu"
          headerIcon={<Package size={18} />}
        >
          <SheetGLGridAdapter
            datasetPreset="inventory-supply"
            initialRowCount={200}
            height={580}
          />
        </Card>
      </div>
    );
  }

  // 3. FORMS VIEW (B2B / Muhasebe / E-Ticaret Kurumsal Form Stüdyosu)
  if (viewId === 'forms') {
    const isIbanValid = formIban.replace(/\s/g, '').length === 26;
    const isEmailValid = formAdminEmail.includes('@');
    const isTaxValid = formTaxId.length >= 10;

    return (
      <div className="uxu-stack-md">
        <div className="uxu-stage-grid-2">
          {/* Left Column: B2B Cari Hesap, Maskeli Girdiler & Döviz/Vade */}
          <Card
            variant="glass"
            glowOnHover
            eyebrow="FORMS STUDIO • B2B, MUHASEBE & E-TİCARET KONTROLLERİ"
            title="Kurumsal Cari Hesap & e-Fatura Oluşturucu"
            subtitle="Maskeli Input (Telefon, TR IBAN, VKN/TCKN, Kart), Döviz/KDV ve Vade Seçici"
            headerIcon={<FileText size={18} />}
            headerAction={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button
                  variant="glass"
                  size="xs"
                  toggleable
                  statusDot
                  pressed={formEInvoiceSync}
                  leadingIcon={<RefreshCw size={12} />}
                  onToggle={setFormEInvoiceSync}
                >
                  GİB e-Fatura ({formEInvoiceSync ? 'Açık' : 'Kapalı'})
                </Button>
                <Badge tone="success" size="xs" pulse>
                  Canlı Doğrulama
                </Badge>
              </div>
            }
            footer={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  collapsible
                  expanded={formAdvancedExpanded}
                  leadingIcon={<Filter size={14} />}
                  onExpandChange={setFormAdvancedExpanded}
                >
                  {formAdvancedExpanded
                    ? 'Altyapı & SLA Ayarlarını Daralt'
                    : 'Altyapı & SLA Ayarlarını Göster'}
                </Button>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      setFormProjectName('Anadolu Bulut Teknoloji A.Ş.');
                      setFormAmount(248500);
                      setFormQuota(75);
                    }}
                  >
                    Sıfırla
                  </Button>
                  <Button
                    variant="filled"
                    size="sm"
                    leadingIcon={<Sparkles size={15} />}
                    splitAction
                    splitItems={[
                      {
                        id: 'draft',
                        label: 'Taslak Fatura Olarak Kaydet',
                        onClick: () =>
                          notify({
                            title: 'Taslak Kaydedildi',
                            description: `${formProjectName} taslak havuzuna eklendi.`,
                            tone: 'info',
                            placement: 'top-right',
                          }),
                      },
                      {
                        id: 'gib',
                        label: 'GİB e-Fatura Olarak İmzala & Gönder',
                        onClick: () =>
                          notify({
                            title: 'e-Fatura GİB Kuyruğuna İletildi',
                            description: `${formAmount} ${formCurrency} tutarındaki fatura onaylandı.`,
                            tone: 'success',
                            placement: 'bottom-right',
                          }),
                      },
                    ]}
                    onClick={() =>
                      notify({
                        title: 'Kurumsal Form Kaydedildi',
                        description: `${formProjectName} • ${formAmount} ${formCurrency}`,
                        tone: 'success',
                        placement: 'bottom-right',
                      })
                    }
                  >
                    Faturayı & Cariyi Kaydet
                  </Button>
                </div>
              </div>
            }
          >
            <div className="uxu-stack-md">
              <div className="uxu-stage-grid-2">
                <Input
                  label="Kurumsal Cari Unvanı"
                  value={formProjectName}
                  onChange={setFormProjectName}
                  clearable
                  leadingIcon={<Building2 size={15} />}
                  validationState={formProjectName.length > 3 ? 'success' : 'default'}
                  successText="Ticaret sicil kaydı doğrulandı"
                />
                <Input
                  label="Finans / Muhasebe E-Posta"
                  value={formAdminEmail}
                  onChange={setFormAdminEmail}
                  clearable
                  validationState={isEmailValid ? 'success' : 'error'}
                  successText="KEP / e-Fatura alıcı posta kutusu aktif"
                  errorText={
                    !isEmailValid
                      ? 'Lütfen geçerli bir kurumsal e-posta girin'
                      : undefined
                  }
                />
              </div>

              <div className="uxu-stage-grid-2">
                <Input
                  label="Yetkili Telefon (mask='phone')"
                  value={formPhone}
                  onChange={setFormPhone}
                  mask="phone"
                  leadingIcon={<Phone size={15} />}
                />
                <Input
                  label="Vergi Kimlik / TCKN (mask='tax-id')"
                  value={formTaxId}
                  onChange={setFormTaxId}
                  mask="tax-id"
                  prefixText="VKN"
                  maxLength={11}
                  showCount
                  validationState={isTaxValid ? 'success' : 'warning'}
                  warningText="10 haneli VKN veya 11 haneli TCKN giriniz"
                  successText="Mükellef sorgusu başarılı"
                />
              </div>

              <div className="uxu-stage-grid-2">
                <Input
                  label="Banka Hesabı TR IBAN (mask='iban')"
                  value={formIban}
                  onChange={setFormIban}
                  mask="iban"
                  leadingIcon={<Building2 size={15} />}
                  validationState={isIbanValid ? 'success' : 'warning'}
                  successText="TR IBAN 26 hane kontrolü doğrulandı"
                  warningText="TR IBAN 26 karakter olmalıdır"
                />
                <Input
                  label="Kurumsal Ticari Kart (mask='credit-card')"
                  value={formCard}
                  onChange={setFormCard}
                  mask="credit-card"
                  leadingIcon={<CreditCard size={15} />}
                  suffixText="CORP"
                />
              </div>

              <div className="uxu-stage-grid-2">
                <CurrencyInput
                  label="Sözleşme / Fatura Net Tutarı"
                  value={formAmount}
                  onChange={setFormAmount}
                  currency={formCurrency}
                  onCurrencyChange={setFormCurrency}
                  vatRate={20}
                />
                <DateTimePickerInput
                  label="Fatura & Ödeme Vade Tarihi"
                  dateValue={formInvoiceDate}
                  timeValue={formInvoiceTime}
                  onDateChange={setFormInvoiceDate}
                  onTimeChange={setFormInvoiceTime}
                />
              </div>

              {formAdvancedExpanded && (
                <div className="uxu-collapse-demo-panel uxu-stack-md">
                  <SegmentedControl<'tr' | 'eu' | 'us'>
                    label="Birincil Veri Merkezi Bölgesi"
                    value={formRegion}
                    onChange={setFormRegion}
                    fullWidth
                    size="sm"
                    options={[
                      { value: 'tr', label: 'İstanbul (tr-1)' },
                      { value: 'eu', label: 'Frankfurt (eu-1)' },
                      { value: 'us', label: 'Virginia (us-1)' },
                    ]}
                  />
                  <Slider
                    label="Ayrılmış GPU & Bellek Kotası"
                    value={formQuota}
                    onChange={setFormQuota}
                    min={10}
                    max={100}
                    step={5}
                    valueSuffix="%"
                    showTicks
                  />
                  <div className="uxu-stage-grid-2">
                    <Switch
                      label="Otomatik Ölçekleme"
                      description="Yük %80'i aştığında ek düğüm aç"
                      value={formAutoScale}
                      onChange={setFormAutoScale}
                      tone="primary"
                    />
                    <Switch
                      label="Zero-Trust Şifreleme"
                      description="TLS 1.3 + Mali Mühür imzası"
                      value={formZeroTrust}
                      onChange={setFormZeroTrust}
                      tone="success"
                    />
                  </div>
                  <Checkbox
                    label="Kurumsal Hizmet Seviyesi Sözleşmesini (SLA %99.98) ve Mesafeli Ticari Şartları onaylıyorum"
                    value={formTerms}
                    onChange={setFormTerms}
                    tone="primary"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Right Column: Etiketler, Dosya Yükleme, Uyarılar & JSON Çıktısı */}
          <div className="uxu-stack-md">
            <Card
              variant="glass"
              eyebrow="ETİKETLER & BELGE EKLERİ"
              title="Çoklu Etiket Seçimi & Dosya Yükleme Alanı"
              subtitle="MultiSelectTagInput ve sürükle-bırak FileUploadDropzone bileşenleri"
              headerIcon={<Layers size={18} />}
            >
              <div className="uxu-stack-md">
                <MultiSelectTagInput
                  label="Müşteri Segmenti & Muhasebe Etiketleri"
                  tags={formTags}
                  onChange={setFormTags}
                  maxTags={8}
                  helperText="Etiket eklemek için yazıp Enter tuşuna basın veya önerilere tıklayın."
                />
                <FileUploadDropzone
                  label="Sözleşme, Vergi Levhası & Dekont Ekleri"
                  files={formFiles}
                  onChange={setFormFiles}
                />
              </div>
            </Card>

            <Card
              variant="tonal"
              eyebrow="CANLI FORM ÖZETİ • JSON PAYLOAD"
              title="Anlık Doğrulama & ERP Çıktı Önizlemesi"
              subtitle="Form alanlarındaki her değişiklik anında doğrulama motoruna yansır"
              headerIcon={<Sliders size={18} />}
            >
              <div className="uxu-stack-md">
                <Alert
                  tone={isIbanValid && isEmailValid && isTaxValid ? 'success' : 'warning'}
                  variant="tonal"
                  title={
                    isIbanValid && isEmailValid && isTaxValid
                      ? 'Tüm B2B & Muhasebe Doğrulamaları Başarılı'
                      : 'Bazı Alanlar Format Kontrolü Bekliyor'
                  }
                  description="VKN, TR IBAN (26 hane) ve KDV (%20) hesaplamaları GİB UBL-TR standardına uygundur."
                />

                <pre
                  className="uxu-code-block"
                  style={{ margin: 0, fontSize: '0.77rem', maxHeight: 240 }}
                >
                  <code>
                    {JSON.stringify(
                      {
                        companyName: formProjectName,
                        financeEmail: formAdminEmail,
                        phone: formPhone,
                        taxId: formTaxId,
                        iban: formIban,
                        netAmount: formAmount,
                        currency: formCurrency,
                        dueDate: `${formInvoiceDate} ${formInvoiceTime}`,
                        tags: formTags,
                        attachmentsCount: formFiles.length,
                        eInvoiceSync: formEInvoiceSync,
                        region: formRegion,
                        slaAccepted: formTerms,
                      },
                      null,
                      2
                    )}
                  </code>
                </pre>

                <Progress
                  label="Kurumsal Form Tamamlanma Oranı"
                  value={
                    isIbanValid && isEmailValid && isTaxValid && formTerms
                      ? 100
                      : 78
                  }
                  tone="success"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 4. ELEMENTS OVERVIEW VIEW
  if (viewId === 'elements-overview') {
    return (
      <div className="uxu-stack-md">
        <Card
          variant="glass"
          eyebrow="ELEMENTS OVERVIEW • TÜM BİLEŞENLER"
          title="UI Elements & Interactive Component Directory"
          subtitle="Buttons, Alerts, Badges, Cards, Modals, Forms ve Tables bileşenlerine tek tıkla erişin"
          headerIcon={<Layers size={18} />}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 14,
            }}
          >
            {COMPONENT_CATALOG.map((entry) => (
              <Card
                key={entry.id}
                variant="tonal"
                padding="sm"
                interactive
                onClick={() => onSelectElementComponent?.(entry.id)}
              >
                <div className="uxu-stack-xs">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <strong>{entry.name}</strong>
                    <Badge tone="primary" size="xs">
                      {entry.turkishTitle}
                    </Badge>
                  </div>
                  <p
                    style={{
                      fontSize: '0.77rem',
                      color: 'var(--uxu-text-secondary)',
                      margin: '4px 0 8px',
                      lineHeight: 1.45,
                    }}
                  >
                    {entry.summary}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--uxu-primary)',
                      fontWeight: 600,
                    }}
                  >
                    <span>Canlı Playground'u Aç</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 5. REPORTS VIEW
  if (viewId === 'reports') {
    const reportsList = [
      {
        id: 'rep-1',
        title: 'Q3/Q4 Kurumsal Gelir & Büyüme Raporu',
        period: 'Ekim 2026',
        format: 'PDF + XLSX',
        size: '4.8 MB',
        status: 'Hazır',
      },
      {
        id: 'rep-2',
        title: 'Küresel Trafik Kaynakları & Dönüşüm Hunisi Analizi',
        period: 'Son 30 Gün',
        format: 'PDF',
        size: '2.4 MB',
        status: 'Hazır',
      },
      {
        id: 'rep-3',
        title: 'Zero-Trust Güvenlik, SLA (%99.98) ve Uptime Denetimi',
        period: '2026 Yıllık',
        format: 'CSV + JSON',
        size: '8.1 MB',
        status: 'İmzalı',
      },
    ];

    return (
      <div className="uxu-stack-md">
        <Card
          variant="glass"
          eyebrow="REPORTS CENTER • YÖNETİCİ RAPORLARI"
          title="Executive Reports & Audit Exports"
          subtitle="Finansal özetleri, analitik grafik çıktılarını ve SLA denetim kayıtlarını indirin"
          headerIcon={<BarChart2 size={18} />}
        >
          <div className="uxu-stack-sm">
            {reportsList.map((rep) => (
              <div
                key={rep.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 'var(--uxu-radius-md)',
                  background: 'var(--uxu-surface-tonal)',
                  border: '1px solid var(--uxu-border-subtle)',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{rep.title}</strong>
                  <div
                    style={{
                      fontSize: '0.76rem',
                      color: 'var(--uxu-text-secondary)',
                      marginTop: 2,
                    }}
                  >
                    Dönem: {rep.period} • Format: {rep.format} • Boyut: {rep.size}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Badge tone="success" size="xs">
                    {rep.status}
                  </Badge>
                  <Button
                    variant="tonal"
                    size="xs"
                    leadingIcon={<Download size={13} />}
                    onClick={() =>
                      notify({
                        title: 'Rapor İndiriliyor',
                        description: `${rep.title} (${rep.format})`,
                        tone: 'info',
                      })
                    }
                  >
                    İndir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 6. MESSAGES VIEW
  if (viewId === 'messages') {
    const activeMsg =
      MESSAGES_DATA.find((m) => m.id === selectedMsgId) ?? MESSAGES_DATA[0];

    return (
      <div className="uxu-dash-chart-and-feed">
        <Card
          variant="glass"
          eyebrow="MESSAGES INBOX • 3 OKUNMAMIŞ"
          title="Gelen Kutusu (Messages)"
          subtitle="Ekip içi bildirimler ve sistem mesajları"
          headerIcon={<MessageSquare size={18} />}
          headerAction={
            <Badge tone="danger" size="xs" pulse>
              3 Yeni
            </Badge>
          }
        >
          <div className="uxu-stack-sm">
            {MESSAGES_DATA.map((msg) => {
              const isSelected = msg.id === activeMsg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsgId(msg.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--uxu-radius-md)',
                    background: isSelected
                      ? 'var(--uxu-surface-elevated)'
                      : 'var(--uxu-surface-tonal)',
                    border: isSelected
                      ? '1px solid var(--uxu-primary)'
                      : '1px solid var(--uxu-border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={msg.sender} size="xs" status="online" />
                      <strong style={{ fontSize: '0.84rem' }}>{msg.sender}</strong>
                    </div>
                    <span
                      style={{
                        fontSize: '0.73rem',
                        color: 'var(--uxu-text-tertiary)',
                      }}
                    >
                      {msg.time}
                    </span>
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.81rem',
                      marginBottom: 2,
                    }}
                  >
                    {msg.subject}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--uxu-text-secondary)',
                    }}
                  >
                    {msg.preview}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          variant="tonal"
          eyebrow={activeMsg.role.toUpperCase()}
          title={activeMsg.subject}
          subtitle={`${activeMsg.sender} • ${activeMsg.time}`}
        >
          <div className="uxu-stack-md">
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: 'var(--uxu-text-primary)',
                padding: '14px',
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-elevated)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              {activeMsg.body}
            </p>

            <div className="uxu-quick-task-row">
              <Input
                placeholder="Yanıtınızı yazın..."
                value={replyText}
                onChange={setReplyText}
                size="sm"
              />
              <Button
                variant="filled"
                size="sm"
                leadingIcon={<Send size={14} />}
                onClick={() => {
                  if (!replyText.trim()) return;
                  notify({
                    title: 'Yanıt Gönderildi',
                    description: `${activeMsg.sender} kişisine iletildi.`,
                    tone: 'success',
                  });
                  setReplyText('');
                }}
              >
                Gönder
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 7. CALENDAR VIEW
  if (viewId === 'calendar') {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
      <div className="uxu-dash-chart-and-feed">
        <Card
          variant="glass"
          eyebrow="CALENDAR • EKİM 2026 SÜRÜM TAKVİMİ"
          title="Release & Operations Calendar"
          subtitle="Aylık dağıtım planı, bakım pencereleri ve ekip etkinlikleri"
          headerIcon={<CalendarIcon size={18} />}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
            }}
          >
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => (
              <div
                key={d}
                style={{
                  textAlign: 'center',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--uxu-text-secondary)',
                  paddingBottom: 4,
                }}
              >
                {d}
              </div>
            ))}
            {days.map((day) => {
              const ev = CALENDAR_EVENTS.find((e) => e.day === day);
              return (
                <div
                  key={day}
                  style={{
                    minHeight: 62,
                    padding: '6px 8px',
                    borderRadius: 'var(--uxu-radius-sm)',
                    background: ev
                      ? 'var(--uxu-surface-elevated)'
                      : 'var(--uxu-surface-tonal)',
                    border:
                      day === 22
                        ? '1px solid var(--uxu-primary)'
                        : '1px solid var(--uxu-border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: day === 22 ? 800 : 600,
                      color:
                        day === 22
                          ? 'var(--uxu-primary)'
                          : 'var(--uxu-text-secondary)',
                    }}
                  >
                    {day}
                  </span>
                  {ev && (
                    <Badge tone={ev.tone} size="xs">
                      {ev.tag}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          variant="tonal"
          eyebrow="UPCOMING MILESTONES"
          title="Yaklaşan Etkinlikler"
          subtitle="Planlanan sürüm ve denetim takvimi"
        >
          <div className="uxu-stack-sm">
            {CALENDAR_EVENTS.map((ev) => (
              <div
                key={ev.day}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--uxu-radius-md)',
                  background: 'var(--uxu-surface-elevated)',
                  border: '1px solid var(--uxu-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.83rem' }}>{ev.title}</strong>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--uxu-text-secondary)',
                    }}
                  >
                    {ev.day} Ekim 2026 • Saat {ev.time}
                  </div>
                </div>
                <Badge tone={ev.tone} size="xs">
                  {ev.tag}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 8. SETTINGS VIEW
  if (viewId === 'settings') {
    return (
      <div className="uxu-stage-grid-2">
        <Card
          variant="glass"
          eyebrow="ADMIN SETTINGS • GÖRÜNÜM VE TERCİHLER"
          title="Workspace & Appearance Settings"
          subtitle="Değişiklikler anında tüm uygulamaya ve localStorage'a kaydedilir"
          headerIcon={<Settings size={18} />}
        >
          <div className="uxu-stack-md">
            <SegmentedControl
              label="Görünüm Modu (Dark / Light / System)"
              value={preferences.mode}
              onChange={setMode}
              fullWidth
              size="sm"
              options={[
                { value: 'light', label: 'Aydınlık' },
                { value: 'dark', label: 'Karanlık' },
                { value: 'system', label: 'Sistem' },
              ]}
            />
            <Slider
              label="Köşe Yuvarlaklığı (Border Radius px)"
              value={preferences.customRadiusPx ?? 12}
              onChange={setCustomRadiusPx}
              min={0}
              max={32}
              step={1}
              valueSuffix="px"
              showTicks
            />
            <Slider
              label="Genel Yazı Tipi Ölçeği (Font Scale %)"
              value={preferences.fontScale ?? 100}
              onChange={setFontScale}
              min={80}
              max={125}
              step={5}
              valueSuffix="%"
              showTicks
            />
            <Switch
              label="Hareketi Azalt (Reduced Motion)"
              description="Erişilebilirlik için yay animasyonlarını sadeleştirir"
              value={preferences.reducedMotion}
              onChange={setReducedMotion}
            />
          </div>
        </Card>

        <Card
          variant="tonal"
          eyebrow="NOTIFICATION & TELEMETRY"
          title="Bildirim & Sistem Özeti"
          subtitle="Aktif çalışma alanı yapılandırması"
          headerIcon={<Bell size={18} />}
        >
          <div className="uxu-stack-md">
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-elevated)',
                border: '1px solid var(--uxu-border-subtle)',
                fontSize: '0.83rem',
                lineHeight: 1.7,
              }}
            >
              <div>
                <strong>Çözümlenen Tema:</strong> {resolvedMode.toUpperCase()}
              </div>
              <div>
                <strong>Tohum Renk Paleti:</strong> {preferences.seedPalette}
              </div>
              <div>
                <strong>Köşe Yuvarlaklığı:</strong>{' '}
                {preferences.customRadiusPx ?? 12}px ({preferences.radiusScale})
              </div>
              <div>
                <strong>Yazı Ölçeği:</strong> %{preferences.fontScale ?? 100}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 9. SECURITY VIEW
  return (
    <div className="uxu-stage-grid-2">
      <Card
        variant="glass"
        eyebrow="ADMIN SECURITY • ZERO-TRUST KORUMA"
        title="Security & Access Control Center"
        subtitle="Çok faktörlü kimlik doğrulama, IP kısıtlaması ve denetim günlükleri"
        headerIcon={<Shield size={18} />}
        headerAction={
          <Badge tone="success" size="sm" pulse>
            Skor: 98.4 / 100
          </Badge>
        }
      >
        <div className="uxu-stack-md">
          <Switch
            label="Zorunlu Donanım 2FA / Passkey (WebAuthn)"
            description="Tüm yönetici hesapları için FIDO2 anahtarı zorunlu tut"
            value={mfaEnforced}
            onChange={setMfaEnforced}
            tone="success"
          />
          <Switch
            label="Kurumsal IP İzin Listesi (Allowlist)"
            description="Yalnızca doğrulanmış VPN ve kurumsal ağ geçitlerine izin ver"
            value={ipAllowlist}
            onChange={setIpAllowlist}
            tone="primary"
          />
          <Switch
            label="Gerçek Zamanlı SIEM Denetim Akışı"
            description="FileManGL ACL ve SheetGL veri değişikliklerini anlık kaydet"
            value={auditStream}
            onChange={setAuditStream}
            tone="info"
          />
        </div>
      </Card>

      <Card
        variant="tonal"
        eyebrow="ENCRYPTION & KEYS"
        title="Kriptografik Durum & Sertifikalar"
        subtitle="Aktif TLS 1.3 ve kasa anahtarları"
        headerIcon={<Lock size={18} />}
      >
        <div className="uxu-stack-md">
          <Progress
            label="Sertifika Geçerlilik Süresi (342 Gün Kaldı)"
            value={94}
            tone="success"
          />
          <Button
            variant="filled"
            size="sm"
            leadingIcon={<Key size={14} />}
            onClick={() =>
              notify({
                title: 'API Anahtarları Yenilendi',
                description: 'Yeni SHA-512 imzalı anahtar çifti üretildi.',
                tone: 'success',
              })
            }
          >
            Tüm API Anahtarlarını Şimdi Döndür (Rotate)
          </Button>
        </div>
      </Card>
    </div>
  );
};
