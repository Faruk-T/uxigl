import React, { useMemo, useState } from 'react';
import { Card } from '../../components/composites';
import { Badge } from '../../components/primitives';
import type { PageTemplateId } from '../showcase/PageTemplatesShowcaseView';
import { DocsChapterFooter } from './components/DocsChapterFooter';
import { DocsPortalHeader } from './components/DocsPortalHeader';
import { DocsSidebarNav } from './components/DocsSidebarNav';
import { buildDocsChapters } from './data/docsChapters';
import {
  ComponentDocCard,
  DATA_FEEDBACK_WEBGL_GUIDES,
  FORM_CONTROL_GUIDES,
  SURFACE_NAVIGATION_GUIDES,
} from './docsComponentGuides';
import { CliShortcutsSection } from './sections/CliShortcutsSection';
import { GettingStartedSection } from './sections/GettingStartedSection';
import { LayoutShellSection } from './sections/LayoutShellSection';
import { PageTemplatesSection } from './sections/PageTemplatesSection';
import { ThemingDesignTypesSection } from './sections/ThemingDesignTypesSection';
import { ThemingTokensFontsSection } from './sections/ThemingTokensFontsSection';
import type {
  ArchitectureDocsViewProps,
  DocSubNavItem,
  DocsTopicId,
} from './types';

export type { ArchitectureDocsViewProps, DocsTopicId } from './types';

export const ArchitectureDocsView: React.FC<ArchitectureDocsViewProps> = ({
  activeTopic,
  onTopicChange,
  onSelectComponent,
  onOpenCommandPalette,
}) => {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const isTR = lang === 'tr';

  const [internalTopic, setInternalTopic] =
    useState<DocsTopicId>('getting-started');
  const currentTopic: DocsTopicId = activeTopic ?? internalTopic;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubId, setActiveSubId] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'getting-started': true,
    'form-controls': true,
    'surfaces-navigation': true,
    'data-feedback-webgl': true,
    'page-templates': true,
    'theming-tokens': true,
  });
  const [docsPageTemplate, setDocsPageTemplate] =
    useState<PageTemplateId>('page-login');

  const chapters = useMemo(
    () => buildDocsChapters(setDocsPageTemplate),
    []
  );

  const visibleChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase();
    return chapters.filter(
      (ch) =>
        ch.titleTr.toLowerCase().includes(q) ||
        ch.titleEn.toLowerCase().includes(q) ||
        ch.subtitleTr.toLowerCase().includes(q) ||
        ch.subtitleEn.toLowerCase().includes(q) ||
        ch.subItems.some(
          (sub) =>
            sub.labelTr.toLowerCase().includes(q) ||
            sub.labelEn.toLowerCase().includes(q)
        )
    );
  }, [chapters, searchQuery]);

  const activeChapter =
    chapters.find((c) => c.id === currentTopic) ?? chapters[0];
  const currentIdx = chapters.findIndex((c) => c.id === activeChapter.id);
  const prevChapter = currentIdx > 0 ? chapters[currentIdx - 1] : null;
  const nextChapter =
    currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null;

  const handleTopicSelect = (topic: DocsTopicId) => {
    setInternalTopic(topic);
    setActiveSubId('');
    setExpandedChapters((prev) => ({ ...prev, [topic]: true }));
    onTopicChange?.(topic);
  };

  const handleSubItemClick = (chapterId: DocsTopicId, sub: DocSubNavItem) => {
    if (currentTopic !== chapterId) {
      handleTopicSelect(chapterId);
    }
    setActiveSubId(sub.id);
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: true }));
    sub.onSelect?.();
    window.setTimeout(() => {
      const el =
        document.getElementById(sub.id) ??
        (chapterId === 'page-templates'
          ? document.getElementById('doc-tpl-stage')
          : null);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="uxu-docs-view">
      <DocsPortalHeader
        chapters={chapters}
        currentTopic={currentTopic}
        lang={lang}
        onLangChange={setLang}
        onTopicSelect={handleTopicSelect}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 295px) minmax(0, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}
        className="uxu-docs-portal-layout"
      >
        <DocsSidebarNav
          visibleChapters={visibleChapters}
          currentTopic={currentTopic}
          activeSubId={activeSubId}
          expandedChapters={expandedChapters}
          searchQuery={searchQuery}
          isTR={isTR}
          onSearchChange={setSearchQuery}
          onTopicSelect={handleTopicSelect}
          onToggleExpand={(id) =>
            setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }))
          }
          onSubItemClick={handleSubItemClick}
        />

        <div className="uxu-stack-md" style={{ minWidth: 0 }}>
          <Card
            variant="tonal"
            padding="md"
            eyebrow={isTR ? activeChapter.badgeTr : activeChapter.badgeEn}
            title={isTR ? activeChapter.titleTr : activeChapter.titleEn}
            subtitle={isTR ? activeChapter.subtitleTr : activeChapter.subtitleEn}
            headerIcon={activeChapter.icon}
            headerAction={
              <Badge tone="primary" size="sm">
                {activeChapter.step} / {chapters.length}
              </Badge>
            }
          >
            {null}
          </Card>

          {currentTopic === 'getting-started' && (
            <GettingStartedSection isTR={isTR} />
          )}

          {currentTopic === 'form-controls' && (
            <div className="uxu-stack-md">
              {FORM_CONTROL_GUIDES.map((guide) => (
                <ComponentDocCard
                  key={guide.id}
                  guide={guide}
                  isTR={isTR}
                  onOpenPlayground={onSelectComponent}
                />
              ))}
            </div>
          )}

          {currentTopic === 'surfaces-navigation' && (
            <div className="uxu-stack-md">
              {SURFACE_NAVIGATION_GUIDES.map((guide) => (
                <ComponentDocCard
                  key={guide.id}
                  guide={guide}
                  isTR={isTR}
                  onOpenPlayground={onSelectComponent}
                />
              ))}
            </div>
          )}

          {currentTopic === 'data-feedback-webgl' && (
            <div className="uxu-stack-md">
              {DATA_FEEDBACK_WEBGL_GUIDES.map((guide) => (
                <ComponentDocCard
                  key={guide.id}
                  guide={guide}
                  isTR={isTR}
                  onOpenPlayground={onSelectComponent}
                />
              ))}
            </div>
          )}

          {currentTopic === 'layout-shell' && (
            <LayoutShellSection isTR={isTR} />
          )}

          {currentTopic === 'page-templates' && (
            <PageTemplatesSection
              isTR={isTR}
              activeTemplate={docsPageTemplate}
              onTemplateChange={setDocsPageTemplate}
            />
          )}

          {currentTopic === 'theming-tokens' && (
            <div className="uxu-stack-md">
              <ThemingDesignTypesSection isTR={isTR} />
              <ThemingTokensFontsSection isTR={isTR} />
            </div>
          )}

          {currentTopic === 'cli-shortcuts' && (
            <CliShortcutsSection
              isTR={isTR}
              onOpenCommandPalette={onOpenCommandPalette}
            />
          )}

          <DocsChapterFooter
            prevChapter={prevChapter}
            nextChapter={nextChapter}
            isTR={isTR}
            onTopicSelect={handleTopicSelect}
            onSelectComponent={onSelectComponent}
          />
        </div>
      </div>
    </div>
  );
};
