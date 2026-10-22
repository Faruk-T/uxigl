import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { IdentifiableProps } from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU COMPOSITE — ACCORDION
 * ============================================================================
 * Smooth expandable disclosure panels with single or multiple expansion mode.
 */

export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps extends IdentifiableProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  variant?: 'glass' | 'tonal' | 'outlined';
}

export const Accordion: React.FC<AccordionProps> = ({
  id,
  className = '',
  style,
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  variant = 'glass',
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

  const toggleItem = (itemId: string) => {
    setExpandedIds((prev) => {
      const isOpen = prev.includes(itemId);
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== itemId) : [...prev, itemId];
      }
      return isOpen ? [] : [itemId];
    });
  };

  return (
    <div
      id={id}
      className={`uxu-accordion uxu-accordion--${variant} ${className}`}
      style={style}
    >
      {items.map((item) => {
        const isOpen = expandedIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={`uxu-accordion__item ${
              isOpen ? 'uxu-accordion__item--open' : ''
            }`}
          >
            <button
              type="button"
              className="uxu-accordion__trigger"
              aria-expanded={isOpen}
              onClick={() => toggleItem(item.id)}
            >
              <div className="uxu-accordion__trigger-left">
                {item.icon && (
                  <span className="uxu-accordion__icon">{item.icon}</span>
                )}
                <div>
                  <div className="uxu-accordion__title">{item.title}</div>
                  {item.subtitle && (
                    <div className="uxu-accordion__subtitle">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`uxu-accordion__chevron ${
                  isOpen ? 'uxu-accordion__chevron--open' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="uxu-accordion__content">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};
