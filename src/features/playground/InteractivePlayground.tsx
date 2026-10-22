import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  Sliders,
  BookOpen,
  Layers,
  ShieldCheck,
  Send,
  Search,
  Bell,
  Volume2,
  Sun,
  Zap,
  Terminal,
  Cpu,
  Globe,
  Lock,
  CheckCircle2,
  XCircle,
  Keyboard,
} from 'lucide-react';
import {
  COMPONENT_CATALOG,
  type ComponentCatalogEntry,
} from '../catalog/componentCatalog';
import {
  Button,
  type ButtonVariant,
  Input,
  type InputSurfaceStyle,
  Switch,
  Slider,
  Badge,
  Chip,
  Avatar,
  AvatarGroup,
  Progress,
  Tooltip,
  Skeleton,
  Checkbox,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  Tabs,
  Accordion,
  Modal,
  StatCard,
  DataTable,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
  type NativeTableVariant,
} from '../../components/composites';
import type {
  ComponentSize,
  SemanticTone,
  SurfaceVariant,
} from '../../core/contracts/ComponentContracts';
import type { RadiusScale } from '../../core/contracts/ThemeContract';
import { CodeGeneratorService } from '../../core/services/CodeGeneratorService';
import { RouteService } from '../../core/services/RouteService';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';

