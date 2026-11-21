/**
 * ============================================================================
 * uxiGL — Modular Liquid Glass × Google Material You Design System
 * ============================================================================
 */

// Styles & Tokens
import './styles/uxu-tokens.css';

// 1. Brand Emblem
export { UXILogo, type UXILogoProps } from './components/brand/UXILogo';
export { GithubIcon, type GithubIconProps } from './components/brand/GithubIcon';

// 2. Primitives (Button, Input, Switch, Checkbox, Slider, Badge, Chip, Avatar, Progress, Skeleton, Tooltip, GoogleIcon)
export * from './components/primitives';

// 3. Composites (Card, SegmentedControl, Tabs, Accordion, Modal, CommandPalette, Sidebar, TopHeader, StatCard, DataTable, SheetGLGridAdapter, FileManGLExplorerAdapter, WebGLAuroraCanvas)
export * from './components/composites';
export { SidebarShowcaseView } from './features/showcase/SidebarShowcaseView';
export {
  PageTemplatesShowcaseView,
  type PageTemplateId,
  type PageTemplatesShowcaseViewProps,
} from './features/showcase/PageTemplatesShowcaseView';
export {
  LoginPage,
  RegisterPage,
  PricingPage,
  ProfilePage,
  InvoicePage,
  KanbanPage,
  StatusPage,
  type LoginPageProps,
  type RegisterPageProps,
  type PricingPageProps,
  type StatusPageProps,
} from './features/showcase/pages';
export { EnterpriseSettingsPage } from './features/showcase/EnterpriseSettingsPage';
export {
  AnalyticsDashboardView,
  type AnalyticsDashboardViewProps,
} from './features/showcase/AnalyticsDashboardView';

// 3b. Ready-to-Use Full Application Templates (EnterpriseGL, FlowGL, CargoGL, SynthGL, MacOSGL)
export {
  AnalyticsDashboardView as EnterpriseGLTemplate,
} from './features/showcase/AnalyticsDashboardView';
export {
  FlowWorkspaceDemo as FlowGLTemplate,
  FlowWorkspaceDemo,
  type FlowWorkspaceDemoProps,
} from './features/demos/FlowWorkspaceDemo';
export {
  CargoGLDemo as CargoGLTemplate,
  CargoGLDemo,
  type CargoGLDemoProps,
} from './features/demos/CargoGLDemo';
export {
  SynthGLDemo as SynthGLTemplate,
  SynthGLDemo,
  type SynthGLDemoProps,
} from './features/demos/SynthGLDemo';
export {
  OSGLDemo as OSGLTemplate,
  OSGLDemo as MacOSGLTemplate,
  OSGLDemo,
  type OSGLDemoProps,
  type OSWallpaperId,
  type IconBgStyle,
} from './features/demos/OSGLDemo';
export {
  TesseraGLDemo as TesseraGLTemplate,
  TesseraGLDemo,
  type TesseraGLDemoProps,
} from './features/demos/TesseraGLDemo';

// 4. Providers & Hooks
export { ThemeProvider, useTheme } from './providers/ThemeProvider';
export { ToastProvider, useToast } from './providers/ToastProvider';
export { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
export { useCopyToClipboard } from './hooks/useCopyToClipboard';

// 5. Core Contracts, Tokens & Services
export * from './core/contracts/ComponentContracts';
export * from './core/contracts/NavigationContract';
export * from './core/contracts/NotificationContract';
export * from './core/contracts/ThemeContract';
export * from './core/tokens/designTokens';
export { RouteService } from './core/services/RouteService';
export { CodeGeneratorService } from './core/services/CodeGeneratorService';
export {
  CssVariableThemeEngine,
  buildInheritedSheetGLTheme,
  resolveEffectiveModeTokens,
  generateThemeCssExport,
  hexToHSL,
  getLogoFilterByTheme,
} from './core/services/ThemeEngineService';
export { defaultThemeStorageAdapter } from './core/services/StorageService';
