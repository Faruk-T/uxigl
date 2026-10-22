import type { PropDocItem } from '../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU DESIGN SYSTEM — COMPREHENSIVE HANDS-ON COMPONENT DOCUMENTATION CATALOG
 * ============================================================================
 * Every component includes:
 * - Practical summary & import statement
 * - Multiple real-world usage examples (title, description, code snippet)
 * - UX Best Practices: Do's & Don'ts
 * - Keyboard & Accessibility (ARIA) specs
 * - Full Props API Reference Table
 */

export type ComponentCategoryId =
  | 'inputs'
  | 'surfaces'
  | 'feedback';

export interface PracticalExampleItem {
  id: string;
  title: string;
  description: string;
  code: string;
}

export interface ComponentCatalogEntry {
  id: string;
  name: string;
  turkishTitle: string;
  category: ComponentCategoryId;
  summary: string;
  importPath: string;
  importStatement: string;
  dos: string[];
  donts: string[];
  accessibilityNotes: string[];
  examples: PracticalExampleItem[];
  propsTable: PropDocItem[];
}

export const COMPONENT_CATEGORIES: {
  id: ComponentCategoryId;
  label: string;
}[] = [
  { id: 'inputs', label: 'Form Kontrolleri' },
  { id: 'surfaces', label: 'Yüzey & Gezinme' },
  { id: 'feedback', label: 'Veri & Durum' },
];

