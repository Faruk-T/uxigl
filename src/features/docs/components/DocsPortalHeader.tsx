import React from 'react';
import { BookOpen } from 'lucide-react';
import { Badge } from '../../../components/primitives';
import { Card, SegmentedControl } from '../../../components/composites';
import { RouteService } from '../../../core/services/RouteService';
import type { DocChapterMeta, DocsTopicId } from '../types';

export interface DocsPortalHeaderProps {
  chapters: DocChapterMeta[];
  currentTopic: DocsTopicId;
  lang: 'tr' | 'en';
  onLangChange: (lang: 'tr' | 'en') => void;
  onTopicSelect: (topic: DocsTopicId) => void;
}

export const DocsPortalHeader: React.FC<DocsPortalHeaderProps> = ({
  chapters,
  currentTopic,
  lang,
  onLangChange,
  onTopicSelect,
}) => {
  const isTR = lang === 'tr';

  return (
    <Card
      variant="glass"
      padding="md"
      eyebrow={
        isTR
          ? 'UXIGL KAPSAMLI DOKÜMANTASYON PORTALI (TÜM BİLEŞENLER, TASARIM TÜRLERİ & TEMALAR)'
          : 'UXIGL COMPREHENSIVE DOCUMENTATION PORTAL (ALL COMPONENTS, DESIGN TYPES & THEMES)'
      }
      title={
        isTR
          ? 'uxiGL Mimari, Bileşen, Tasarım Türü & Tema Dokümantasyonu'
          : 'uxiGL Architecture, Component, Design System & Theme Documentation'
      }
      subtitle={
        isTR
          ? '8 ana bölüm, 40+ bileşen ve motor rehberi, tasarım türleri, tema ayarları, Props API tabloları ve 8 hazır sayfa şablonu.'
          : '8 chapters, 40+ component and engine guides, design types, theme settings, Props API tables, and 8 ready-made page templates.'
      }
      headerIcon={<BookOpen size={20} />}
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SegmentedControl<'tr' | 'en'>
            size="sm"
            value={lang}
            onChange={onLangChange}
            options={[
              { value: 'tr', label: '🇹🇷 TR' },
              { value: 'en', label: '🇬🇧 EN' },
            ]}
          />
          <Badge tone="primary" variant="tonal" pulse size="sm">
            v{__UXIGL_VERSION__}
          </Badge>
        </div>
      }
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {chapters.map((ch) => {
          const active = ch.id === currentTopic;
          return (
            <a
              key={ch.id}
              href={`/docs/${ch.id}`}
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onTopicSelect(ch.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 'var(--uxu-radius-md)',
                border: active
                  ? '1.5px solid var(--uxu-primary)'
                  : '1px solid var(--uxu-border-subtle)',
                background: active
                  ? 'var(--uxu-primary-container)'
                  : 'var(--uxu-surface-tonal)',
                color: active ? 'var(--uxu-primary)' : 'var(--uxu-text-primary)',
                fontSize: '0.78rem',
                fontWeight: active ? 700 : 600,
                textDecoration: 'none',
                transition: 'all 140ms ease',
              }}
            >
              {ch.icon}
              <span>{isTR ? ch.titleTr.split(' (')[0] : ch.titleEn.split(' (')[0]}</span>
            </a>
          );
        })}
      </div>
    </Card>
  );
};