export interface InteractivePlaygroundProps {
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  onOpenCommandPalette: () => void;
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  selectedComponentId,
  onSelectComponent,
  onOpenCommandPalette,
}) => {
  const { preferences, setRadiusScale, setCustomRadiusPx } = useTheme();
  const { notify } = useToast();
  const { copiedText, copy } = useCopyToClipboard();

  const currentRadiusPx =
    typeof preferences.customRadiusPx === 'number'
      ? preferences.customRadiusPx
      : preferences.radiusScale === 'sharp'
      ? 4
      : preferences.radiusScale === 'pill'
      ? 22
      : 12;

  // Shared live playground controls
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('filled');
  const [controlSize, setControlSize] = useState<ComponentSize>('md');
  const [semanticTone, setSemanticTone] = useState<SemanticTone>('primary');
  const [surfaceVariant, setSurfaceVariant] = useState<SurfaceVariant>('glass');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPill, setIsPill] = useState(false);

  // Component interactive states
  const [inputValue, setInputValue] = useState('uxi@design.system');
  const [inputSurface, setInputSurface] = useState<InputSurfaceStyle>('glass');
  const [inputError, setInputError] = useState(false);

  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [sliderValue, setSliderValue] = useState(72);
  const [showSliderTicks, setShowSliderTicks] = useState(true);

  const [segmentValue, setSegmentValue] = useState<
    'spatial' | 'tonal' | 'adaptive'
  >('spatial');
  const [activeTabId, setActiveTabId] = useState('overview');
  const [selectedChips, setSelectedChips] = useState<string[]>([
    'Liquid Glass',
    'Material Design 3',
  ]);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [playgroundTableVariant, setPlaygroundTableVariant] =
    useState<NativeTableVariant>('default');
  const [animDurationSec, setAnimDurationSec] = useState<number>(3.2);
  const [skeletonAnimated, setSkeletonAnimated] = useState<boolean>(true);

  const activeEntry: ComponentCatalogEntry =
    COMPONENT_CATALOG.find((c) => c.id === selectedComponentId) ??
    COMPONENT_CATALOG[0];

  const toggleChip = (tag: string) => {
    setSelectedChips((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Generate dynamic TSX snippet based on current component & prop selections
  const generatedCode = React.useMemo(() => {
    switch (activeEntry.id) {
      case 'button':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Button',
          importPath: activeEntry.importPath,
          props: {
            variant: btnVariant,
            size: controlSize,
            pill: isPill || undefined,
            loading: isLoading || undefined,
            disabled: isDisabled || undefined,
          },
          childrenCode: 'uxiGL Eylemi Başlat',
        });
      case 'input':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Input',
          importPath: activeEntry.importPath,
          props: {
            label: 'Kurumsal E-Posta',
            value: inputValue,
            surface: inputSurface,
            size: controlSize,
            clearable: true,
            shortcutHint: '⌘K',
            errorText: inputError ? 'Geçerli bir adres giriniz' : undefined,
            disabled: isDisabled || undefined,
          },
        });
      case 'switch':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Switch',
          importPath: activeEntry.importPath,
          props: {
            label: 'Uzamsal Cam Efektleri',
            value: switchChecked,
            tone: semanticTone,
            size: controlSize,
            showThumbIcon: true,
            disabled: isDisabled || undefined,
          },
        });
      case 'checkbox':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Checkbox',
          importPath: activeEntry.importPath,
          props: {
            label: 'Tüm İzinleri Onayla',
            value: checkboxChecked,
            tone: semanticTone,
            size: controlSize,
            disabled: isDisabled || undefined,
          },
        });
      case 'slider':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Slider',
          importPath: activeEntry.importPath,
          props: {
            label: 'Akustik Uzamsal Derinlik',
            value: sliderValue,
            min: 0,
            max: 100,
            step: 5,
            tone: semanticTone,
            valueSuffix: '%',
            showTicks: showSliderTicks,
            disabled: isDisabled || undefined,
          },
        });
      case 'segmented-control':
        return CodeGeneratorService.generateSnippet({
          componentName: 'SegmentedControl',
          importPath: activeEntry.importPath,
          props: {
            label: 'Görünüm Modu Seçici',
            value: segmentValue,
            size: controlSize,
            fullWidth: true,
            disabled: isDisabled || undefined,
          },
        });
      case 'chips-badges':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Chip',
          importPath: activeEntry.importPath,
          props: {
            tone: semanticTone,
            size: controlSize,
            pill: isPill || undefined,
            selected: true,
            disabled: isDisabled || undefined,
          },
          childrenCode: 'Liquid Glass & Material 3',
        });
      case 'progress-avatar':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Progress',
          importPath: activeEntry.importPath,
          props: {
            variant: 'circular',
            value: sliderValue,
            tone: semanticTone,
            size: controlSize,
            indeterminate: isLoading || undefined,
            speed: animDurationSec,
          },
        });
      case 'tabs-accordion':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Tabs',
          importPath: activeEntry.importPath,
          props: {
            activeId: activeTabId,
            variant: isPill ? 'pill' : 'underline',
            size: controlSize,
          },
        });
      case 'card':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Card',
          importPath: activeEntry.importPath,
          props: {
            variant: surfaceVariant,
            padding:
              controlSize === 'xs' || controlSize === 'sm'
                ? 'sm'
                : controlSize === 'lg'
                ? 'lg'
                : 'md',
            title: 'Frankfurt M4 Ultra Node',
            subtitle: 'Liquid Glass × Google Material 3 Surface',
            interactive: true,
            glowOnHover: true,
          },
          childrenCode: '<p>Yüzey içeriği buraya yerleşir</p>',
        });
      case 'datatable-statcard':
        return CodeGeneratorService.generateSnippet({
          componentName: 'DataTable',
          importPath: activeEntry.importPath,
          props: {
            rowKey: 'id',
            variant: playgroundTableVariant,
            size:
              controlSize === 'xs' || controlSize === 'sm'
                ? 'sm'
                : controlSize === 'lg'
                ? 'lg'
                : 'md',
            selectable: true,
          },
        });
      case 'filemangl-explorer':
        return `import { FileManGL, I18nProvider, DEFAULT_FILE_MANAGER_CONFIG } from 'filemangl';
import 'filemangl/style.css';

export function CloudFileManagerExample() {
  return (
    <I18nProvider locale="tr" onLocaleChange={() => {}}>
      <FileManGL
        config={{
          ...DEFAULT_FILE_MANAGER_CONFIG,
          theme: 'dark',
          defaultViewMode: 'grid',
          enableDualPane: false,
          enableWebGLAcceleration: true,
        }}
      />
    </I18nProvider>
  );
}`;
      default:
        return CodeGeneratorService.generateSnippet({
          componentName: activeEntry.name.split(',')[0].split(' ')[0],
          importPath: activeEntry.importPath,
          props: {
            size: controlSize,
            tone: semanticTone,
          },
        });
    }
  }, [
    activeEntry,
    btnVariant,
    controlSize,
    isPill,
    isLoading,
    isDisabled,
    inputValue,
    inputSurface,
    inputError,
    switchChecked,
    checkboxChecked,
    semanticTone,
    sliderValue,
    showSliderTicks,
    surfaceVariant,
    segmentValue,
    activeTabId,
    animDurationSec,
    playgroundTableVariant,
  ]);

  const renderLiveStage = (entryId: string) => {
    switch (entryId) {
      case 'button':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-primary-demo">
              <Button
                variant={btnVariant}
                size={controlSize}
                pill={isPill}
                disabled={isDisabled}
                loading={isLoading}
                loadingText="İşleniyor..."
                leadingIcon={<Sparkles size={16} />}
                onClick={() =>
                  notify({
                    title: 'Button Etkileşimi Tetiklendi',
                    description: `Varyant: ${btnVariant} • Boyut: ${controlSize}`,
                    tone: 'primary',
                  })
                }
              >
                uxiGL Eylemi Başlat
              </Button>
            </div>

            <div className="uxu-stage-divider" />

            <div className="uxu-stage-matrix-label">
              Tüm Yüzey Varyantları (Tıklayarak Aktif Varyantı Seçin)
            </div>
            <div className="uxu-stage-row">
              {(
                [
                  'filled',
                  'tonal',
                  'glass',
                  'outlined',
                  'ghost',
                  'danger',
                ] as ButtonVariant[]
              ).map((v) => (
                <Button
                  key={v}
                  variant={v}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  loading={isLoading}
                  onClick={() => setBtnVariant(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Input
                label="Spotlight & Material Hibrit Giriş"
                placeholder="Komut veya e-posta yazın..."
                value={inputValue}
                onChange={setInputValue}
                surface={inputSurface}
                size={controlSize}
                disabled={isDisabled}
                clearable
                shortcutHint="⌘K"
                leadingIcon={<Search size={16} />}
                helperText="Sağdaki X ikonuyla metni tek tıkla temizleyebilirsiniz."
                errorText={
                  inputError
                    ? 'Format doğrulaması başarısız oldu.'
                    : undefined
                }
              />

              <Input
                label="Karakter Sayaçlı Güvenlik Anahtarı"
                placeholder="API anahtarınızı girin..."
                value={inputValue}
                onChange={setInputValue}
                surface="tonal"
                size={controlSize}
                disabled={isDisabled}
                maxLength={42}
                showCount
                leadingIcon={<Lock size={16} />}
                helperText="maxLength={42} ve showCount={true} aktif."
              />
            </div>

            <div className="uxu-stage-row">
              <Button
                variant="tonal"
                size="sm"
                onClick={() => setInputError((prev) => !prev)}
              >
                {inputError ? 'Hata Durumunu Kaldır' : 'Hata Durumunu Test Et'}
              </Button>
              {(['glass', 'tonal', 'outlined'] as InputSurfaceStyle[]).map(
                (surf) => (
                  <Button
                    key={surf}
                    variant={inputSurface === surf ? 'filled' : 'outlined'}
                    size="sm"
                    onClick={() => setInputSurface(surf)}
                  >
                    Yüzey: {surf}
                  </Button>
                )
              )}
            </div>
          </div>
        );

      case 'switch':
      case 'checkbox':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant="glass"
                padding="md"
                title="Switch — Taktil Anahtar Kontrolleri"
                subtitle="Anlık devreye giren sistem ayarları için"
              >
                <div className="uxu-stack-md">
                  <Switch
                    label="Uzamsal Cam Efektleri (Vibrancy)"
                    description="Arka plan bulanıklığı ve speküler kenar yansıması"
                    value={switchChecked}
                    onChange={setSwitchChecked}
                    tone={semanticTone}
                    size={controlSize}
                    disabled={isDisabled}
                  />
                  <Switch
                    label="Dinamik Tohum Renk Uyumu"
                    description="Material You tonal palet motorunu etkinleştir"
                    value={!switchChecked}
                    onChange={(v) => setSwitchChecked(!v)}
                    tone="success"
                    size={controlSize}
                    disabled={isDisabled}
                  />
                </div>
              </Card>

              <Card
                variant="tonal"
                padding="md"
                title="Checkbox — Onay Kutusu & Indeterminate"
                subtitle="Çoklu seçim listeleri ve sözleşme onayları için"
              >
                <div className="uxu-stack-md">
                  <Checkbox
                    label="Okuma, Yazma ve Dağıtım İzinlerini Onayla"
                    description="Yönetici rolü için tam yetki ataması"
                    value={checkboxChecked}
                    onChange={setCheckboxChecked}
                    tone={semanticTone}
                    size={controlSize}
                    disabled={isDisabled}
                  />
                  <Checkbox
                    label="Alt Küme Servisleri (Kısmi Seçim / Indeterminate)"
                    description="indeterminate={true} olduğunda eksi (-) ikonu görünür"
                    value={false}
                    indeterminate={true}
                    onChange={() => setCheckboxChecked((prev) => !prev)}
                    tone="warning"
                    size={controlSize}
                    disabled={isDisabled}
                  />
                </div>
              </Card>
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant="glass"
                padding="md"
                title="macOS Control Center Kaydırıcı"
              >
                <div className="uxu-stack-md">
                  <Slider
                    label="Ekran Parlaklığı & True Tone"
                    value={sliderValue}
                    onChange={setSliderValue}
                    min={0}
                    max={100}
                    step={5}
                    tone={semanticTone}
                    size={controlSize}
                    disabled={isDisabled}
                    showTicks={showSliderTicks}
                    valueSuffix="%"
                    leadingIcon={<Sun size={16} />}
                  />
                  <Slider
                    label="Uzamsal Ses Seviyesi (Spatial Audio)"
                    value={Math.max(10, 100 - sliderValue)}
                    onChange={(v) => setSliderValue(100 - v)}
                    min={0}
                    max={100}
                    step={10}
                    tone="success"
                    size={controlSize}
                    disabled={isDisabled}
                    showTicks={showSliderTicks}
                    valueSuffix=" dB"
                    leadingIcon={<Volume2 size={16} />}
                  />
                </div>
              </Card>

              <div className="uxu-stack-md">
                <Switch
                  label="Adım Noktalarını (showTicks) Göster"
                  value={showSliderTicks}
                  onChange={setShowSliderTicks}
                />
                <Progress
                  label="Kaydırıcı ile Senkronize İlerleme Çubuğu"
                  value={sliderValue}
                  tone={semanticTone}
                  size={controlSize}
                />
              </div>
            </div>
          </div>
        );

      case 'segmented-control':
        return (
          <div className="uxu-stage-showcase">
            <SegmentedControl
              label="Görünüm Modu Seçici (Sliding Pill)"
              value={segmentValue}
              onChange={setSegmentValue}
              size={controlSize}
              disabled={isDisabled}
              fullWidth
              options={[
                {
                  value: 'spatial',
                  label: 'Spatial Liquid Glass',
                  icon: <Sparkles size={15} />,
                  badge: 'Glass',
                },
                {
                  value: 'tonal',
                  label: 'Google Material Tonal',
                  icon: <Layers size={15} />,
                  badge: 'M3',
                },
                {
                  value: 'adaptive',
                  label: 'uxiGL Hibrit Sentez',
                  icon: <Zap size={15} />,
                  badge: 'Pro',
                },
              ]}
            />

            <Card
              variant={segmentValue === 'tonal' ? 'tonal' : 'glass'}
              title={`Seçili Görünüm: ${segmentValue.toUpperCase()}`}
              subtitle="Kayan kapsül (thumb) CSS değişkenleri ile akıcı yay fiziği kullanır."
            >
              <p className="uxu-muted-p">
                Seçeneklerde ikon (<code>icon</code>), sayaç rozeti (
                <code>badge</code>) ve devre dışı bırakma (<code>disabled</code>
                ) özellikleri doğrudan tanımlanabilir.
              </p>
            </Card>
          </div>
        );

      case 'card':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant={surfaceVariant}
                padding={
                  controlSize === 'xs' || controlSize === 'sm'
                    ? 'sm'
                    : controlSize === 'lg'
                    ? 'lg'
                    : 'md'
                }
                interactive
                glowOnHover
                eyebrow="SUNUCU KÜMESİ"
                title="Çok Katmanlı Yüzey Kartı"
                subtitle="Sağdaki listeden Glass, Tonal, Elevated ve Outlined modlarını deneyin."
                headerIcon={<Layers size={20} />}
                headerAction={
                  <Badge
                    tone={semanticTone}
                    size={controlSize}
                    pill={isPill}
                    pulse
                  >
                    Canlı
                  </Badge>
                }
                footer={
                  <div className="uxu-card-footer-row">
                    <span className="uxu-text-xs">Son senkron: Şimdi</span>
                    <Button
                      variant="tonal"
                      size={controlSize}
                      pill={isPill}
                      loading={isLoading}
                      disabled={isDisabled}
                    >
                      Detayları İncele
                    </Button>
                  </div>
                }
              >
                <p className="uxu-muted-p">
                  Kart bileşeni; üst başlık, alt başlık, ikon, sağ aksiyon rozeti
                  ve alt çubuk (footer) alanlarını hazır prop olarak sunar.
                </p>
              </Card>

              <div className="uxu-stack-md">
                {(
                  ['glass', 'tonal', 'elevated', 'outlined'] as SurfaceVariant[]
                ).map((v) => (
                  <Card
                    key={v}
                    variant={v}
                    padding="sm"
                    interactive
                    onClick={() => setSurfaceVariant(v)}
                  >
                    <div className="uxu-card-footer-row">
                      <strong>Yüzey Varyantı: {v.toUpperCase()}</strong>
                      <Badge
                        tone={surfaceVariant === v ? semanticTone : 'neutral'}
                        variant={surfaceVariant === v ? 'filled' : 'tonal'}
                        size={controlSize}
                        pill={isPill}
                      >
                        {surfaceVariant === v ? 'Aktif' : 'Seç'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'chips-badges':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-matrix-label">
              Etkileşimli Filtre Çipleri (Tıklayarak Seçimi Değiştirin)
            </div>
            <div className="uxu-stage-row">
              {[
                'Liquid Glass',
                'Material Design 3',
                'Dark / Light Mode',
                'Responsive Grid',
                '120Hz Motion',
              ].map((tag) => (
                <Chip
                  key={tag}
                  selected={selectedChips.includes(tag)}
                  tone={semanticTone}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  onClick={() => toggleChip(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>

            <div className="uxu-stage-divider" />

            <div className="uxu-stage-matrix-label">
              Durum Rozetleri (Canlı Sinyal &amp; Anlamsal Tonlar)
            </div>
            <div className="uxu-stage-row">
              <Badge
                tone={semanticTone}
                variant="tonal"
                pulse
                size={controlSize}
                pill={isPill}
              >
                Sistem Aktif ({semanticTone})
              </Badge>
              <Badge
                tone="success"
                variant="glass"
                pulse
                size={controlSize}
                pill={isPill}
              >
                %99.98 Çalışma Süresi
              </Badge>
              <Badge
                tone="warning"
                variant="outlined"
                size={controlSize}
                pill={isPill}
              >
                Bellek Optimizasyonu
              </Badge>
              <Badge
                tone="danger"
                variant="filled"
                size={controlSize}
                pill={isPill}
              >
                Kritik Uyarı (2)
              </Badge>
              <Badge
                tone="info"
                variant="tonal"
                size={controlSize}
                pill={isPill}
              >
                v2.5 Spatial
              </Badge>
            </div>
          </div>
        );

      case 'progress-avatar':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant="glass"
                title="Dairesel & Doğrusal İlerleme (Progress)"
                subtitle="Sağdaki Boyut (XS/SM/MD/LG), Ton ve Yükleniyor ayarlarına anında tepki verir"
              >
                <div className="uxu-stage-row" style={{ marginBottom: 16 }}>
                  <Progress
                    variant="circular"
                    value={sliderValue}
                    indeterminate={isLoading}
                    speed={animDurationSec}
                    tone={semanticTone}
                    size={controlSize}
                  />
                  <Progress
                    variant="circular"
                    value={88}
                    tone="success"
                    size={controlSize}
                  />
                  <Progress
                    variant="circular"
                    value={64}
                    tone="warning"
                    size={controlSize}
                  />
                  <Progress
                    variant="circular"
                    indeterminate={skeletonAnimated || isLoading}
                    value={skeletonAnimated || isLoading ? 0 : 45}
                    speed={animDurationSec}
                    tone="info"
                    size={controlSize}
                  />
                </div>

                <div className="uxu-stack-md">
                  <Progress
                    label="Bulut Yedekleme & Dosya Aktarım İlerlemesi"
                    value={sliderValue}
                    indeterminate={isLoading}
                    speed={skeletonAnimated || isLoading ? animDurationSec : undefined}
                    tone={semanticTone}
                    size={controlSize}
                  />

                  <Slider
                    label="İlerleme Yüzdesi (%)"
                    value={sliderValue}
                    min={0}
                    max={100}
                    step={1}
                    size={controlSize}
                    tone={semanticTone}
                    disabled={isDisabled}
                    valueSuffix="%"
                    onChange={setSliderValue}
                  />
                </div>
              </Card>

              <Card
                variant="tonal"
                title="Squircle / Daire Avatarlar, Tooltip & Skeleton"
                subtitle="Boyut (XS/SM/MD/LG) ve Kapsül Köşe (Squircle / Circle) ile ölçeklenir"
              >
                <div className="uxu-stage-row" style={{ marginBottom: 16 }}>
                  <Tooltip
                    content="Deniz Kaya • Baş Mimar (Çevrimiçi)"
                    shortcut="⌘1"
                  >
                    <Avatar
                      name="Deniz Kaya"
                      status="online"
                      tone={semanticTone}
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                  </Tooltip>
                  <Tooltip content="Selin Yılmaz • UI/UX Direktörü (Meşgul)">
                    <Avatar
                      name="Selin Yılmaz"
                      status="busy"
                      tone="danger"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                  </Tooltip>
                  <AvatarGroup
                    max={3}
                    size={controlSize}
                    shape={isPill ? 'circle' : 'squircle'}
                  >
                    <Avatar
                      name="Arda Demir"
                      tone="success"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Zeynep Ak"
                      tone="warning"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Mert Can"
                      tone="info"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Elif Su"
                      tone="primary"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Bora Öz"
                      tone="secondary"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                  </AvatarGroup>
                </div>

                <div className="uxu-stack-md">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={controlSize === 'xs' ? 34 : controlSize === 'lg' ? 52 : 42}
                      height={controlSize === 'xs' ? 34 : controlSize === 'lg' ? 52 : 42}
                      animated={skeletonAnimated}
                      speed={animDurationSec}
                      style={{ flexShrink: 0 }}
                    />
                    <div className="uxu-stack-sm" style={{ flex: 1, minWidth: 0 }}>
                      <Skeleton
                        variant="text"
                        width="75%"
                        height={controlSize === 'xs' ? 10 : controlSize === 'lg' ? 18 : 14}
                        animated={skeletonAnimated}
                        speed={animDurationSec}
                      />
                      <Skeleton
                        variant="squircle"
                        width="100%"
                        height={controlSize === 'xs' ? 24 : controlSize === 'lg' ? 40 : 30}
                        animated={skeletonAnimated}
                        speed={animDurationSec}
                      />
                    </div>
                    <Progress
                      variant="circular"
                      indeterminate={skeletonAnimated || isLoading}
                      value={skeletonAnimated || isLoading ? 0 : 75}
                      speed={animDurationSec}
                      tone="info"
                      size={controlSize === 'lg' ? 'md' : 'sm'}
                    />
                  </div>

                  <Slider
                    label="Döngü & Shimmer Süresi (Yüksek sn = Daha Yavaş)"
                    value={animDurationSec}
                    min={0.8}
                    max={6.0}
                    step={0.2}
                    size={controlSize}
                    valueSuffix=" sn"
                    tone="info"
                    disabled={isDisabled}
                    onChange={setAnimDurationSec}
                  />

                  <Switch
                    size={controlSize}
                    tone={semanticTone}
                    disabled={isDisabled}
                    label="Dönen Halka & İskelet Animasyonu"
                    description="Kapatıldığında dönen halka ve iskelet (shimmer) hareketi durur"
                    value={skeletonAnimated}
                    onChange={setSkeletonAnimated}
                  />
                </div>
              </Card>
            </div>
          </div>
        );

      case 'modal-command':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-row">
              <Button
                variant="filled"
                size={controlSize}
                pill={isPill}
                disabled={isDisabled}
                loading={isLoading}
                leadingIcon={<Layers size={16} />}
                onClick={() => setDemoModalOpen(true)}
              >
                macOS &amp; Material Hibrit Diyaloğu Aç
              </Button>
              <Button
                variant="glass"
                size={controlSize}
                pill={isPill}
                disabled={isDisabled}
                leadingIcon={<Terminal size={16} />}
                onClick={onOpenCommandPalette}
              >
                Spotlight Komut Paletini Aç (⌘K)
              </Button>
              <Button
                variant="tonal"
                size={controlSize}
                pill={isPill}
                disabled={isDisabled}
                leadingIcon={<Bell size={16} />}
                onClick={() =>
                  notify({
                    title: 'Canlı Sistem Bildirimi',
                    description: 'İşlem başarıyla sıraya alındı.',
                    tone: semanticTone,
                    actionLabel: 'Geri Al',
                    onAction: () => {},
                  })
                }
              >
                Canlı Bildirim (Toast) Gönder
              </Button>
            </div>

            <Modal
              open={demoModalOpen}
              onClose={() => setDemoModalOpen(false)}
              showMacTrafficLights
              title="Sunucu Kümesi Yapılandırma Onayı"
              subtitle="Liquid Glass Sheet + Google Material 3 Dialog"
              icon={<ShieldCheck size={20} />}
              footer={
                <div className="uxu-modal-footer-actions">
                  <Button
                    variant="ghost"
                    onClick={() => setDemoModalOpen(false)}
                  >
                    Vazgeç
                  </Button>
                  <Button
                    variant="filled"
                    leadingIcon={<Send size={15} />}
                    onClick={() => {
                      setDemoModalOpen(false);
                      notify({
                        title: 'Değişiklikler Kaydedildi',
                        description:
                          'Tasarım tokenları başarıyla senkronize edildi.',
                        tone: 'success',
                      });
                    }}
                  >
                    Onayla ve Uygula
                  </Button>
                </div>
              }
            >
              <p className="uxu-muted-p">
                Bu pencere klavyeden <code>ESC</code> tuşuna basıldığında veya
                bulanık arka plana tıklandığında otomatik olarak kapanır.
              </p>
            </Modal>
          </div>
        );

      case 'tabs-accordion':
        return (
          <div className="uxu-stage-showcase">
            <Tabs
              items={[
                {
                  id: 'overview',
                  label: 'Genel Bakış',
                  icon: <Sparkles size={15} />,
                  count: 4,
                  disabled: isDisabled,
                },
                {
                  id: 'tokens',
                  label: 'Tasarım Tokenları',
                  icon: <Sliders size={15} />,
                  count: 24,
                  disabled: isDisabled,
                },
                {
                  id: 'security',
                  label: 'Güvenlik Kuralları',
                  icon: <ShieldCheck size={15} />,
                  count: 5,
                  disabled: isDisabled,
                },
              ]}
              activeId={activeTabId}
              onChange={setActiveTabId}
              variant={isPill ? 'pill' : 'underline'}
              size={controlSize}
            />

            <Accordion
              variant={
                surfaceVariant === 'tonal' || surfaceVariant === 'outlined'
                  ? surfaceVariant
                  : 'glass'
              }
              defaultExpandedIds={['acc-1']}
              items={[
                {
                  id: 'acc-1',
                  title: '1. Sekme ve Akordeon Ne Zaman Kullanılmalı?',
                  subtitle: 'Bilgi mimarisi ve sayfa içi gezinme rehberi',
                  icon: <Sparkles size={17} />,
                  content:
                    'Farklı içerik görünümleri arasında geçiş yapmak için Tabs; sıkça sorulan sorular veya daraltılabilir ayar grupları için Accordion tercih edilmelidir.',
                },
                {
                  id: 'acc-2',
                  title: '2. Çoklu Açılım (allowMultiple) Özelliği',
                  subtitle: 'Aynı anda birden fazla paneli açık tutma',
                  icon: <Layers size={17} />,
                  content:
                    'Accordion bileşenine allowMultiple={true} prop’u verildiğinde kullanıcı bir paneli açtığında diğer açık paneller kapanmaz.',
                },
              ]}
            />
          </div>
        );

      case 'datatable-statcard':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <StatCard
                label="Toplam Bulut İşlem Kapasitesi"
                value="148.6 TFLOPS"
                delta="+18.4%"
                trend="up"
                tone={semanticTone}
                subtitle="Son 24 saatlik küme ortalaması"
                icon={<Cpu size={18} />}
                sparklineData={[32, 45, 41, 64, 72, 85, 96]}
              />
              <StatCard
                label="Küresel Uç Gecikmesi (Edge Latency)"
                value="11.2 ms"
                delta="-3.1 ms"
                trend="up"
                tone="success"
                subtitle="İstanbul • Frankfurt • Tokyo"
                icon={<Globe size={18} />}
                sparklineData={[22, 19, 17, 15, 14, 12, 11]}
              />
            </div>

            {/* 1. SheetGL Multi-Scenario WebGL Enterprise DataGrid */}
            <SheetGLGridAdapter initialRowCount={150} height={440} />

            {/* 2. Simple Lightweight Native HTML DataTable */}
            <Card
              variant="tonal"
              padding="md"
              eyebrow="UXIGL NATIVE HTML TABLE (BASİT VE HAFİF TABLO)"
              title="Basit Native Tablo Tasarımı (<DataTable />)"
              subtitle="Sıfır WebGL yüküyle çalışan, 4 görsel varyantlı ve satır seçimi destekli semantik HTML tablo"
              headerAction={
                <SegmentedControl
                  size="sm"
                  value={playgroundTableVariant}
                  onChange={setPlaygroundTableVariant}
                  options={[
                    { value: 'default', label: 'Standart' },
                    { value: 'striped', label: 'Zebra' },
                    { value: 'bordered', label: 'Çerçeveli' },
                    { value: 'minimal', label: 'Minimal' },
                  ]}
                />
              }
            >
              <DataTable
                rowKey="id"
                variant={playgroundTableVariant}
                size={
                  controlSize === 'xs' || controlSize === 'sm'
                    ? 'sm'
                    : controlSize === 'lg' || controlSize === 'xl'
                    ? 'lg'
                    : 'md'
                }
                selectable
                data={[
                  {
                    id: '1',
                    module: '@uxigl/core-tokens',
                    version: 'v2.5.0',
                    bundleSize: '4.2 kB',
                    status: 'Stable',
                  },
                  {
                    id: '2',
                    module: '@uxigl/native-table',
                    version: 'v2.5.0',
                    bundleSize: '3.1 kB',
                    status: 'Stable',
                  },
                  {
                    id: '3',
                    module: 'sheetgl-adapter',
                    version: 'v2.0.0',
                    bundleSize: '60.7 kB (gzip)',
                    status: 'WebGL',
                  },
                  {
                    id: '4',
                    module: 'filemangl-vfs',
                    version: 'v1.0.4',
                    bundleSize: '93.1 kB (gzip)',
                    status: 'WebGL2',
                  },
                ]}
                columns={[
                  {
                    key: 'module',
                    header: 'Paket Adı',
                    sortable: true,
                    render: (r) => (
                      <code className="uxu-prop-name">{String(r.module)}</code>
                    ),
                  },
                  {
                    key: 'version',
                    header: 'Sürüm',
                    sortable: true,
                  },
                  {
                    key: 'bundleSize',
                    header: 'Boyut',
                    sortable: true,
                  },
                  {
                    key: 'status',
                    header: 'Mimari',
                    align: 'right',
                    render: (r) => (
                      <Badge
                        size={controlSize === 'lg' ? 'sm' : 'xs'}
                        pill={isPill}
                        tone={r.status === 'Stable' ? 'success' : semanticTone}
                      >
                        {String(r.status)}
                      </Badge>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        );

      case 'filemangl-explorer':
        return (
          <div className="uxu-stage-showcase">
            <FileManGLExplorerAdapter height={540} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="uxu-playground-main">
      {/* Compact Horizontal Component Strip (Quick Switcher) */}
      <div className="uxu-catalog-strip">
        {COMPONENT_CATALOG.map((item) => {
          const isSelected = item.id === activeEntry.id;
          const compHref = RouteService.buildComponentPath(item.id);
          return (
            <a
              key={item.id}
              href={compHref}
              title={compHref}
              className={`uxu-cat-pill ${
                isSelected ? 'uxu-cat-pill--active' : ''
              }`}
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onSelectComponent(item.id);
              }}
            >
              {item.name}
            </a>
          );
        })}
      </div>

      {/* 1. Component Header & Copyable Import Bar */}
      <Card variant="glass" padding="md" className="uxu-component-hero">
        <div className="uxu-component-hero__top">
          <div>
            <div className="uxu-component-hero__badges">
              <Badge tone="primary" variant="tonal" size="xs">
                {activeEntry.importPath}
              </Badge>
              <Badge tone="info" variant="tonal" size="xs">
                Route: {RouteService.buildComponentPath(activeEntry.id)}
              </Badge>
              <Badge tone="success" variant="outlined" size="xs">
                {activeEntry.examples.length} Örnek
              </Badge>
              <Badge tone="info" variant="outlined" size="xs">
                {activeEntry.propsTable.length} Prop
              </Badge>
            </div>
            <h1 className="uxu-component-hero__title">
              {activeEntry.name}{' '}
              <span className="uxu-component-hero__subtitle">
                — {activeEntry.turkishTitle}
              </span>
            </h1>
            <p className="uxu-component-hero__desc">{activeEntry.summary}</p>
          </div>
        </div>

        {/* Copyable Import Bar */}
        <div className="uxu-import-bar">
          <code className="uxu-import-bar__code">
            {CodeGeneratorService.tokenize(activeEntry.importStatement).map(
              (tok, idx) =>
                tok.type === 'plain' ? (
                  <React.Fragment key={idx}>{tok.value}</React.Fragment>
                ) : (
                  <span key={idx} className={`uxu-syn-${tok.type}`}>
                    {tok.value}
                  </span>
                )
            )}
          </code>
          <Button
            variant="tonal"
            size="xs"
            leadingIcon={
              copiedText === activeEntry.importStatement ? (
                <Check size={13} />
              ) : (
                <Copy size={13} />
              )
            }
            onClick={() => {
              copy(activeEntry.importStatement);
              notify({
                title: 'Kopyalandı',
                description: activeEntry.importStatement,
                tone: 'success',
              });
            }}
          >
            {copiedText === activeEntry.importStatement
              ? 'Kopyalandı'
              : 'Kopyala'}
          </Button>
        </div>
      </Card>

      {/* 2. Live Interactive Sandbox + Prop Inspector */}
      <div className="uxu-stage-and-inspector">
        <Card
          variant="glass"
          padding="md"
          title="Canlı Önizleme"
          subtitle="Sağ panelden özellikleri değiştirin"
          headerIcon={<Sliders size={17} />}
        >
          {renderLiveStage(activeEntry.id)}
        </Card>

        {/* Right Live Prop Controls (Context-Aware Inspector) */}
        <Card
          variant="tonal"
          padding="md"
          title="Prop Ayarları"
          subtitle={`${activeEntry.name.split(',')[0]} için canlı denetçi`}
          headerIcon={<Sliders size={16} />}
          headerAction={
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setControlSize('md');
                setSemanticTone('primary');
                setBtnVariant('filled');
                setInputSurface('glass');
                setSurfaceVariant('glass');
                setPlaygroundTableVariant('default');
                setIsDisabled(false);
                setIsLoading(false);
                setIsPill(false);
                setInputError(false);
                setSliderValue(72);
                setAnimDurationSec(3.2);
                setSkeletonAnimated(true);
              }}
            >
              Sıfırla
            </Button>
          }
        >
          <div className="uxu-inspector-controls">
            {/* 1. Universal Size Selector */}
            <div className="uxu-inspector-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="uxu-inspector-label">Boyut (size)</span>
                <Badge size="xs" tone="info" variant="outlined">
                  {controlSize.toUpperCase()}
                </Badge>
              </div>
              <SegmentedControl<ComponentSize>
                value={controlSize}
                onChange={setControlSize}
                size="sm"
                fullWidth
                options={[
                  { value: 'xs', label: 'XS' },
                  { value: 'sm', label: 'SM' },
                  { value: 'md', label: 'MD' },
                  { value: 'lg', label: 'LG' },
                ]}
              />
            </div>

            {/* 2. Universal Semantic Tone Selector */}
            <div className="uxu-inspector-group">
              <span className="uxu-inspector-label">Anlamsal Ton (tone)</span>
              <div className="uxu-tone-chips">
                {(
                  [
                    'primary',
                    'success',
                    'warning',
                    'danger',
                    'info',
                  ] as SemanticTone[]
                ).map((t) => (
                  <Chip
                    key={t}
                    size="sm"
                    tone={t}
                    selected={semanticTone === t}
                    onClick={() => setSemanticTone(t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            {/* 2.5 Global & Component Border Radius Control */}
            <div className="uxu-inspector-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="uxu-inspector-label">
                  Border Radius (Köşe Yuvarlaklığı)
                </span>
                <Badge size="xs" tone="primary" variant="tonal">
                  {currentRadiusPx}px
                </Badge>
              </div>
              <SegmentedControl<RadiusScale>
                value={preferences.radiusScale}
                onChange={(scale) => {
                  setRadiusScale(scale);
                  setIsPill(scale === 'pill');
                }}
                size="sm"
                fullWidth
                options={[
                  { value: 'sharp', label: 'Keskin (4px)' },
                  { value: 'squircle', label: 'Squircle (12px)' },
                  { value: 'pill', label: 'Pill (22px)' },
                ]}
              />
              <Slider
                label="Hassas Border Radius (px)"
                value={currentRadiusPx}
                min={0}
                max={32}
                step={1}
                size="sm"
                valueSuffix="px"
                tone={semanticTone}
                onChange={(px) => {
                  setCustomRadiusPx(px);
                  setIsPill(px >= 20);
                }}
              />
            </div>

            {/* 3. Component-Specific Quick Controls */}
            {activeEntry.id === 'button' && (
              <div className="uxu-inspector-group">
                <span className="uxu-inspector-label">Buton Varyantı (variant)</span>
                <div className="uxu-tone-chips">
                  {(
                    [
                      'filled',
                      'tonal',
                      'glass',
                      'outlined',
                      'ghost',
                      'danger',
                    ] as ButtonVariant[]
                  ).map((v) => (
                    <Chip
                      key={v}
                      size="xs"
                      tone="primary"
                      selected={btnVariant === v}
                      onClick={() => setBtnVariant(v)}
                    >
                      {v}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {activeEntry.id === 'input' && (
              <div className="uxu-inspector-group">
                <span className="uxu-inspector-label">Giriş Yüzeyi (surface)</span>
                <SegmentedControl<InputSurfaceStyle>
                  value={inputSurface}
                  onChange={setInputSurface}
                  size="sm"
                  fullWidth
                  options={[
                    { value: 'glass', label: 'Glass' },
                    { value: 'tonal', label: 'Tonal' },
                    { value: 'outlined', label: 'Outlined' },
                  ]}
                />
                <Switch
                  size="sm"
                  label="Hata Durumu (errorText)"
                  value={inputError}
                  onChange={setInputError}
                />
              </div>
            )}

            {(activeEntry.id === 'card' || activeEntry.id === 'tabs-accordion') && (
              <div className="uxu-inspector-group">
                <span className="uxu-inspector-label">Yüzey Stili (variant)</span>
                <SegmentedControl<SurfaceVariant>
                  value={surfaceVariant}
                  onChange={setSurfaceVariant}
                  size="sm"
                  fullWidth
                  options={[
                    { value: 'glass', label: 'Glass' },
                    { value: 'tonal', label: 'Tonal' },
                    { value: 'elevated', label: 'Elevated' },
                    { value: 'outlined', label: 'Outlined' },
                  ]}
                />
              </div>
            )}

            {activeEntry.id === 'progress-avatar' && (
              <div className="uxu-inspector-group">
                <Slider
                  label="İlerleme Değeri (%)"
                  value={sliderValue}
                  min={0}
                  max={100}
                  step={1}
                  size="sm"
                  valueSuffix="%"
                  tone={semanticTone}
                  onChange={setSliderValue}
                />
                <Slider
                  label="Animasyon Süresi (sn)"
                  value={animDurationSec}
                  min={0.8}
                  max={6.0}
                  step={0.2}
                  size="sm"
                  valueSuffix=" sn"
                  tone="info"
                  onChange={setAnimDurationSec}
                />
              </div>
            )}

            {activeEntry.id === 'datatable-statcard' && (
              <div className="uxu-inspector-group">
                <span className="uxu-inspector-label">Native Tablo Stili</span>
                <SegmentedControl<NativeTableVariant>
                  value={playgroundTableVariant}
                  onChange={setPlaygroundTableVariant}
                  size="sm"
                  fullWidth
                  options={[
                    { value: 'default', label: 'Standart' },
                    { value: 'striped', label: 'Zebra' },
                    { value: 'bordered', label: 'Çerçeve' },
                    { value: 'minimal', label: 'Minimal' },
                  ]}
                />
              </div>
            )}

            {/* 4. State Toggles */}
            <div className="uxu-inspector-group">
              <Switch
                size="sm"
                label="Devre Dışı (disabled)"
                value={isDisabled}
                onChange={setIsDisabled}
              />
              <Switch
                size="sm"
                label={
                  activeEntry.id === 'progress-avatar'
                    ? 'Belirsiz Döngü (indeterminate)'
                    : 'Yükleniyor (loading)'
                }
                value={isLoading}
                onChange={setIsLoading}
              />
              <Switch
                size="sm"
                label={
                  activeEntry.id === 'progress-avatar'
                    ? 'Daire Kesim (circle / squircle)'
                    : activeEntry.id === 'tabs-accordion'
                    ? 'Kapsül Sekme (pill / underline)'
                    : 'Kapsül Köşe (pill)'
                }
                value={isPill}
                onChange={setIsPill}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Auto-Generated Code & Real-World Practical Examples */}
      <div className="uxu-stage-grid-2">
        <Card
          variant="glass"
          padding="md"
          title="Üretilen Kod (TSX)"
          subtitle="Seçili prop değerlerine göre güncellenir"
          headerIcon={<Code2 size={17} />}
          headerAction={
            <Button
              variant="tonal"
              size="xs"
              leadingIcon={
                copiedText === generatedCode ? (
                  <Check size={13} />
                ) : (
                  <Copy size={13} />
                )
              }
              onClick={() => {
                copy(generatedCode);
                notify({
                  title: 'Kod Kopyalandı',
                  description: `${activeEntry.name} kodu panoda.`,
                  tone: 'success',
                });
              }}
            >
              {copiedText === generatedCode ? 'Kopyalandı' : 'Kopyala'}
            </Button>
          }
        >
          <pre className="uxu-code-block">
            <code>
              {CodeGeneratorService.tokenize(generatedCode).map((tok, idx) =>
                tok.type === 'plain' ? (
                  <React.Fragment key={idx}>{tok.value}</React.Fragment>
                ) : (
                  <span key={idx} className={`uxu-syn-${tok.type}`}>
                    {tok.value}
                  </span>
                )
              )}
            </code>
          </pre>
        </Card>

        <Card
          variant="glass"
          padding="md"
          title="Kullanım Örnekleri"
          subtitle="Hazır kod şablonları"
          headerIcon={<Sparkles size={17} />}
        >
          <div className="uxu-stack-md">
            {activeEntry.examples.map((ex) => (
              <div key={ex.id} className="uxu-code-panel-wrapper">
                <div className="uxu-code-panel-header">
                  <div>
                    <strong>{ex.title}</strong>
                    <div className="uxu-text-xs">{ex.description}</div>
                  </div>
                  <Button
                    variant="tonal"
                    size="xs"
                    leadingIcon={
                      copiedText === ex.code ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )
                    }
                    onClick={() => {
                      copy(ex.code);
                      notify({
                        title: 'Örnek Kopyalandı',
                        description: ex.title,
                        tone: 'success',
                      });
                    }}
                  >
                    {copiedText === ex.code ? 'Kopyalandı' : 'Kopyala'}
                  </Button>
                </div>
                <pre className="uxu-code-block">
                  <code>
                    {CodeGeneratorService.tokenize(ex.code).map((tok, idx) =>
                      tok.type === 'plain' ? (
                        <React.Fragment key={idx}>{tok.value}</React.Fragment>
                      ) : (
                        <span key={idx} className={`uxu-syn-${tok.type}`}>
                          {tok.value}
                        </span>
                      )
                    )}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. UX Best Practices: Do's, Don'ts & Accessibility */}
      <div className="uxu-bento-grid">
        <Card
          variant="glass"
          padding="md"
          title="Doğru Kullanım"
          subtitle="Önerilen pratikler"
          headerIcon={
            <CheckCircle2 size={17} style={{ color: 'var(--uxu-success)' }} />
          }
        >
          <ul className="uxu-guideline-list uxu-guideline-list--do">
            {activeEntry.dos.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card
          variant="glass"
          padding="md"
          title="Kaçınılması Gerekenler"
          subtitle="Yaygın hatalar"
          headerIcon={
            <XCircle size={17} style={{ color: 'var(--uxu-danger)' }} />
          }
        >
          <ul className="uxu-guideline-list uxu-guideline-list--dont">
            {activeEntry.donts.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card
          variant="tonal"
          padding="md"
          title="Erişilebilirlik (A11y)"
          subtitle="Klavye & ARIA"
          headerIcon={<Keyboard size={17} />}
        >
          <ul className="uxu-guideline-list">
            {activeEntry.accessibilityNotes.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 5. Props API Reference Table */}
      <Card
        variant="glass"
        padding="md"
        title={`${activeEntry.name} — Props API`}
        subtitle="Özellikler, veri tipleri ve varsayılanlar"
        headerIcon={<BookOpen size={17} />}
      >
        <div className="uxu-table-scroll">
          <table className="uxu-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Tip</th>
                <th>Varsayılan</th>
                <th>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {activeEntry.propsTable.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code className="uxu-prop-name">{prop.name}</code>
                    {prop.required && (
                      <Badge tone="danger" size="xs" className="uxu-ml-1">
                        Zorunlu
                      </Badge>
                    )}
                  </td>
                  <td>
                    <code className="uxu-prop-type">{prop.type}</code>
                  </td>
                  <td>
                    <code className="uxu-prop-default">
                      {prop.defaultValue}
                    </code>
                  </td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
