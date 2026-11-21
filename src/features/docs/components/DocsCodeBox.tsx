import React from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../../../components/primitives';
import { CodeGeneratorService } from '../../../core/services/CodeGeneratorService';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { useToast } from '../../../providers/ToastProvider';

export interface DocsCodeBoxProps {
  title: string;
  code: string;
  isTR: boolean;
}

export const DocsCodeBox: React.FC<DocsCodeBoxProps> = ({
  title,
  code,
  isTR,
}) => {
  const { notify } = useToast();
  const { copiedText, copy } = useCopyToClipboard();
  const isCopied = copiedText === code;

  return (
    <div className="uxu-code-panel-wrapper">
      <div className="uxu-code-panel-header">
        <span>{title}</span>
        <Button
          variant="tonal"
          size="xs"
          leadingIcon={isCopied ? <Check size={13} /> : <Copy size={13} />}
          onClick={() => {
            copy(code);
            notify({
              title: isTR ? 'Kod Panoya Kopyalandı' : 'Code Copied',
              description: title,
              tone: 'success',
            });
          }}
        >
          {isCopied
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
          {CodeGeneratorService.tokenize(code).map((tok, idx) =>
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
  );
};
