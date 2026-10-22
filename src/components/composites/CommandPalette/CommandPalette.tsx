import React, { useMemo, useState, useEffect } from 'react';
import { Search, CornerDownLeft, Sparkles } from 'lucide-react';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

/**
 * ============================================================================
 * uxiGL COMPOSITE — SPOTLIGHT COMMAND PALETTE (⌘K / Ctrl+K)
 * ============================================================================
 * Inspired by Apple macOS Spotlight & Raycast + Google Search Assist chips.
 */

export interface CommandActionItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: CommandActionItem[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  actions,
  placeholder = 'Bileşen, tema, SOLID prensibi veya komut ara...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useKeyboardShortcut('Escape', onClose, { enabled: open });

  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredActions.length > 0 ? (prev + 1) % filteredActions.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredActions.length > 0
          ? (prev - 1 + filteredActions.length) % filteredActions.length
          : 0
      );
    } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
      e.preventDefault();
      filteredActions[selectedIndex].onSelect();
      onClose();
    }
  };

  return (
    <div
      className="uxu-modal-backdrop uxu-cmd-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="uxu-cmd-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Komut Paleti"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="uxu-cmd-palette__search">
          <Search size={19} className="uxu-cmd-palette__search-icon" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="uxu-cmd-palette__input"
          />
          <kbd className="uxu-cmd-palette__esc" onClick={onClose}>
            ESC
          </kbd>
        </div>

        <div className="uxu-cmd-palette__list">
          {filteredActions.length === 0 ? (
            <div className="uxu-cmd-palette__empty">
              <Sparkles size={22} />
              <p>&ldquo;{query}&rdquo; ile eşleşen bir komut bulunamadı.</p>
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  className={`uxu-cmd-palette__item ${
                    isSelected ? 'uxu-cmd-palette__item--selected' : ''
                  }`}
                >
                  <div className="uxu-cmd-palette__item-left">
                    {item.icon && (
                      <span className="uxu-cmd-palette__item-icon">
                        {item.icon}
                      </span>
                    )}
                    <div>
                      <div className="uxu-cmd-palette__item-title">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="uxu-cmd-palette__item-sub">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="uxu-cmd-palette__item-right">
                    <span className="uxu-cmd-palette__category">
                      {item.category}
                    </span>
                    {item.shortcut ? (
                      <kbd className="uxu-cmd-palette__kbd">
                        {item.shortcut}
                      </kbd>
                    ) : (
                      <CornerDownLeft
                        size={14}
                        className="uxu-cmd-palette__enter-icon"
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="uxu-cmd-palette__footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> Gezin
          </span>
          <span>
            <kbd>↵</kbd> Çalıştır
          </span>
          <span>
            <kbd>ESC</kbd> Kapat
          </span>
        </div>
      </div>
    </div>
  );
};