export const COMPONENT_CATALOG: ComponentCatalogEntry[] = [
  {
    id: 'button',
    name: 'Button',
    turkishTitle: 'Eylem Butonu',
    category: 'inputs',
    summary:
      '6 yüzey varyantı (filled, tonal, glass, outlined, ghost, danger), 4 boyut ve yükleme durumu sunan eylem bileşeni.',
    importPath: '@/components/primitives',
    importStatement: "import { Button } from '@/components/primitives';",
    dos: [
      'Birincil eylem için variant="filled" kullanın.',
      'İkincil eylemlerde "tonal" veya "glass" tercih edin.',
      'Asenkron işlemlerde loading={true} aktif edin.',
    ],
    donts: [
      'Yan yana birden fazla "filled" buton kullanmayın.',
      'Sadece ikon içeren butonlarda aria-label unutmayın.',
    ],
    accessibilityNotes: [
      'Tab ile odaklanır, Enter/Space ile tetiklenir.',
      'loading durumunda aria-busy="true" alır.',
    ],
    examples: [
      {
        id: 'btn-variants',
        title: '1. Yüzey Varyantları Hiyerarşisi',
        description:
          'Birincil vurgudan hayalet (ghost) eyleme kadar 6 farklı görsel ağırlık.',
        code: `<div className="uxu-stage-row">
  <Button variant="filled">Kaydet (Filled)</Button>
  <Button variant="tonal">Taslak (Tonal)</Button>
  <Button variant="glass">Önizle (Glass)</Button>
  <Button variant="outlined">Dışa Aktar</Button>
  <Button variant="ghost">Vazgeç</Button>
  <Button variant="danger">Kalıcı Sil</Button>
</div>`,
      },
      {
        id: 'btn-icons-loading',
        title: '2. İkon Yuvaları & Asenkron Yükleme (Loading)',
        description:
          'leadingIcon, trailingIcon ve işlem sırasındaki spinner kullanımı.',
        code: `<div className="uxu-stage-row">
  <Button variant="filled" leadingIcon={<Sparkles size={16} />}>
    Yapay Zeka ile Üret
  </Button>
  <Button variant="tonal" loading loadingText="Sunucuya Gönderiliyor...">
    Gönder
  </Button>
  <Button variant="glass" pill trailingIcon={<Send size={15} />}>
    Hızlı Paylaş
  </Button>
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'variant',
        type: "'filled' | 'tonal' | 'glass' | 'outlined' | 'ghost' | 'danger'",
        defaultValue: "'filled'",
        description: 'Butonun görsel hiyerarşi ve yüzey stilini belirler.',
      },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Yükseklik, iç boşluk ve yazı boyutunu ayarlar.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Aktif olduğunda dönen yükleme ikonu gösterir ve tıklamayı kilitler.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Yükleme esnasında mevcut metnin yerine gösterilecek durum metni.',
      },
      {
        name: 'leadingIcon / trailingIcon',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Metnin soluna veya sağına ikon/bileşen yerleştirmek için kullanılır.',
      },
      {
        name: 'pill',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Tam yuvarlak kapsül (9999px) köşe geometrisini zorlar.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Bulunduğu kapsayıcının %100 genişliğini kaplar.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Sadece ikon içeren kare/daire butonlar için iç boşluğu dengeler.',
      },
    ],
  },
  {
    id: 'input',
    name: 'Input',
    turkishTitle: 'Metin & Arama Girişi',
    category: 'inputs',
    summary:
      'Etiket, doğrulama hatası, karakter sayacı, temizleme düğmesi (clearable) ve kısayol rozeti içeren metin alanı.',
    importPath: '@/components/primitives',
    importStatement: "import { Input } from '@/components/primitives';",
    dos: [
      'Her form alanında açıklayıcı bir label tanımlayın.',
      'Arama kutularında clearable={true} özelliğini açın.',
      'Sınırlı alanlarda maxLength ve showCount kullanın.',
    ],
    donts: [
      'Yalnızca placeholder metnine güvenmeyin.',
    ],
    accessibilityNotes: [
      'useId() ile label ve input otomatik eşleştirilir.',
      'errorText varken aria-invalid="true" alır.',
    ],
    examples: [
      {
        id: 'input-surfaces',
        title: '1. Cam (Glass), Tonal ve Çerçeveli (Outlined) Yüzeyler',
        description:
          'Bulunduğu arka plana göre 3 farklı yüzey varyantı seçilebilir.',
        code: `<div className="uxu-stage-grid-2">
  <Input
    label="Global Arama (Glass)"
    surface="glass"
    value={query}
    onChange={setQuery}
    leadingIcon={<Search size={16} />}
    shortcutHint="⌘K"
    clearable
  />
  <Input
    label="Kurumsal E-Posta (Tonal)"
    surface="tonal"
    type="email"
    value={email}
    onChange={setEmail}
    helperText="Bildirimler bu adrese gönderilecektir."
  />
</div>`,
      },
      {
        id: 'input-validation',
        title: '2. Hata Doğrulaması & Karakter Sayacı',
        description:
          'errorText dolu olduğunda alan otomatik olarak hata rengine bürünür.',
        code: `<Input
  label="API Erişim Anahtarı"
  value={apiKey}
  onChange={setApiKey}
  maxLength={32}
  showCount
  required
  errorText={apiKey.length < 8 ? 'Anahtar en az 8 karakter olmalıdır.' : undefined}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'string / (nextValue: string) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Kontrollü metin değeri ve her tuş vuruşunda tetiklenen geri çağrı.',
      },
      {
        name: 'label',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Giriş alanının üstünde yer alan başlık etiketi.',
      },
      {
        name: 'surface',
        type: "'glass' | 'tonal' | 'outlined'",
        defaultValue: "'glass'",
        description: 'Giriş kutusunun görsel yüzey stili.',
      },
      {
        name: 'helperText / errorText',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Alanın altında görünen bilgilendirme veya kırmızı doğrulama hatası.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Metin varken sağda hızlı temizleme (X) ikonu gösterir.',
      },
      {
        name: 'maxLength / showCount',
        type: 'number / boolean',
        defaultValue: 'undefined / false',
        description: 'Maksimum karakter sınırı ve sağ üstte canlı karakter sayacı (12/42).',
      },
      {
        name: 'shortcutHint',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Sağ kenarda klavye kısayol rozeti (örn. ⌘F veya ESC) görüntüler.',
      },
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    turkishTitle: 'Aç/Kapa Anahtar',
    category: 'inputs',
    summary:
      'Sistem ayarlarını anında açıp kapatmak (On/Off) için kullanılan taktil anahtar.',
    importPath: '@/components/primitives',
    importStatement: "import { Switch } from '@/components/primitives';",
    dos: [
      'Anında devreye giren sistem ayarları için kullanın.',
      'Alt açıklama için description prop’unu ekleyin.',
    ],
    donts: [
      'Çoklu seçim listelerinde Switch yerine Checkbox kullanın.',
    ],
    accessibilityNotes: [
      'role="switch" ve aria-checked niteliklerine sahiptir.',
    ],
    examples: [
      {
        id: 'switch-tones',
        title: '1. Anlamsal Renk Tonları & Açıklamalı Ayar Satırları',
        description:
          'primary, success, warning, danger ve info tonlarıyla durum vurgusu.',
        code: `<div className="uxu-stack-md">
  <Switch
    label="Uzamsal Cam Bulanıklığı (Backdrop Blur)"
    description="Pencere katmanlarında gerçek zamanlı ışık kırılmasını etkinleştirir"
    value={blurEnabled}
    onChange={setBlurEnabled}
    tone="primary"
  />
  <Switch
    label="Otomatik Yedekleme Servisi"
    description="Her 15 dakikada bir bulut kümesine anlık görüntü alır"
    value={backupEnabled}
    onChange={setBackupEnabled}
    tone="success"
  />
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'boolean / (next: boolean) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Anahtarın açık/kapalı durumu ve değişim fonksiyonu.',
      },
      {
        name: 'label / description',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Sol tarafta gösterilen ayar başlığı ve alt açıklama metni.',
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
        defaultValue: "'primary'",
        description: 'Anahtar açıkken kullanılan vurgu rengi.',
      },
      {
        name: 'showThumbIcon',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Topuz (thumb) içinde onay (✓) ve çarpı (✕) ikonlarını gösterir.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        defaultValue: "'md'",
        description: 'Anahtar boyut ölçeği.',
      },
    ],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    turkishTitle: 'Onay Kutusu',
    category: 'inputs',
    summary:
      'Çoklu seçim, tablo satırı işaretleme ve kısmi seçim (indeterminate) destekli onay kutusu.',
    importPath: '@/components/primitives',
    importStatement: "import { Checkbox } from '@/components/primitives';",
    dos: [
      'Kısmi seçimlerde indeterminate={true} kullanın.',
      'Tıklama alanını genişletmek için label prop’u verin.',
    ],
    donts: [
      'Anlık mod geçişlerinde Checkbox yerine Switch seçin.',
    ],
    accessibilityNotes: [
      'role="checkbox" ve aria-checked="mixed" destekler.',
    ],
    examples: [
      {
        id: 'checkbox-states',
        title: '1. Seçili, Kısmi Seçili (Indeterminate) ve Tonlar',
        description: 'İzin matrisleri ve görev listeleri için ideal yapı.',
        code: `<div className="uxu-stack-md">
  <Checkbox
    label="Tüm Okuma ve Yazma İzinlerini Ver"
    description="Yönetici rolü için tam yetki tanımlaması"
    value={allChecked}
    onChange={setAllChecked}
    tone="primary"
  />
  <Checkbox
    label="Alt Modüller (Kısmi Seçim / Indeterminate)"
    value={false}
    indeterminate={true}
    onChange={() => {}}
    tone="warning"
  />
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'boolean / (next: boolean) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Seçim durumu ve değişim geri çağrısı.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Kısmi seçim (-) ikonunu gösterir.',
      },
      {
        name: 'label / description',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Onay kutusunun yanındaki başlık ve alt bilgi metni.',
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
        defaultValue: "'primary'",
        description: 'İşaretlendiğinde kutunun alacağı anlamsal renk.',
      },
    ],
  },
  {
    id: 'slider',
    name: 'Slider',
    turkishTitle: 'Değer Kaydırıcı',
    category: 'inputs',
    summary:
      'Parlaklık, ses, bulanıklık veya yüzde gibi sayısal aralıkları seçmek için kullanılan kaydırıcı.',
    importPath: '@/components/primitives',
    importStatement: "import { Slider } from '@/components/primitives';",
    dos: [
      'Birim göstermek için valueSuffix="%" kullanın.',
      'Kademeli ayarlarda step ve showTicks aktif edin.',
    ],
    donts: [
      'Çok geniş aralıklarda tek başına Slider kullanmayın.',
    ],
    accessibilityNotes: [
      'Yön tuşları ile step değerinde artırılıp azaltılır.',
    ],
    examples: [
      {
        id: 'slider-examples',
        title: '1. İkonlu ve Adım Noktalı (Ticks) Kaydırıcılar',
        description: 'macOS Control Center ve Material 3 tarzı kaydırıcılar.',
        code: `<div className="uxu-stack-md">
  <Slider
    label="Ekran Parlaklığı"
    value={brightness}
    onChange={setBrightness}
    valueSuffix="%"
    leadingIcon={<Sun size={16} />}
  />
  <Slider
    label="Küme Ölçekleme Eşiği"
    value={threshold}
    onChange={setThreshold}
    min={0}
    max={100}
    step={10}
    showTicks
    tone="success"
    valueSuffix=" Düğüm"
  />
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'number / (next: number) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Sayısal değer ve değişim fonksiyonu.',
      },
      {
        name: 'min / max / step',
        type: 'number',
        defaultValue: '0 / 100 / 1',
        description: 'Minimum, maksimum sınırlar ve artış miktarı.',
      },
      {
        name: 'valueSuffix',
        type: 'string',
        defaultValue: "''",
        description: 'Değerin sonuna eklenen birim (%, dB, °C, px).',
      },
      {
        name: 'showTicks',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Kanal üzerinde adım noktalarını görüntüler.',
      },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    turkishTitle: 'Yüzey Kartı',
    category: 'surfaces',
    summary:
      'İçerikleri gruplayan glass, tonal, elevated ve outlined varyantlı temel yüzey kapsayıcısı.',
    importPath: '@/components/composites',
    importStatement: "import { Card } from '@/components/composites';",
    dos: [
      'Başlık ve aksiyon için title ve headerAction kullanın.',
      'Tıklanabilir kartlarda interactive={true} açın.',
    ],
    donts: [
      'İç içe 2 katmandan fazla Glass kart koymayın.',
    ],
    accessibilityNotes: [
      'onClick verildiğinde role="button" ve tabIndex={0} alır.',
    ],
    examples: [
      {
        id: 'card-variants',
        title: '1. Glass, Tonal, Elevated ve Outlined Yüzeyler',
        description: 'Kart başlığı, aksiyon rozeti ve alt çubuk kompozisyonu.',
        code: `<Card
  variant="glass"
  glowOnHover
  eyebrow="SUNUCU KÜMESİ"
  title="Frankfurt M4 Ultra Node"
  subtitle="Son kontrol: 12 saniye önce"
  headerIcon={<Cpu size={20} />}
  headerAction={<Badge tone="success" pulse>Aktif</Badge>}
  footer={
    <div className="uxu-card-footer-row">
      <span>Bant Genişliği: 40 Gbps</span>
      <Button variant="tonal" size="xs">Konsolu Aç</Button>
    </div>
  }
>
  <p>Yüzey içeriği buraya yerleşir.</p>
</Card>`,
      },
    ],
    propsTable: [
      {
        name: 'variant',
        type: "'glass' | 'tonal' | 'elevated' | 'outlined' | 'flat'",
        defaultValue: "'glass'",
        description: 'Kartın arka plan geçirgenliği ve derinlik stili.',
      },
      {
        name: 'title / subtitle / eyebrow',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Kart üst bilgisindeki başlık, alt başlık ve küçük kategori metni.',
      },
      {
        name: 'headerIcon / headerAction',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Başlığın solundaki ikon kutusu ve sağındaki aksiyon/rozet alanı.',
      },
      {
        name: 'footer',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Ayırıcı çizgi ile ayrılmış alt eylem alanı.',
      },
      {
        name: 'interactive / glowOnHover',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Hover durumunda yükselme ve aktif tema rengiyle ışıma efekti.',
      },
    ],
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    turkishTitle: 'Segment Seçici',
    category: 'surfaces',
    summary:
      '2–5 seçenek arasında kayan animasyonlu kapsül (sliding pill) ile anlık görünüm/filtre geçişi sağlar.',
    importPath: '@/components/composites',
    importStatement: "import { SegmentedControl } from '@/components/composites';",
    dos: [
      'Periyot (24S/7G/30G) ve mod seçimlerinde kullanın.',
    ],
    donts: [
      '5’ten fazla seçenekte Tabs bileşenini tercih edin.',
    ],
    accessibilityNotes: [
      'role="tablist" ve aria-selected niteliklerini barındırır.',
    ],
    examples: [
      {
        id: 'segmented-basic',
        title: '1. İkonlu ve Sayaç Rozetli Segment Seçici',
        description: 'Aktif sekme CSS değişkenleriyle 60fps kayarak yer değiştirir.',
        code: `<SegmentedControl
  label="Veri Görünüm Modu"
  value={viewMode}
  onChange={setViewMode}
  fullWidth
  options={[
    { value: 'spatial', label: 'Uzamsal Görünüm', icon: <Sparkles size={15} />, badge: 'Yeni' },
    { value: 'tonal', label: 'Tablo Görünümü', icon: <Layers size={15} />, badge: 24 },
    { value: 'adaptive', label: 'Özet Kartlar', icon: <Zap size={15} /> },
  ]}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'options',
        type: 'SegmentedOption<T>[]',
        defaultValue: '[]',
        required: true,
        description: '{ value, label, icon?, badge?, disabled? } nesnelerinden oluşan dizi.',
      },
      {
        name: 'value / onChange',
        type: 'T / (next: T) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Aktif seçeneğin değeri ve değişim fonksiyonu.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Tüm genişliği eşit bölmeler halinde kaplar.',
      },
    ],
  },
  {
    id: 'tabs-accordion',
    name: 'Tabs & Accordion',
    turkishTitle: 'Sekme & Akordeon',
    category: 'surfaces',
    summary:
      'Ekran içeriklerini yatay sekmelere (Tabs) veya açılır-kapanır panellere (Accordion) böler.',
    importPath: '@/components/composites',
    importStatement: "import { Tabs, Accordion } from '@/components/composites';",
    dos: [
      'Sekmelerde kayıt sayısı için count prop’unu kullanın.',
      'İlk paneli açık başlatmak için defaultExpandedIds verin.',
    ],
    donts: [
      'Sekme başlıklarını 1-2 kelimeden uzun tutmayın.',
    ],
    accessibilityNotes: [
      'Accordion tetikleyicileri aria-expanded üretir.',
    ],
    examples: [
      {
        id: 'tabs-acc-example',
        title: '1. Alt Çizgili / Kapsül Sekmeler ve Akordeon',
        description: 'Sekme değişimi ve çoklu açılabilir akordeon panelleri.',
        code: `<Tabs
  variant="underline"
  activeId={activeTab}
  onChange={setActiveTab}
  items={[
    { id: 'overview', label: 'Genel Bakış', count: 4 },
    { id: 'security', label: 'Güvenlik Duvarı', count: 12 },
  ]}
/>

<Accordion
  allowMultiple
  defaultExpandedIds={['faq-1']}
  items={[
    {
      id: 'faq-1',
      title: 'Dark ve Light Mod Nasıl Değiştirilir?',
      subtitle: 'ThemeProvider ve useTheme kancası',
      content: 'useTheme() içerisindeki setMode("dark" | "light" | "system") fonksiyonunu çağırabilirsiniz.',
    },
  ]}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'items (Tabs)',
        type: 'TabItem[]',
        defaultValue: '[]',
        required: true,
        description: 'Sekme listesi ({ id, label, icon?, count?, disabled? }).',
      },
      {
        name: 'variant (Tabs)',
        type: "'underline' | 'pill'",
        defaultValue: "'underline'",
        description: 'Alt çizgili veya kapsül sekme görünümü.',
      },
      {
        name: 'allowMultiple (Accordion)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Aynı anda birden fazla akordeon panelinin açık kalmasına izin verir.',
      },
    ],
  },
  {
    id: 'modal-command',
    name: 'Modal & CommandPalette',
    turkishTitle: 'Diyalog & Komut Paleti',
    category: 'surfaces',
    summary:
      'Onay pencereleri için Modal; klavye ile hızlı arama ve komut çalıştırmak için CommandPalette (⌘K).',
    importPath: '@/components/composites',
    importStatement: "import { Modal, CommandPalette } from '@/components/composites';",
    dos: [
      'macOS görünümü için showMacTrafficLights aktif edin.',
      'Komut paletini global ⌘K kısayoluna bağlayın.',
    ],
    donts: [
      'Basit bildirimler için Modal yerine useToast kullanın.',
    ],
    accessibilityNotes: [
      'ESC tuşu ve ok tuşlarıyla tam klavye navigasyonu.',
    ],
    examples: [
      {
        id: 'modal-example',
        title: '1. macOS Trafik Işıklı Diyalog ve Komut Paleti',
        description: 'Başlık, gövde ve alt aksiyon butonlarıyla tam kontrol.',
        code: `<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  showMacTrafficLights
  title="Sunucu Kümesini Yeniden Başlat"
  subtitle="Bu işlem aktif bağlantıları 5 saniyeliğine kesintiye uğratabilir."
  footer={
    <div className="uxu-modal-footer-actions">
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Vazgeç</Button>
      <Button variant="danger" onClick={handleRestart}>Yeniden Başlat</Button>
    </div>
  }
>
  <p>Onaylıyor musunuz?</p>
</Modal>`,
      },
    ],
    propsTable: [
      {
        name: 'open / onClose',
        type: 'boolean / () => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Pencerenin açık/kapalı durumu ve kapatma fonksiyonu.',
      },
      {
        name: 'showMacTrafficLights (Modal)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Sol üst köşeye macOS kırmızı/sarı/yeşil pencere kontrollerini ekler.',
      },
      {
        name: 'actions (CommandPalette)',
        type: 'CommandActionItem[]',
        defaultValue: '[]',
        required: true,
        description: 'Aranabilir ve çalıştırılabilir komutların listesi.',
      },
    ],
  },
  {
    id: 'chips-badges',
    name: 'Chip & Badge',
    turkishTitle: 'Filtre Çipi & Rozet',
    category: 'feedback',
    summary:
      'Çoklu filtreleme için etkileşimli Chip; canlı durum ve sayaç gösterimi için Badge.',
    importPath: '@/components/primitives',
    importStatement: "import { Chip, Badge } from '@/components/primitives';",
    dos: [
      'Canlı servislerde Badge pulse={true} özelliğini açın.',
      'Seçilebilir filtrelerde Chip selected={true} kullanın.',
    ],
    donts: [
      'Badge içine 1-2 kelimeden uzun metin yazmayın.',
    ],
    accessibilityNotes: [
      'Tıklanabilir Chip otomatik aria-pressed alır.',
    ],
    examples: [
      {
        id: 'chip-badge-example',
        title: '1. Etkileşimli Filtre Çipleri ve Canlı Sinyal Rozetleri',
        description: 'Seçildiğinde otomatik onay ikonu çıkaran çipler ve nefes alan rozetler.',
        code: `<div className="uxu-stage-row">
  <Chip selected={isSelected} onClick={() => setIsSelected(!isSelected)}>
    Sadece Aktif Düğümler
  </Chip>
  <Chip dismissible onDismiss={() => removeTag('react')}>
    React 19
  </Chip>
  <Badge tone="success" pulse>Sistem Çevrimiçi</Badge>
  <Badge tone="warning" variant="outlined">Bakım Modu</Badge>
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'selected (Chip)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Seçili durumu ve sol onay (✓) ikonunu aktif eder.',
      },
      {
        name: 'dismissible / onDismiss (Chip)',
        type: 'boolean / () => void',
        defaultValue: 'false',
        description: 'Sağ kenara silme (X) düğmesi ekler.',
      },
      {
        name: 'pulse (Badge)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Rozetin soluna nefes alan canlı sinyal noktası ekler.',
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'",
        defaultValue: "'primary'",
        description: 'Anlamsal renk tonu.',
      },
    ],
  },
  {
    id: 'progress-avatar',
    name: 'Progress & Avatar',
    turkishTitle: 'İlerleme & Avatar',
    category: 'feedback',
    summary:
      'Doğrusal/dairesel Progress, çevrimiçi durumlu Avatar/AvatarGroup, Skeleton ve Tooltip bileşenleri.',
    importPath: '@/components/primitives',
    importStatement:
      "import { Progress, Avatar, AvatarGroup, Skeleton, Tooltip } from '@/components/primitives';",
    dos: [
      'Dar alanlarda variant="circular" Progress kullanın.',
      'Çoklu profilde AvatarGroup max={4} tercih edin.',
    ],
    donts: [
      'Yükleme esnasında boş ekran yerine Skeleton kullanın.',
    ],
    accessibilityNotes: [
      'Progress role="progressbar" ve aria-valuenow içerir.',
    ],
    examples: [
      {
        id: 'progress-avatar-example',
        title: '1. Dairesel Halka, Avatar Grubu ve Tooltip',
        description: 'Çevrimiçi durum noktası (online/busy/away) ve grup taşması.',
        code: `<div className="uxu-stage-row">
  <Progress variant="circular" value={84} tone="success" />
  <Tooltip content="Deniz Kaya (Çevrimiçi)" shortcut="⌘1">
    <Avatar name="Deniz Kaya" status="online" shape="squircle" size="lg" />
  </Tooltip>
  <AvatarGroup max={3}>
    <Avatar name="Selin Yılmaz" tone="primary" />
    <Avatar name="Mert Can" tone="success" />
    <Avatar name="Zeynep Ak" tone="warning" />
    <Avatar name="Bora Öz" tone="info" />
  </AvatarGroup>
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'variant (Progress)',
        type: "'linear' | 'circular'",
        defaultValue: "'linear'",
        description: 'Yatay çubuk veya dairesel SVG halka görünümü.',
      },
      {
        name: 'indeterminate / speed (Progress & Skeleton)',
        type: "boolean / 'slow' | 'normal' | 'fast' | number",
        defaultValue: 'false / 2.6s (Progress), 2.8s (Skeleton)',
        description:
          'Belirsiz yükleme animasyonu ve animasyon döngü hızı (ör. speed="slow" veya speed={3.5} saniye).',
      },
      {
        name: 'status (Avatar)',
        type: "'online' | 'busy' | 'away' | 'offline'",
        defaultValue: 'undefined',
        description: 'Sağ alt köşede kullanıcı mevcudiyet durum noktası.',
      },
      {
        name: 'shape (Avatar)',
        type: "'squircle' | 'circle'",
        defaultValue: "'squircle'",
        description: 'Apple Squircle veya tam daire kesim.',
      },
    ],
  },
  {
    id: 'datatable-statcard',
    name: 'SheetGL & Native DataTable',
    turkishTitle: 'SheetGL Çoklu Tablo & Basit Native Tablo',
    category: 'feedback',
    summary:
      'Büyük veri setleri için 4 farklı kurumsal şemaya sahip 60 FPS SheetGL WebGL/Canvas DataGrid (Finans, Bulut Telemetri, İK & Bordro, Stok) ve hafif listeler için 4 varyantlı basit Native HTML <DataTable />.',
    importPath: 'sheetgl / src/components/composites/DataTable',
    importStatement:
      "import { SheetGL } from 'sheetgl';\nimport { DataTable, SheetGLGridAdapter } from './components/composites';",
    dos: [
      'Büyük veri setlerinde (1.000 - 50.000+ satır), Excel formüllerinde ve toplu CRUD işlemlerinde SheetGLGridAdapter (finance-erp, cloud-telemetry, hr-payroll, inventory-supply) kullanın.',
      '5 - 100 satırlık basit özet listeleri, ayar tabloları ve sıfır GPU yükü gereken durumlarda hafif Native <DataTable variant="default | striped | bordered | minimal" /> bileşenini tercih edin.',
      'UXU tema rengini IGridThemeTokens üzerinden SheetGL ile eşitleyin.',
    ],
    donts: [
      'On binlerce satırı klasik DOM tablo düğümleriyle render etmeyin.',
      'Sadece 4-5 satırlık basit bir durum listesi için gereksiz yere ağır WebGL kanvası başlatmayın; Native DataTable kullanın.',
    ],
    accessibilityNotes: [
      'SheetGL: Excel klavye navigasyonu (Ok tuşları, Enter, Tab, Esc, Ctrl+C/V) tam desteklidir.',
      'Native DataTable: Semantik <table>, <thead>, <tbody> ve klavye ile sıralanabilir sütun başlıkları içerir.',
    ],
    examples: [
      {
        id: 'sheetgl-table-example',
        title: '1. SheetGL Çoklu Senaryo Tabloları (Finans, Telemetri, İK, Stok)',
        description:
          '4 hazır kurumsal tablo şeması, 14 sütun tipi, sabit (pinned) sütunlar, Excel formül çubuğu ve alt özet satırı.',
        code: `// 4 farklı kurumsal SheetGL tablo şeması:
// 'finance-erp' | 'cloud-telemetry' | 'hr-payroll' | 'inventory-supply'
<SheetGLGridAdapter
  datasetPreset="finance-erp"
  showPresetSwitcher={true}
  initialRowCount={150}
  height={480}
/>`,
      },
      {
        id: 'native-datatable-example',
        title: '2. Basit Native HTML Tablo (<DataTable />)',
        description:
          'Sıfır WebGL yüküyle çalışan, default / striped / bordered / minimal varyantlı ve checkbox seçimli hafif HTML tablo.',
        code: `<DataTable
  rowKey="id"
  variant="striped" // 'default' | 'striped' | 'bordered' | 'minimal'
  size="md"         // 'sm' | 'md' | 'lg'
  selectable={true}
  searchable={true}
  data={deployments}
  columns={[
    { key: 'service', header: 'Servis', sortable: true },
    { key: 'owner', header: 'Sorumlu', sortable: true },
    { key: 'status', header: 'Durum', align: 'right' },
  ]}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'dataSource / columns (SheetGL)',
        type: 'any[] | IDataStore / ColumnDef[]',
        defaultValue: 'zorunlu',
        required: true,
        description:
          'Veri kaynağı ve 14 sütun tipini (currency, dropdown, multiselect, sparkline vb.) destekleyen sütun tanımları.',
      },
      {
        name: 'theme (SheetGL)',
        type: "'apple-dark' | 'apple-light' | 'google-dark' | 'google-light' | IGridThemeTokens",
        defaultValue: "'apple-dark'",
        description: 'Apple HIG veya Google Material You WebGL/Canvas tema şablonu.',
      },
      {
        name: 'batchEditMode / showFormulaBar',
        type: 'boolean / boolean',
        defaultValue: 'true / true',
        description: 'DevExtreme tarzı toplu CRUD düzenleme ve Excel fx formül çubuğu.',
      },
      {
        name: 'sparklineData (StatCard)',
        type: 'number[]',
        defaultValue: '[28, 42, 36, ...]',
        description: 'SVG mini grafiğini çizen sayısal veri dizisi.',
      },
    ],
  },
  {
    id: 'filemangl-explorer',
    name: 'FileManGL Explorer',
    turkishTitle: 'FileManGL Dosya Yöneticisi',
    category: 'feedback',
    summary:
      'WebGL2 hızlandırmalı 3D Spatial & Disk Haritası görünümleri, Çift Panel (Dual-Pane), Hibrit ACL+POSIX izin motoru ve ZIP arşivleme sunan dosya yöneticisi.',
    importPath: 'filemangl',
    importStatement:
      "import { FileManGL, I18nProvider, DEFAULT_FILE_MANAGER_CONFIG } from 'filemangl';\nimport 'filemangl/style.css';",
    dos: [
      'UXU resolvedMode değerini config.theme ("dark" | "light") ve .theme-light sınıfı ile senkronize edin.',
      'Büyük klasör analizlerinde disk_map_webgl veya spatial_webgl görünümlerini açın.',
      'İki dizin arası hızlı transfer için enableDualPane={true} aktif edin.',
    ],
    donts: [
      'FileManGL bileşenini I18nProvider sarmalayıcısı olmadan çağırmayın.',
    ],
    accessibilityNotes: [
      'Klavye kısayolları (Ctrl+C/X/V, Delete, F2, Ctrl+A) ve sağ tık bağlam menüsü tam desteklidir.',
    ],
    examples: [
      {
        id: 'filemangl-basic-example',
        title: '1. WebGL2 Hızlandırmalı Kurumsal Dosya Yöneticisi (VFS & REST)',
        description:
          'TR/EN/DE/RU çoklu dil, Dual-Pane çift panel ve ACL+POSIX güvenlik denetçisi.',
        code: `<I18nProvider locale="tr" onLocaleChange={setLocale}>
  <div className={resolvedMode === 'light' ? 'theme-light' : 'theme-dark'}>
    <FileManGL
      config={{
        ...DEFAULT_FILE_MANAGER_CONFIG,
        theme: resolvedMode,
        defaultViewMode: 'grid',
        enableDualPane: false,
        enableWebGLAcceleration: true,
      }}
      onConfigChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
    />
  </div>
</I18nProvider>`,
      },
    ],
    propsTable: [
      {
        name: 'config (FileManGL)',
        type: 'IFileManagerConfig',
        defaultValue: 'DEFAULT_FILE_MANAGER_CONFIG',
        required: true,
        description:
          'Görünüm modu, VFS/REST sürücüsü, WebGL2 hızlandırma, Dual-Pane ve ACL/POSIX izin ayarlarını içeren yapılandırma nesnesi.',
      },
      {
        name: 'config.defaultViewMode',
        type: "'grid' | 'details' | 'compact' | 'tiles' | 'spatial_webgl' | 'disk_map_webgl'",
        defaultValue: "'grid'",
        description: 'Klasik liste/grid veya WebGL2 3D uzamsal / Sunburst disk haritası modu.',
      },
      {
        name: 'config.enableDualPane',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Yan yana iki bağımsız gezgin sekmesi (Dual-Pane) açar.',
      },
      {
        name: 'config.driverType',
        type: "'vfs_localstorage' | 'vfs_memory' | 'rest_connector'",
        defaultValue: "'vfs_localstorage'",
        description: 'Sanal Dosya Sistemi (VFS) veya uzak REST API bağlayıcısı.',
      },
    ],
  },
];
