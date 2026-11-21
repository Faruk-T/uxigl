import React from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Input } from '../../../components/primitives';
import { Card } from '../../../components/composites';
import type { DocChapterMeta, DocSubNavItem, DocsTopicId } from '../types';

export interface DocsSidebarNavProps {
  visibleChapters: DocChapterMeta[];
  currentTopic: DocsTopicId;
  activeSubId: string;
  expandedChapters: Record<string, boolean>;
  searchQuery: string;
  isTR: boolean;
  onSearchChange: (q: string) => void;
  onTopicSelect: (topic: DocsTopicId) => void;
  onToggleExpand: (topic: DocsTopicId) => void;
  onSubItemClick: (chapterId: DocsTopicId, sub: DocSubNavItem) => void;
}

export const DocsSidebarNav: React.FC<DocsSidebarNavProps> = ({
  visibleChapters,
  currentTopic,
  activeSubId,
  expandedChapters,
  searchQuery,
  isTR,
  onSearchChange,
  onTopicSelect,
  onToggleExpand,
  onSubItemClick,
}) => {
  return (
    <Card
      variant="glass"
      padding="sm"
      style={{
        position: 'sticky',
        top: 12,
        maxHeight: 'calc(100vh - 96px)',
        overflowY: 'auto',
      }}
    >
      <div className="uxu-stack-sm">
        <Input
          size="sm"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={
            isTR
              ? 'Bileşen veya konu ara (Buton, Tema...)'
              : 'Search components or topics...'
          }
          leadingIcon={<Search size={14} />}
          clearable
        />

        <div className="uxu-stack-xs" style={{ gap: 4 }}>
          {visibleChapters.map((ch) => {
            const isActiveChapter = ch.id === currentTopic;
            const isExpanded =
              expandedChapters[ch.id] ?? isActiveChapter ?? false;

            return (
              <div key={ch.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isActiveChapter) {
                      onToggleExpand(ch.id);
                    } else {
                      onTopicSelect(ch.id);
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '9px 10px',
                    borderRadius: 'var(--uxu-radius-md)',
                    border: isActiveChapter
                      ? '1px solid var(--uxu-primary)'
                      : '1px solid transparent',
                    background: isActiveChapter
                      ? 'var(--uxu-primary-container)'
                      : 'transparent',
                    color: isActiveChapter
                      ? 'var(--uxu-primary)'
                      : 'var(--uxu-text-primary)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {ch.icon}
                    <span>{isTR ? ch.titleTr : ch.titleEn}</span>
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                {isExpanded && ch.subItems.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      paddingLeft: 18,
                      marginTop: 4,
                      marginBottom: 6,
                      borderLeft: '1px solid var(--uxu-border-subtle)',
                      marginLeft: 12,
                    }}
                  >
                    {ch.subItems.map((sub) => {
                      const isSubActive =
                        isActiveChapter && activeSubId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onSubItemClick(ch.id, sub)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: 'none',
                            background: isSubActive
                              ? 'var(--uxu-surface-tonal-high)'
                              : 'transparent',
                            color: isSubActive
                              ? 'var(--uxu-primary)'
                              : 'var(--uxu-text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: isSubActive ? 700 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          {isTR ? sub.labelTr : sub.labelEn}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
