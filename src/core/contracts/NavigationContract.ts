import type { ReactNode } from 'react';
import type { IdentifiableProps, SemanticTone } from './ComponentContracts';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — SIDEBAR & HIERARCHICAL NAVIGATION CONTRACTS (ISP & OCP)
 * ============================================================================
 * Adheres to:
 * - [I] Interface Segregation Principle (ISP): Focused contracts for hierarchical
 *   navigation items, sub-menus, and breadcrumbs.
 * - [O] Open/Closed Principle (OCP): Sidebar menu tree is data-driven and
 *   extensible without modifying the Sidebar component implementation.
 */

export interface SidebarSubMenuItem {
  id: string;
  label: string;
  href?: string;
  badge?: string | number;
  badgeTone?: SemanticTone;
  dotColor?: string;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  href?: string;
  icon: ReactNode;
  badge?: string | number;
  badgeTone?: SemanticTone;
  subItems?: SidebarSubMenuItem[];
}

export interface SidebarNavGroup {
  id: string;
  title: string;
  items: SidebarNavItem[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SidebarProps extends IdentifiableProps {
  groups: SidebarNavGroup[];
  activeItemId: string;
  activeSubItemId?: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onSelect: (itemId: string, subItemId?: string) => void;
  onOpenCommandPalette: () => void;
  onOpenThemeStudio: () => void;
}
