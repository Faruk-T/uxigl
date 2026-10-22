import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Sliders,
  Cpu,
  Shield,
  BookOpen,
  Play,
  Volume2,
  Copy,
  Check,
  Sun,
  Moon,
  LayoutDashboard,
  Table2,
  HardDrive,
} from 'lucide-react';
import { UXILogo } from '../../components/brand/UXILogo';
import {
  Button,
  Badge,
  Switch,
  Slider,
  Progress,
  Avatar,
  AvatarGroup,
  Chip,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  DataTable,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
} from '../../components/composites';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { RouteService } from '../../core/services/RouteService';
import type { RadiusScale, SeedPaletteId } from '../../core/contracts/ThemeContract';

export interface UXILandingPageProps {
  onNavigate: (sectionId: string, subItemId?: string) => void;
  onOpenCommandPalette: () => void;
}

type LandingPreviewTab = 'components' | 'sheetgl' | 'filemangl';

export const UXILandingPage: React.FC<UXILandingPageProps> = ({
  onNavigate,
  onOpenCommandPalette,
}) => {
  const {
    resolvedMode,
    preferences,
    availablePalettes,
    toggleMode,
    setSeedPalette,
    setRadiusScale,
    setCustomRadiusPx,
  } = useTheme();
  const { notify } = useToast();

  const isDark = resolvedMode === 'dark';
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const isTR = lang === 'tr';

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 860 : false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<LandingPreviewTab>('components');
  const [copiedReadme, setCopiedReadme] = useState(false);

  // Interactive demo states inside the Landing Page preview box
  const [demoSwitch, setDemoSwitch] = useState(true);
  const [demoProgress, setDemoProgress] = useState(78);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 860;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const currentRadiusPx =
    typeof preferences.customRadiusPx === 'number'
      ? preferences.customRadiusPx
      : preferences.radiusScale === 'sharp'
      ? 4
      : preferences.radiusScale === 'pill'
      ? 22
      : 12;

  const colors = {
    bg: isDark ? '#06080F' : '#F8FAFC',
    navBg: isDark ? 'rgba(6, 8, 15, 0.82)' : 'rgba(248, 250, 252, 0.88)',
    card: isDark ? 'rgba(15, 21, 35, 0.78)' : '#FFFFFF',
    cardBorder: isDark
      ? 'rgba(56, 189, 248, 0.22)'
      : 'rgba(15, 23, 42, 0.1)',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
    text: isDark ? '#F8FAFC' : '#0F172A',
    muted: isDark ? '#94A3B8' : '#475569',
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const speakPronunciation = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
    notify({
      title: `Telaffuz: ${text}`,
      description: 'UXI — UX × UI Birleşik Tasarım Sistemi',
      tone: 'info',
    });
  };

  const features = isTR
    ? [
        {
          icon: '✨',
          title: 'Apple HIG Liquid Glass & Standart Malzemeler',
          desc: 'Gezinme ve kontrol katmanında yüzen Liquid Glass (Regular & Clear), içerik katmanında ise 4 kademeli Apple Standart Malzemeleri (UltraThin, Thin, Regular, Thick) ve Vibrancy hiyerarşisi.',
        },
        {
          icon: '🎨',
          title: 'Google Material You (M3) & 0–32px Border Radius',
          desc: '6 hazır tohum renk paleti (Cupertino Blue, Material Iris, Emerald Mint, Sunset Coral, Amber Gold, Graphite Mono) ve 0px ile 32px arasında anlık ayarlanabilir köşe geometrisi.',
        },
        {
          icon: '📊',
          title: 'SheetGL 60 FPS WebGL Tablo + Native DataTable',
          desc: '100.000+ satır için 4 kurumsal senaryolu (Finans, Telemetri, İK, Stok) SheetGL kanvas tablosu ve sıfır GPU yüküyle çalışan 4 varyantlı semantik HTML <DataTable />.',
        },
        {
          icon: '🗂️',
          title: 'FileManGL WebGL2 Sanal Dosya Sistemi (VFS)',
          desc: 'Sekmeli Windows 11 gezgin deneyimi, 3D uzamsal sahne (webgl_spatial), disk ısı haritası (webgl_diskmap) ve 5 katmanlı NTFS ACL + POSIX (0755) izin motoru.',
        },
        {
          icon: '🔗',
          title: 'Gerçek URL Route & localStorage Kalıcılığı',
          desc: 'Her sayfa, alt menü ve bileşen kendi URL adresine (/dashboard/*, /components/*, /docs/*) sahiptir. Tema, font ölçeği ve border-radius tercihleri F5 sonrasında korunur.',
        },
        {
          icon: '⚡',
          title: 'Sıfır Kaynak Tüketimli Eko-Mimari & SOLID',
          desc: 'Opsiyonel düşük çözünürlüklü WebGL ambiyansı, tek-aktif-motor (Single-Active-Engine) politikası ve Bağımlılıkların Tersine Çevrilmesi (DIP) prensipleriyle %0 boşta CPU/GPU yükü.',
        },
      ]
    : [
        {
          icon: '✨',
          title: 'Apple HIG Liquid Glass & Standard Materials',
          desc: 'Floating Liquid Glass (Regular & Clear) for navigation and transient controls, paired with 4-tier Apple Standard Materials and Vibrancy for the content layer.',
        },
        {
          icon: '🎨',
          title: 'Google Material You (M3) & 0–32px Border Radius',
          desc: '6 seed color palettes with automatic dark/light tonal adaptation and a live 0px–32px border-radius engine persisted in localStorage.',
        },
        {
          icon: '📊',
          title: 'SheetGL 60 FPS WebGL Grid + Native DataTable',
          desc: 'Includes 4 enterprise SheetGL presets (Finance, Telemetry, HR, Inventory) plus a lightweight 4-variant semantic HTML <DataTable />.',
        },
        {
          icon: '🗂️',
          title: 'FileManGL WebGL2 Virtual File System (VFS)',
          desc: 'Tabbed Windows 11 explorer UX, 3D spatial view, interactive disk treemap, and 5-layer NTFS ACL + POSIX (0755) permission engine.',
        },
        {
          icon: '🔗',
          title: 'Clean URL Routing & Persistent State',
          desc: 'Every page, sub-menu, and component has a dedicated URL route (/dashboard/*, /components/*, /docs/*) with HTML5 History API support.',
        },
        {
          icon: '⚡',
          title: 'Zero Idle Resource Architecture & SOLID',
          desc: 'Single-active-engine lifecycle and strict Apple HIG backdrop-filter discipline keep idle CPU & GPU usage near 0%.',
        },
      ];

  const pronunciationModes = [
    {
      badge: isTR ? '1. EN PROFESYONEL & GLOBAL (ÖNERİLEN)' : '1. MOST PROFESSIONAL & GLOBAL (RECOMMENDED)',
      tone: 'primary' as const,
      title: isTR ? 'Harf Harf Okunuşu: "Yu-Eks-Ay"' : 'Letter-by-Letter: "Yu-Eks-Ay"',
      ipa: '/juː - eks - aɪ/',
      speechText: 'U X I',
      howItSounds: isTR
        ? 'Tıpkı UI (Yu-Ay) ve UX (Yu-Eks) kavramlarının okunuşu gibi harflerin İngilizce tek tek telaffuz edilmesidir.'
        : 'Pronounced letter by letter in English, just like UX (Yu-Eks) and UI (Yu-Ay).',
      advantage: isTR
        ? 'İsmin doğrudan UX ve UI birleşimi olduğunu dinleyenin zihninde anında kodlar. Global pazarda (ThemeForest, GitHub, Product Hunt vb.) bir geliştirici bu ismi gördüğünde %90 ihtimalle içinden böyle okuyacaktır. Resmi tanıtımlarda, dokümantasyonda ve videolarda kesinlikle "Yu-Eks-Ay" (veya "Yu-Eks-Ay Admin") kullanılmalıdır.'
        : 'Instantly encodes the fusion of UX and UI in the listener’s mind. Across GitHub, Product Hunt, and enterprise teams, 90% of developers naturally read it this way.',
    },
    {
      badge: isTR ? '2. EN AKILDA KALICI & SEMPATİK' : '2. MOST MEMORABLE & FRIENDLY',
      tone: 'success' as const,
      title: isTR ? 'Tek Kelime Gibi: "Yuksi" veya "Uksi"' : 'As a Single Word: "Yook-see" / "Uksi"',
      ipa: '/juːksi/ • /ʊksi/',
      speechText: 'yooksee',
      howItSounds: isTR
        ? 'Kısaltmaları tek bir kelime gibi okuma eğiliminden (örneğin MUI paketine "Mui", GUI\'ye "Gui" veya Nuxt\'a "Nakst" denmesi gibi) yola çıkan okunuştur.'
        : 'Follows the developer tradition of reading acronyms as a friendly word (like "Mui" for MUI, "Gui" for GUI, or "Nuxt").',
      advantage: isTR
        ? 'Ekip içi günlük konuşmalarda ("Abi Uksi\'nin tablo bileşenini güncelledim") söylemesi çok pratiktir, ağızda yuvarlanmaz ve markaya samimi, akılda kalıcı bir karakter katar.'
        : 'Super practical in daily team standups ("I just updated UXI’s table component") — rolls off the tongue and gives the brand a warm, memorable personality.',
    },
    {
      badge: isTR ? '3. RİTMİK & HİBRİT OKUNUŞ' : '3. RHYTHMIC & HYBRID',
      tone: 'info' as const,
      title: isTR ? 'Hibrit Okunuş: "Yu-Eksi"' : 'Hybrid Pronunciation: "Yu-Eksi"',
      ipa: '/juː - eksi/',
      speechText: 'U X E',
      howItSounds: isTR
        ? 'İlk iki harfi İngilizce kısaltma gibi okuyup sonunu birleştirerek okumaktır.'
        : 'Combines the English "UX" prefix with a smooth "-ee" ending.',
      advantage: isTR
        ? 'Hem UX (Kullanıcı Deneyimi) vurgusunu korur hem de "Pixi (PixiJS)" gibi popüler grafik kütüphanelerinin telaffuz ritmine benzer modern bir tını yakalar.'
        : 'Preserves the strong "UX" emphasis while catching a modern phonetic rhythm similar to popular graphics libraries like PixiJS.',
    },
  ];

  const faqs = isTR
    ? [
        {
          q: 'Neden proje adı UXI (Yu-Eks-Ay / Yuksi) olarak seçildi?',
          a: 'UXI; User Experience (UX) ve User Interface (UI) disiplinlerinin tek bir çatı altında birleşimini simgeler. Resmi dokümantasyonda "Yu-Eks-Ay" (/juː-eks-aɪ/), topluluk ve ekip içi günlük dilde ise "Yuksi / Uksi" olarak okunur.',
        },
        {
          q: 'UXI içinde hem SheetGL hem de FileManGL hazır geliyor mu?',
          a: 'Evet! SheetGL (60 FPS WebGL veri tablosu + 4 kurumsal senaryo) ve FileManGL (WebGL2 sanal dosya yöneticisi) UXI mimarisine tam entegredir. Ayrıca hafif tablolar için sıfır GPU yüküyle çalışan native <DataTable /> bileşeni de mevcuttur.',
        },
        {
          q: 'Border Radius, Font Ölçeği ve Tema seçimleri sayfa yenilenince (F5) korunuyor mu?',
          a: 'Evet. Tüm görünüm tercihleri (Dark/Light mod, 6 tohum renk paleti, 0px–32px Border Radius, %80–%125 yazı boyutu ve aktif URL route) localStorage üzerinde anında saklanır.',
        },
      ]
    : [
        {
          q: 'Why is the project named UXI (/juː-eks-aɪ/ or "yook-see")?',
          a: 'UXI represents the convergence of User Experience (UX) and User Interface (UI). In official docs and videos it is pronounced "Yu-Eks-Ay" (/juː-eks-aɪ/), while in daily team conversations "yook-see" ("Yuksi / Uksi") is encouraged.',
        },
        {
          q: 'Are SheetGL and FileManGL built directly into UXI?',
          a: 'Yes! Both SheetGL (60 FPS Canvas/WebGL DataGrid) and FileManGL (WebGL2 Virtual File System) are natively integrated alongside UXI’s lightweight semantic <DataTable />.',
        },
        {
          q: 'Do Border Radius, Font Scale, and Theme preferences persist across F5 reloads?',
          a: 'Yes. All theme tokens (Dark/Light mode, 6 seed palettes, 0px–32px Border Radius, 80%–125% font scale) and URL routes persist automatically.',
        },
      ];

  const readmeBadgeSnippet = `> **UXI** *(pronounced \`/juː-eks-aɪ/\` "Yu-Eks-Ay" or simply **"yook-see"** / **"Yuksi"**)*
> Next-Gen Apple HIG Liquid Glass × Google Material You Design System for React.`;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: colors.bg,
        backgroundImage: isDark
          ? `radial-gradient(ellipse 90% 55% at 50% -8%, rgba(47, 245, 142, 0.14) 0%, rgba(0, 200, 255, 0.16) 35%, rgba(139, 92, 246, 0.14) 60%, rgba(6, 8, 15, 0) 85%), linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px)`
          : `radial-gradient(ellipse 85% 50% at 50% -5%, rgba(14, 165, 233, 0.12) 0%, rgba(139, 92, 246, 0.10) 40%, rgba(248, 250, 252, 0) 85%), linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
        backgroundSize: '100% 100%, 44px 44px, 44px 44px',
        color: colors.text,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* ====================================================================
          SHEETGL & FILEMANGL STYLE STICKY GLASSMORPHISM HEADER (1280px • 68px)
      ==================================================================== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 500,
          width: '100%',
          backgroundColor: colors.navBg,
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          borderBottom: `1px solid ${colors.border}`,
          userSelect: 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: isMobile ? '0 14px' : '0 24px',
            height: isMobile ? 60 : 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          {/* LEFT: BRAND LOGO (SheetGL & FileManGL Exact Proportions) */}
          <a
            href="/"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 8 : 10,
              cursor: 'pointer',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <UXILogo size={isMobile ? 28 : 32} glow={true} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? 5 : 8 }}>
              <span
                style={{
                  fontSize: isMobile ? 20 : 23,
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  color: colors.text,
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', sans-serif",
                }}
              >
                UX
                <span
                  style={{
                    background:
                      'linear-gradient(110deg, #2FF58E 0%, #00C8FF 45%, #818CF8 75%, #C084FC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  I
                </span>
              </span>
              <span
                style={{
                  fontSize: isMobile ? 10.5 : 11.5,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: isDark ? '#38BDF8' : '#0284C7',
                  letterSpacing: '-0.02em',
                  opacity: 0.92,
                }}
              >
                v2.5.0
              </span>
            </div>
          </a>

          {/* CENTER: NAV LINKS (Desktop — All with Real Route URLs) */}
          {!isMobile && (
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <a
                href="#preview"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('preview');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Canlı Önizleme' : 'Live Preview'}
              </a>

              <a
                href="#pronunciation"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('pronunciation');
                }}
                style={{
                  color: isDark ? '#38BDF8' : '#0284C7',
                  fontSize: 13.5,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Yu-Eks-Ay / Yuksi' : 'Pronunciation'}
              </a>

              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('features');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Özellikler' : 'Features'}
              </a>

              <a
                href="/dashboard/overview"
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate('dashboard', 'overview');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Dashboard
              </a>

              <a
                href="/components/inputs/button"
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate('components-inputs', 'button');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Bileşenler' : 'Components'}
              </a>

              <a
                href="/docs/getting-started"
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate('docs-guide', 'getting-started');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Dokümantasyon' : 'Docs'}
              </a>

              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'SSS' : 'FAQ'}
              </a>
            </nav>
          )}

          {/* RIGHT: SEARCH (⌘K), LANG, THEME TOGGLE, PILL CTA BUTTON */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, flexShrink: 0 }}>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              title="Spotlight Komut Paleti (⌘K)"
              style={{
                padding: '6px 10px',
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                color: colors.text,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ⌘K
            </button>

            <button
              type="button"
              onClick={() => setLang((l) => (l === 'tr' ? 'en' : 'tr'))}
              title={isTR ? 'Switch to English' : 'Türkçeye Geç'}
              style={{
                padding: '6px 10px',
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                color: colors.text,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {lang.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              title={isTR ? 'Temayı Değiştir (Dark / Light)' : 'Toggle Theme'}
              style={{
                width: isMobile ? 34 : 38,
                height: isMobile ? 34 : 38,
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? '#0D1322' : '#F1F5F9',
                color: isDark ? '#FBBF24' : '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a
              href="/dashboard/overview"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onNavigate('dashboard', 'overview');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: isMobile ? 5 : 8,
                padding: isMobile ? '7px 13px' : '10px 20px',
                borderRadius: 999,
                background:
                  'linear-gradient(135deg, #10B981 0%, #0284C7 52%, #6366F1 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: isMobile ? 12.5 : 13.5,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.42)',
              }}
            >
              <span>
                {isMobile
                  ? isTR
                    ? 'Stüdyo'
                    : 'Studio'
                  : isTR
                  ? 'Uygulamaya Git'
                  : 'Launch UXI'}
              </span>
              <span style={{ fontSize: isMobile ? 13 : 15 }}>→</span>
            </a>

            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Menü"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>

        {/* MOBILE COLLAPSIBLE MENU */}
        {isMobile && mobileMenuOpen && (
          <div
            style={{
              padding: '12px 16px 16px',
              borderTop: `1px solid ${colors.border}`,
              backgroundColor: isDark ? 'rgba(6, 8, 15, 0.96)' : 'rgba(255, 255, 255, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <a
              href="/dashboard/overview"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigate('dashboard', 'overview');
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              🚀 Komuta Merkezi (/dashboard/overview)
            </a>
            <a
              href="/components/inputs/button"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigate('components-inputs', 'button');
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              🎛️ Bileşen Laboratuvarı (/components/inputs/button)
            </a>
            <a
              href="/docs/getting-started"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigate('docs-guide', 'getting-started');
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              📚 Dokümantasyon (/docs/getting-started)
            </a>
          </div>
        )}
      </header>

      {/* ====================================================================
          HERO SECTION (SHEETGL & FILEMANGL CENTERED EMBLEM + GRADIENT TITLE)
      ==================================================================== */}
      <section
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          padding: isMobile ? '28px 14px 24px' : '46px 24px 36px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* LARGE FRAMELESS 3D HERO EMBLEM */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: isMobile ? 16 : 22,
          }}
        >
          <UXILogo size={isMobile ? 96 : 138} glow={true} />
        </div>

        {/* PHONETIC PRONUNCIATION PILL BADGE */}
        <div
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 999,
            backgroundColor: isDark
              ? 'rgba(56, 189, 248, 0.10)'
              : 'rgba(2, 132, 199, 0.08)',
            border: `1px solid ${
              isDark ? 'rgba(56, 189, 248, 0.30)' : 'rgba(2, 132, 199, 0.22)'
            }`,
            marginBottom: 18,
            fontSize: 12.5,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <strong style={{ color: isDark ? '#38BDF8' : '#0284C7' }}>UXI</strong>
          <span style={{ color: colors.muted }}>
            pronounced <code>/juː-eks-aɪ/</code> (&ldquo;Yu-Eks-Ay&rdquo;) or simply{' '}
            <strong>&ldquo;yook-see&rdquo;</strong> (&ldquo;Yuksi / Uksi&rdquo;)
          </span>
          <button
            type="button"
            onClick={() => speakPronunciation('U X I')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 999,
              border: 'none',
              background: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.15)',
              color: isDark ? '#7DD3FC' : '#0369A1',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Dinle: Yu-Eks-Ay"
          >
            <Volume2 size={12} /> Dinle
          </button>
        </div>

        {/* HERO TITLE */}
        <h1
          style={{
            fontSize: 'clamp(30px, 5.4vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.12,
            margin: '0 auto 18px',
            maxWidth: 1060,
            letterSpacing: '-0.035em',
            color: colors.text,
          }}
        >
          {isTR ? (
            <>
              React İçin Yeni Nesil{' '}
              <span
                style={{
                  background:
                    'linear-gradient(110deg, #2FF58E 0%, #00C8FF 42%, #818CF8 75%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Apple Liquid Glass × Material 3
              </span>{' '}
              Tasarım Sistemi
            </>
          ) : (
            <>
              The Next-Gen{' '}
              <span
                style={{
                  background:
                    'linear-gradient(110deg, #2FF58E 0%, #00C8FF 42%, #818CF8 75%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Apple Liquid Glass × Material 3
              </span>{' '}
              Design System for React
            </>
          )}
        </h1>

        {/* HERO SUBTITLE */}
        <p
          style={{
            fontSize: isMobile ? 15 : 17.5,
            color: colors.muted,
            maxWidth: 840,
            margin: '0 auto 30px',
            lineHeight: 1.68,
          }}
        >
          {isTR
            ? 'UX ve UI dünyasını tek bir mimaride birleştiren UXI; Apple HIG Liquid Glass & Standart Malzemeleri, Google Material You tohum paletleri, 0–32px canlı Border Radius motoru, SheetGL 60 FPS WebGL DataGrid ve FileManGL WebGL2 dosya yöneticisiyle eksiksiz bir kurumsal ekosistem sunar.'
            : 'Uniting UX and UI in a single architecture: Apple HIG Liquid Glass & Standard Materials, Google Material You tonal palettes, a live 0–32px Border Radius engine, SheetGL 60 FPS WebGL DataGrid, and FileManGL WebGL2 Virtual File System.'}
        </p>

        {/* PRIMARY CTA BUTTONS (All with Real Route Hrefs) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 34,
          }}
        >
          <a
            href="/dashboard/overview"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'overview');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 26px',
              borderRadius: 999,
              background:
                'linear-gradient(135deg, #10B981 0%, #0284C7 55%, #6366F1 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 14.5,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.38)',
            }}
          >
            <Play size={15} fill="#FFFFFF" />
            <span>
              {isTR ? 'Komuta Merkezini Başlat (/dashboard)' : 'Launch Dashboard (/dashboard)'}
            </span>
          </a>

          <a
            href="/components/inputs/button"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('components-inputs', 'button');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
              color: colors.text,
              fontWeight: 700,
              fontSize: 14.5,
              textDecoration: 'none',
            }}
          >
            <Sliders size={15} />
            <span>
              {isTR ? 'Bileşen Laboratuvarı (/components)' : 'Component Playground (/components)'}
            </span>
          </a>

          <a
            href="/docs/getting-started"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('docs-guide', 'getting-started');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
              color: colors.text,
              fontWeight: 700,
              fontSize: 14.5,
              textDecoration: 'none',
            }}
          >
            <BookOpen size={15} />
            <span>{isTR ? 'Dokümantasyon (/docs)' : 'Documentation (/docs)'}</span>
          </a>
        </div>

        {/* 4-PILLAR QUICK-JUMP STRIP (FileManGL & SheetGL Style) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(4, minmax(0, 1fr))',
            gap: 12,
            maxWidth: 1180,
            margin: '0 auto 40px',
          }}
        >
          {[
            {
              icon: <Sparkles size={16} color="#2FF58E" />,
              title: 'Apple HIG Liquid Glass',
              tag: 'Regular & Clear',
              href: '/components/surfaces/card',
              sec: 'components-surfaces',
              sub: 'card',
            },
            {
              icon: <Sliders size={16} color="#00C8FF" />,
              title: 'Material 3 & R:0-32px',
              tag: '6 Palet • Kalıcı',
              href: '/docs/theming-tokens',
              sec: 'docs-guide',
              sub: 'theming-tokens',
            },
            {
              icon: <Table2 size={16} color="#818CF8" />,
              title: 'SheetGL + Native Tablo',
              tag: '60 FPS WebGL',
              href: '/dashboard/crm-orders',
              sec: 'dashboard',
              sub: 'crm-orders',
            },
            {
              icon: <HardDrive size={16} color="#C084FC" />,
              title: 'FileManGL WebGL2 VFS',
              tag: 'NTFS ACL + 0755',
              href: '/dashboard/file-manager',
              sec: 'dashboard',
              sub: 'file-manager',
            },
          ].map((pillar) => (
            <a
              key={pillar.href}
              href={pillar.href}
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onNavigate(pillar.sec, pillar.sub);
              }}
              style={{
                padding: '14px 16px',
                borderRadius: 16,
                backgroundColor: colors.card,
                border: `1px solid ${colors.cardBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                textDecoration: 'none',
                color: colors.text,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {pillar.icon}
                <strong style={{ fontSize: 13 }}>{pillar.title}</strong>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: '2px 8px',
                  borderRadius: 999,
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(15,23,42,0.06)',
                  color: colors.muted,
                }}
              >
                {pillar.tag}
              </span>
            </a>
          ))}
        </div>

        {/* ====================================================================
            LIVE INTERACTIVE EMBEDDED WORKSPACE PREVIEW (#preview)
        ==================================================================== */}
        <div
          id="preview"
          style={{
            maxWidth: 1220,
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginBottom: 12,
              padding: '0 4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <strong style={{ fontSize: 13.5 }}>
                {isTR
                  ? 'Canlı İnteraktif UXI Sahnesi (Hemen Aşağıda Test Edin)'
                  : 'Live Interactive UXI Stage (Test Below)'}
              </strong>
            </div>

            <SegmentedControl<LandingPreviewTab>
              size="sm"
              value={previewTab}
              onChange={setPreviewTab}
              options={[
                { value: 'components', label: isTR ? 'UXI Bileşen & Tema Sahnesi' : 'UXI Components & Theme' },
                { value: 'sheetgl', label: 'SheetGL 60 FPS Tablo' },
                { value: 'filemangl', label: 'FileManGL Dosya' },
              ]}
            />
          </div>

          <div
            style={{
              borderRadius: currentRadiusPx + 4,
              padding: isMobile ? 14 : 22,
              backgroundColor: colors.card,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: isDark
                ? '0 28px 70px rgba(0, 0, 0, 0.72), 0 0 35px rgba(56, 189, 248, 0.12)'
                : '0 24px 60px rgba(15, 23, 42, 0.08)',
            }}
          >
            {previewTab === 'components' && (
              <div className="uxu-stage-grid-2">
                <Card
                  variant="glass"
                  eyebrow="APPLE HIG LIQUID GLASS × MATERIAL 3"
                  title="Canlı Tema, Renk Paleti & Border Radius"
                  subtitle="Değişiklikler tüm UXI bileşenlerine ve localStorage’a anında uygulanır"
                >
                  <div className="uxu-stack-md">
                    <div className="uxu-stage-row">
                      {availablePalettes.map((p) => (
                        <Chip
                          key={p.id}
                          size="sm"
                          tone="primary"
                          selected={preferences.seedPalette === p.id}
                          onClick={() => setSeedPalette(p.id as SeedPaletteId)}
                        >
                          {p.name}
                        </Chip>
                      ))}
                    </div>

                    <SegmentedControl<RadiusScale>
                      label={`Border Radius (Köşe Yuvarlaklığı: ${currentRadiusPx}px)`}
                      value={preferences.radiusScale}
                      onChange={setRadiusScale}
                      size="sm"
                      fullWidth
                      options={[
                        { value: 'sharp', label: 'Keskin (4px)' },
                        { value: 'squircle', label: 'Squircle (12px)' },
                        { value: 'pill', label: 'Pill (22px)' },
                      ]}
                    />

                    <Slider
                      label="Hassas Border Radius (0px – 32px)"
                      value={currentRadiusPx}
                      min={0}
                      max={32}
                      step={1}
                      size="sm"
                      valueSuffix="px"
                      onChange={setCustomRadiusPx}
                    />

                    <Switch
                      label="Apple HIG Geçici Liquid Glass Kontrolleri"
                      description="Kaydırıcı ve anahtarlar etkileşim anında sıvı cam kapsülüne dönüşür"
                      value={demoSwitch}
                      onChange={setDemoSwitch}
                    />
                  </div>
                </Card>

                <Card
                  variant="tonal"
                  eyebrow="UXI PRIMITIVES & NATIVE TABLE"
                  title="Etkileşimli Bileşen Örnekleri"
                  subtitle="Butonlar, dairesel ilerleme halkaları, avatarlar ve hafif native tablo"
                >
                  <div className="uxu-stack-md">
                    <div className="uxu-stage-row">
                      <Progress
                        variant="circular"
                        value={demoProgress}
                        tone="primary"
                        size="md"
                      />
                      <Progress
                        variant="circular"
                        value={92}
                        tone="success"
                        size="md"
                      />
                      <AvatarGroup max={4} size="md">
                        <Avatar name="Ümit Uz" status="online" tone="primary" />
                        <Avatar name="Deniz Kaya" status="online" tone="success" />
                        <Avatar name="Selin Yılmaz" status="busy" tone="warning" />
                        <Avatar name="Mert Can" tone="info" />
                      </AvatarGroup>
                    </div>

                    <Slider
                      label="Canlı İlerleme Testi (%)"
                      value={demoProgress}
                      min={0}
                      max={100}
                      step={1}
                      size="sm"
                      valueSuffix="%"
                      onChange={setDemoProgress}
                    />

                    <DataTable
                      rowKey="id"
                      variant="striped"
                      size="sm"
                      data={[
                        {
                          id: '1',
                          pkg: '@uxi/core',
                          pronounce: '/juː-eks-aɪ/ (Yu-Eks-Ay)',
                          nick: 'Yuksi / Uksi',
                        },
                        {
                          id: '2',
                          pkg: 'sheetgl',
                          pronounce: '60 FPS WebGL DataGrid',
                          nick: '4 Senaryo',
                        },
                        {
                          id: '3',
                          pkg: 'filemangl',
                          pronounce: 'WebGL2 VFS Explorer',
                          nick: 'ACL + 0755',
                        },
                      ]}
                      columns={[
                        { key: 'pkg', header: 'Modül', sortable: true },
                        { key: 'pronounce', header: 'Mimari / Okunuş' },
                        { key: 'nick', header: 'Etiket', align: 'right' },
                      ]}
                    />
                  </div>
                </Card>
              </div>
            )}

            {previewTab === 'sheetgl' && (
              <SheetGLGridAdapter initialRowCount={150} height={460} />
            )}

            {previewTab === 'filemangl' && (
              <FileManGLExplorerAdapter height={500} />
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          BRAND IDENTITY & PRONUNCIATION GUIDE (#pronunciation)
      ==================================================================== */}
      <section
        id="pronunciation"
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          padding: isMobile ? '28px 14px 36px' : '44px 24px 56px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Badge tone="primary" variant="tonal" size="sm">
            MARKA KİMLİĞİ &amp; FONETİK REHBER
          </Badge>
          <h2
            style={{
              fontSize: isMobile ? 24 : 34,
              fontWeight: 800,
              marginTop: 10,
              marginBottom: 10,
              letterSpacing: '-0.025em',
            }}
          >
            {isTR
              ? 'UXI Nasıl Okunur? ("Yu-Eks-Ay" • "Yuksi / Uksi" • "Yu-Eksi")'
              : 'How to Pronounce UXI ("Yu-Eks-Ay" • "Yook-see" • "Yu-Eksi")'}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: colors.muted,
              maxWidth: 780,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            {isTR
              ? 'UX (User Experience) ve UI (User Interface) kavramlarının kusursuz birleşiminden doğan UXI markası; hem küresel sunumlarda hem de ekip içi günlük konuşmalarda doğal ve akılda kalıcı üç telaffuz alternatifine sahiptir:'
              : 'Born from the union of UX (User Experience) and UI (User Interface), UXI supports three natural pronunciations for global presentations and daily engineering standups:'}
          </p>
        </div>

        {/* 3 PRONUNCIATION CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
            gap: 20,
            marginBottom: 24,
          }}
        >
          {pronunciationModes.map((mode, idx) => (
            <div
              key={idx}
              style={{
                padding: 24,
                borderRadius: currentRadiusPx + 2,
                backgroundColor: colors.card,
                border: `1px solid ${colors.cardBorder}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Badge tone={mode.tone} variant="tonal" size="xs">
                    {mode.badge}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => speakPronunciation(mode.speechText)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: `1px solid ${colors.border}`,
                      background: 'transparent',
                      color: colors.text,
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Volume2 size={13} /> {mode.ipa}
                  </button>
                </div>

                <h3
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    marginBottom: 10,
                    color: colors.text,
                  }}
                >
                  {mode.title}
                </h3>

                <p
                  style={{
                    fontSize: 13.5,
                    color: colors.muted,
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {mode.howItSounds}
                </p>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(15, 23, 42, 0.03)',
                  border: `1px solid ${colors.border}`,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: colors.text,
                }}
              >
                <strong style={{ color: isDark ? '#38BDF8' : '#0284C7' }}>
                  {isTR ? 'Avantajı: ' : 'Advantage: '}
                </strong>
                {mode.advantage}
              </div>
            </div>
          ))}
        </div>

        {/* OFFICIAL README.MD PHONETIC CALLOUT BOX */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: currentRadiusPx + 2,
            backgroundColor: colors.card,
            border: `1px solid ${colors.cardBorder}`,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 4 }}>
              {isTR
                ? 'Hangisini Seçmelisin? — Kurumsal README.md Fonetik Notu'
                : 'Which One Should You Choose? — Official README.md Phonetic Note'}
            </div>
            <div style={{ fontSize: 13.5, color: colors.muted, lineHeight: 1.6 }}>
              {isTR ? (
                <>
                  <strong>Resmi tanıtımlarda, dokümantasyonda ve videolarda:</strong> Kesinlikle{' '}
                  <strong>&ldquo;Yu-Eks-Ay&rdquo;</strong> (veya <em>&ldquo;Yu-Eks-Ay Admin&rdquo;</em>).{' '}
                  <strong>Günlük dilde ve topluluk içinde:</strong> Ekip arkadaşlarının{' '}
                  <strong>&ldquo;Uksi / Yuksi&rdquo;</strong> demesini teşvik edebilirsin; akılda
                  kalıcılığı çok yüksektir.
                </>
              ) : (
                <>
                  <strong>In official docs and videos:</strong> Use{' '}
                  <strong>&ldquo;Yu-Eks-Ay&rdquo;</strong> (<code>/juː-eks-aɪ/</code>).{' '}
                  <strong>In daily community &amp; team chats:</strong> Encourage{' '}
                  <strong>&ldquo;yook-see&rdquo; (&ldquo;Yuksi / Uksi&rdquo;)</strong>.
                </>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              backgroundColor: isDark ? '#090D18' : '#F1F5F9',
              border: `1px solid ${colors.border}`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12.5,
            }}
          >
            <code>
              <strong>UXI</strong> (pronounced /juː-eks-aɪ/ or simply &quot;yook-see&quot;)
            </code>
            <Button
              variant="tonal"
              size="xs"
              leadingIcon={copiedReadme ? <Check size={13} /> : <Copy size={13} />}
              onClick={() => {
                navigator.clipboard?.writeText(readmeBadgeSnippet);
                setCopiedReadme(true);
                setTimeout(() => setCopiedReadme(false), 2000);
                notify({
                  title: 'README Fonetik Notu Kopyalandı',
                  description: 'UXI (pronounced /juː-eks-aɪ/ or simply "yook-see")',
                  tone: 'success',
                });
              }}
            >
              {copiedReadme ? 'Kopyalandı' : 'Kopyala'}
            </Button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6-CARD ENTERPRISE FEATURE PILLARS GRID (#features)
      ==================================================================== */}
      <section
        id="features"
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          padding: isMobile ? '28px 14px 44px' : '40px 24px 64px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isMobile ? 24 : 32,
            fontWeight: 800,
            marginBottom: isMobile ? 22 : 34,
            letterSpacing: '-0.02em',
          }}
        >
          {isTR
            ? 'Kurumsal Mimari ve Öne Çıkan Yetenekler'
            : 'Enterprise Architecture & Key Capabilities'}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: isMobile ? 14 : 20,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: 24,
                borderRadius: currentRadiusPx + 2,
                backgroundColor: colors.card,
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 14,
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.14)'
                    : 'rgba(2, 132, 199, 0.10)',
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 16.5,
                  marginBottom: 8,
                  color: colors.text,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: colors.muted,
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          FAQ SECTION (#faq — SheetGL Style)
      ==================================================================== */}
      <section
        id="faq"
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '16px 24px 68px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 28,
            letterSpacing: '-0.02em',
          }}
        >
          {isTR ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px 24px',
                borderRadius: currentRadiusPx + 2,
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15.5,
                  marginBottom: 8,
                  color: colors.text,
                }}
              >
                {faq.q}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: colors.muted,
                  lineHeight: 1.6,
                }}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          FOOTER (SheetGL & FileManGL Style with Route Links)
      ==================================================================== */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: 13,
          color: colors.muted,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <UXILogo size={20} />
          <span style={{ fontWeight: 800, color: colors.text }}>
            UX
            <span
              style={{
                background:
                  'linear-gradient(110deg, #2FF58E 0%, #00C8FF 45%, #818CF8 75%, #C084FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              I
            </span>
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              color: isDark ? '#38BDF8' : '#0284C7',
            }}
          >
            v2.5.0
          </span>
          <span>•</span>
          <span>
            pronounced <code>/juː-eks-aɪ/</code> (&ldquo;Yu-Eks-Ay&rdquo;) or{' '}
            <strong>&ldquo;yook-see&rdquo;</strong> (&ldquo;Yuksi / Uksi&rdquo;)
          </span>
        </div>

        <nav
          aria-label="Footer Route Links"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px 18px',
            marginBottom: 10,
            fontSize: 12.5,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <a
            href="/"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            / (Landing)
          </a>
          <a
            href="/dashboard/overview"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'overview');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /dashboard/overview
          </a>
          <a
            href="/dashboard/crm-orders"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'crm-orders');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /dashboard/crm-orders (SheetGL)
          </a>
          <a
            href="/dashboard/file-manager"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'file-manager');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /dashboard/file-manager (FileManGL)
          </a>
          <a
            href="/components/inputs/button"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('components-inputs', 'button');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /components/inputs/button
          </a>
          <a
            href="/docs/getting-started"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('docs-guide', 'getting-started');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /docs/getting-started
          </a>
        </nav>

        <div>MIT License • © 2026 UXI Design System Team</div>
      </footer>
    </div>
  );
};
