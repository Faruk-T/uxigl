import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { Button } from '../../../components/primitives';
import { Card } from '../../../components/composites';
import { RouteService } from '../../../core/services/RouteService';
import { COMPONENT_CATALOG } from '../../catalog/componentCatalog';
import type { DocChapterMeta, DocsTopicId } from '../types';

export interface DocsChapterFooterProps {
  prevChapter: DocChapterMeta | null;
  nextChapter: DocChapterMeta | null;
  isTR: boolean;
  onTopicSelect: (topic: DocsTopicId) => void;
  onSelectComponent?: (componentId: string) => void;
}

export const DocsChapterFooter: React.FC<DocsChapterFooterProps> = ({
  prevChapter,
  nextChapter,
  isTR,
  onTopicSelect,
  onSelectComponent,
}) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 12,
          paddingTop: 16,
          borderTop: '1px solid var(--uxu-border-subtle)',
        }}
      >
        {prevChapter ? (
          <Button
            variant="tonal"
            onClick={() => onTopicSelect(prevChapter.id)}
          >
            ← {isTR ? prevChapter.titleTr : prevChapter.titleEn}
          </Button>
        ) : (
          <div />
        )}

        {nextChapter && (
          <Button
            variant="filled"
            onClick={() => onTopicSelect(nextChapter.id)}
          >
            {isTR ? nextChapter.titleTr : nextChapter.titleEn} →
          </Button>
        )}
      </div>

      <div id="doc-sec-all-catalog">
        <Card
          variant="glass"
          padding="md"
          eyebrow={
            isTR
              ? 'BİLEŞEN KATALOĞU & PLAYGROUND DİZİNİ'
              : 'COMPONENT CATALOG & PLAYGROUND DIRECTORY'
          }
          title={
            isTR
              ? 'Bileşen Laboratuvarına (Playground) Hızlı Geçiş'
              : 'Quick Jump to Component Playground'
          }
          subtitle={
            isTR
              ? 'Herhangi bir bileşene tıklayarak tam ekran canlı Prop Denetçisi ve Playground sayfasını açın.'
              : 'Click any component to open its full-screen interactive Prop Inspector and Playground.'
          }
          headerIcon={<Layers size={19} />}
        >
          <div className="uxu-comp-directory-grid">
            {COMPONENT_CATALOG.map((comp) => {
              const compHref = RouteService.buildComponentPath(comp.id);
              return (
                <a
                  key={comp.id}
                  href={compHref}
                  title={compHref}
                  className="uxu-comp-dir-card"
                  onClick={(e) => {
                    if (RouteService.isModifiedClick(e)) return;
                    e.preventDefault();
                    onSelectComponent?.(comp.id);
                  }}
                >
                  <div className="uxu-comp-dir-card__top">
                    <strong>{isTR ? comp.turkishTitle : comp.name}</strong>
                    <ArrowRight size={14} className="uxu-comp-dir-card__arrow" />
                  </div>
                  <span className="uxu-comp-dir-card__tr">{comp.name}</span>
                  <p className="uxu-comp-dir-card__desc">{comp.summary}</p>
                  <div className="uxu-comp-dir-card__footer">
                    <code>{compHref}</code>
                    <span>
                      {comp.propsTable.length} Prop • {comp.examples.length}{' '}
                      {isTR ? 'Örnek' : 'Examples'}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
};
