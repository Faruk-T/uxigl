import { useState, useCallback } from 'react';

/**
 * [SRP] Single-responsibility hook for clipboard copy interactions with
 * automatic feedback state reset.
 */
export function useCopyToClipboard(resetDelayMs = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setCopiedText(text);
        window.setTimeout(() => {
          setCopiedText(null);
        }, resetDelayMs);
        return true;
      } catch {
        setCopiedText(null);
        return false;
      }
    },
    [resetDelayMs]
  );

  return {
    copied: Boolean(copiedText),
    copiedText,
    copy,
  };
}
