import React from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type {
  IdentifiableProps,
  SemanticTone,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL COMPOSITES — STEPPER, TIMELINE & PAGINATION
 * ============================================================================
 * 1. `Stepper`    — Multi-step workflow indicator (B2B checkout, onboarding, approvals)
 * 2. `Timeline`   — Vertical audit log & milestone feed with semantic status nodes
 * 3. `Pagination` — Page navigation & page-size control for data tables
 */

export interface StepperItem {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  badge?: string;
  meta?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'active' | 'upcoming' | 'error';
}

export interface StepperProps extends IdentifiableProps {
  steps: StepperItem[];
  activeStepIndex?: number;
  activeStep?: number;
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper: React.FC<StepperProps> = ({
  id,
  className = '',
  style,
  steps,
  activeStepIndex,
  activeStep,
  onStepClick,
  orientation = 'horizontal',
}) => {
  const effectiveActiveIndex = activeStepIndex ?? activeStep ?? 0;
  return (
    <div
      id={id}
      style={style}
      className={[
        'uxu-stepper',
        `uxu-stepper--${orientation}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {steps.map((step, index) => {
        const computedStatus =
          step.status ??
          (index < effectiveActiveIndex
            ? 'completed'
            : index === effectiveActiveIndex
            ? 'active'
            : 'upcoming');

        const isClickable = Boolean(onStepClick);

        return (
          <div
            key={step.id}
            onClick={() => onStepClick?.(index)}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onStepClick?.(index);
              }
            }}
            className={[
              'uxu-stepper__item',
              `uxu-stepper__item--${computedStatus}`,
              isClickable ? 'uxu-stepper__item--clickable' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="uxu-stepper__indicator-col">
              <div className="uxu-stepper__circle">
                {computedStatus === 'completed' ? (
                  <Check size={14} />
                ) : computedStatus === 'error' ? (
                  <AlertCircle size={14} />
                ) : (
                  step.icon ?? <span>{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`uxu-stepper__connector ${
                    index < effectiveActiveIndex
                      ? 'uxu-stepper__connector--done'
                      : ''
                  }`}
                />
              )}
            </div>

            <div className="uxu-stepper__content">
              <div className="uxu-stepper__title-row">
                <span className="uxu-stepper__title">{step.title}</span>
                {(step.badge ?? step.meta) && (
                  <span className="uxu-stepper__badge">
                    {step.badge ?? step.meta}
                  </span>
                )}
              </div>
              {(step.description ?? step.subtitle) && (
                <span className="uxu-stepper__desc">
                  {step.description ?? step.subtitle}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface TimelineEventItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
  tone?: SemanticTone;
  icon?: React.ReactNode;
  badge?: string;
}

export interface TimelineProps extends IdentifiableProps {
  items: TimelineEventItem[];
}

export const Timeline: React.FC<TimelineProps> = ({
  id,
  className = '',
  style,
  items,
}) => {
  return (
    <div
      id={id}
      style={style}
      className={['uxu-timeline', className].filter(Boolean).join(' ')}
    >
      {items.map((item, idx) => {
        const tone = item.tone ?? 'primary';
        const isLast = idx === items.length - 1;
        return (
          <div key={item.id} className="uxu-timeline__item">
            <div className="uxu-timeline__rail">
              <span className={`uxu-timeline__dot uxu-timeline__dot--${tone}`}>
                {item.icon ?? <Clock size={12} />}
              </span>
              {!isLast && <span className="uxu-timeline__line" />}
            </div>

            <div className="uxu-timeline__body">
              <div className="uxu-timeline__header">
                <div className="uxu-timeline__title-group">
                  <strong className="uxu-timeline__title">{item.title}</strong>
                  {item.badge && (
                    <span
                      className={`uxu-select-option__badge uxu-select-option__badge--${tone}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="uxu-timeline__time">{item.timestamp}</span>
              </div>
              {item.description && (
                <p className="uxu-timeline__desc">{item.description}</p>
              )}
              {item.actor && (
                <span className="uxu-timeline__actor">
                  İşlemi Yapan: <strong>{item.actor}</strong>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface PaginationProps extends IdentifiableProps {
  currentPage?: number;
  page?: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange?: (nextSize: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  id,
  className = '',
  style,
  currentPage,
  page,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
}) => {
  const resolvedPage = currentPage ?? page ?? 1;
  const pages = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

  return (
    <div
      id={id}
      style={style}
      className={['uxu-pagination', className].filter(Boolean).join(' ')}
    >
      <div className="uxu-pagination__info">
        {totalItems !== undefined ? (
          <span>
            Toplam <strong>{totalItems}</strong> kayıt • Sayfa{' '}
            <strong>
              {resolvedPage} / {Math.max(1, totalPages)}
            </strong>
          </span>
        ) : (
          <span>
            Sayfa{' '}
            <strong>
              {resolvedPage} / {Math.max(1, totalPages)}
            </strong>
          </span>
        )}

        {onPageSizeChange && (
          <select
            className="uxu-pagination__size-select"
            value={pageSize}
            aria-label="Sayfa başına kayıt sayısı"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((sz) => (
              <option key={sz} value={sz}>
                {sz} / sayfa
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="uxu-pagination__controls">
        <button
          type="button"
          className="uxu-pagination__btn"
          disabled={resolvedPage <= 1}
          onClick={() => onPageChange(Math.max(1, resolvedPage - 1))}
          aria-label="Önceki sayfa"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`uxu-pagination__btn ${
              p === resolvedPage ? 'uxu-pagination__btn--active' : ''
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="uxu-pagination__btn"
          disabled={resolvedPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, resolvedPage + 1))}
          aria-label="Sonraki sayfa"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
