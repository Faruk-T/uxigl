import React from 'react';
import { ArrowRight, Check, Copy, Sparkles } from 'lucide-react';
import { Badge, Button } from '../../../components/primitives';
import { CodeGeneratorService } from '../../../core/services/CodeGeneratorService';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { useToast } from '../../../providers/ToastProvider';
import type { ComponentDocCardProps } from '../types';

export const ComponentDocCard: React.FC<ComponentDocCardProps> = ({
  guide,
  isTR,
  onOpenPlayground,
}) => {
  const { notify } = useToast();
  const { copiedText, copy } = useCopyToClipboard();
  const isCodeCopied = copiedText === guide.code;
  const isImportCopied = copiedText === guide.importStatement;

  return (
    <div
      id={`doc-comp-${guide.id}`}
      style={{
        borderRadius: 'var(--uxu-radius-lg, 16px)',
        border: '1px solid var(--uxu-border-subtle)',
        background: 'var(--uxu-bg-elevated)',
        padding: 'clamp(16px, 2.5vw, 24px)',
        boxShadow: 'var(--uxu-shadow-card)',
        scrollMarginTop: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          paddingBottom: 14,
          borderBottom: '1px solid var(--uxu-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              background: 'var(--uxu-primary-container)',
              color: 'var(--uxu-primary)',
              fontFamily: 'var(--uxu-font-mono)',
              fontWeight: 800,
              fontSize: '0.84rem',
            }}
          >
            {guide.tag}
          </span>
          <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800 }}>
            {isTR ? guide.titleTr : guide.titleEn}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="neutral" variant="tonal" size="xs">
            {isTR ? guide.categoryLabelTr : guide.categoryLabelEn}
          </Badge>
          {guide.playgroundId && onOpenPlayground && (
            <Button
              variant="tonal"
              size="xs"
              trailingIcon={<ArrowRight size={13} />}
              onClick={() => onOpenPlayground(guide.playgroundId!)}
            >
              {isTR ? 'Playground’da Aç' : 'Open Playground'}
            </Button>
          )}
        </div>
      </div>

      <p
        style={{
          margin: '12px 0 10px',
          color: 'var(--uxu-text-secondary)',
          fontSize: '0.92rem',
          lineHeight: 1.55,
        }}
      >
        {isTR ? guide.summaryTr : guide.summaryEn}
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 10,
          background: 'var(--uxu-surface-tonal)',
          border: '1px solid var(--uxu-border-subtle)',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
          <Sparkles size={14} style={{ color: 'var(--uxu-primary)', flexShrink: 0 }} />
          <span>{isTR ? guide.architectureNoteTr : guide.architectureNoteEn}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            copy(guide.importStatement);
            notify({
              title: isTR ? 'Import Kopyalandı' : 'Import Copied',
              description: guide.importStatement,
              tone: 'success',
            });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 7,
            border: '1px solid var(--uxu-border-subtle)',
            background: 'var(--uxu-bg-elevated)',
            color: 'var(--uxu-text-primary)',
            fontFamily: 'var(--uxu-font-mono)',
            fontSize: '0.76rem',
            cursor: 'pointer',
          }}
        >
          <code>{guide.importStatement}</code>
          {isImportCopied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: '1px dashed var(--uxu-border-strong)',
          background: 'var(--uxu-bg-canvas)',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--uxu-text-muted)',
            marginBottom: 10,
          }}
        >
          {isTR ? 'Canlı Etkileşimli Önizleme' : 'Live Interactive Preview'}
        </div>
        {guide.renderLiveDemo()}
      </div>

      <div className="uxu-code-panel-wrapper" style={{ marginBottom: 14 }}>
        <div className="uxu-code-panel-header">
          <span>{isTR ? 'Kullanım Kodu (TSX)' : 'Usage Snippet (TSX)'}</span>
          <Button
            variant="tonal"
            size="xs"
            leadingIcon={isCodeCopied ? <Check size={13} /> : <Copy size={13} />}
            onClick={() => {
              copy(guide.code);
              notify({
                title: isTR ? 'Kod Kopyalandı' : 'Code Copied',
                description: guide.tag,
                tone: 'success',
              });
            }}
          >
            {isCodeCopied
              ? isTR
                ? 'Kopyalandı'
                : 'Copied'
              : isTR
              ? 'Kodu Kopyala'
              : 'Copy Code'}
          </Button>
        </div>
        <pre className="uxu-code-block">
          <code>
            {CodeGeneratorService.tokenize(guide.code).map((tok, idx) =>
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

      <div className="uxu-props-table-scroll">
        <table className="uxu-props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>{isTR ? 'Tip' : 'Type'}</th>
              <th>{isTR ? 'Varsayılan' : 'Default'}</th>
              <th>{isTR ? 'Açıklama' : 'Description'}</th>
            </tr>
          </thead>
          <tbody>
            {guide.propsTable.map((row) => (
              <tr key={row.name}>
                <td>
                  <code className="uxu-prop-name">{row.name}</code>
                  {row.required && <span className="uxu-prop-req">*</span>}
                </td>
                <td>
                  <code className="uxu-prop-type">{row.type}</code>
                </td>
                <td>
                  <code className="uxu-prop-default">{row.defaultValue}</code>
                </td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
