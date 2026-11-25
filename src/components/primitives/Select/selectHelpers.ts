import type { InputSurfaceStyle } from '../Input/Input';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import type {
  DisableableProps,
  IdentifiableProps,
  SemanticTone,
  SizableProps,
} from '../../../core/contracts/ComponentContracts';
import type { InputValidationState } from '../Input/Input';

export interface SelectOptionItem {
  value: string;
  label: string;
  description?: string;
  group?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeTone?: SemanticTone;
  disabled?: boolean;
}

export interface SelectProps
  extends IdentifiableProps,
    DisableableProps,
    SizableProps {
  label?: React.ReactNode;
  value: string;
  onChange: (nextValue: string) => void;
  options: SelectOptionItem[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  surface?: InputSurfaceStyle;
  validationState?: InputValidationState;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  successText?: React.ReactNode;
  warningText?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  required?: boolean;
}

export const foldTrSearch = (input: string): string =>
  input
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

export function useSelectPortalPosition(
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  searchable: boolean,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  popoverRef: React.RefObject<HTMLDivElement | null>
) {
  const [popoverPos, setPopoverPos] = useState<React.CSSProperties>({});
  const [optionsMaxHeight, setOptionsMaxHeight] = useState<number>(240);

  const updatePopoverPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    if ((rect.width === 0 && rect.height === 0) || rect.bottom < 0 || rect.top > viewportH) {
      setOpen(false);
      return;
    }

    const spaceBelow = viewportH - rect.bottom - 10;
    const spaceAbove = rect.top - 10;
    const openUpward = spaceBelow < 210 && spaceAbove > spaceBelow;
    const maxHeight = Math.round(Math.max(140, Math.min(310, openUpward ? spaceAbove : spaceBelow)));
    const width = Math.round(Math.min(viewportW - 16, Math.max(rect.width, 200)));
    const left = Math.round(Math.max(8, Math.min(rect.left, viewportW - width - 8)));

    setOptionsMaxHeight(Math.max(92, maxHeight - (searchable ? 54 : 14)));
    setPopoverPos({
      position: 'fixed',
      left,
      right: 'auto',
      width,
      maxHeight,
      top: openUpward ? 'auto' : Math.round(rect.bottom + 5),
      bottom: openUpward ? Math.round(viewportH - rect.top + 5) : 'auto',
      zIndex: 10050,
      margin: 0,
    });
  }, [searchable, setOpen, triggerRef]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePopoverPosition();

    const onScroll = (e: Event) => {
      if (popoverRef.current && e.target instanceof Node && popoverRef.current.contains(e.target)) {
        return;
      }
      updatePopoverPosition();
    };
    const onResize = () => updatePopoverPosition();

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, popoverRef, updatePopoverPosition]);

  return { popoverPos, optionsMaxHeight, updatePopoverPosition };
}
