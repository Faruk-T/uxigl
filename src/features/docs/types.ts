import type React from 'react';

export type DocsTopicId =
  | 'getting-started'
  | 'form-controls'
  | 'surfaces-navigation'
  | 'data-feedback-webgl'
  | 'layout-shell'
  | 'page-templates'
  | 'theming-tokens'
  | 'cli-shortcuts'
  | 'osgl-workspace';

export interface ArchitectureDocsViewProps {
  activeTopic?: DocsTopicId;
  onTopicChange?: (topic: DocsTopicId) => void;
  onSelectComponent?: (componentId: string) => void;
  onOpenCommandPalette?: () => void;
}

export interface DocSubNavItem {
  id: string;
  labelTr: string;
  labelEn: string;
  onSelect?: () => void;
}

export interface DocChapterMeta {
  id: DocsTopicId;
  step: string;
  badgeTr: string;
  badgeEn: string;
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  subtitleEn: string;
  icon: React.ReactNode;
  subItems: DocSubNavItem[];
}

export interface DocPropRow {
  name: string;
  type: string;
  defaultValue: string;
  required?: boolean;
  description: string;
}

export interface DocComponentGuideItem {
  id: string;
  tag: string;
  navLabelTr: string;
  navLabelEn: string;
  titleTr: string;
  titleEn: string;
  categoryLabelTr: string;
  categoryLabelEn: string;
  playgroundId?: string;
  importStatement: string;
  architectureNoteTr: string;
  architectureNoteEn: string;
  summaryTr: string;
  summaryEn: string;
  code: string;
  propsTable: DocPropRow[];
  renderLiveDemo: () => React.ReactNode;
}

export interface ComponentDocCardProps {
  guide: DocComponentGuideItem;
  isTR: boolean;
  onOpenPlayground?: (playgroundId: string) => void;
}
