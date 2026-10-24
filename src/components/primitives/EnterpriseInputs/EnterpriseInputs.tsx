import React, { useId, useRef, useState } from 'react';
import {
  Calendar,
  Clock,
  UploadCloud,
  FileText,
  FileCode2,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  Tag,
  Calculator,
} from 'lucide-react';
import type { ComponentSize } from '../../../core/contracts/ComponentContracts';
import type { InputSurfaceStyle, InputValidationState } from '../Input/Input';

/**
 * ============================================================================
 * uxiGL PRIMITIVES — ENTERPRISE FORM CONTROLS (B2B, ACCOUNTING, E-COMMERCE)
 * ============================================================================
 * 1. `CurrencyInput`        — Multi-currency accounting input + live VAT helper
 * 2. `DateTimePickerInput`  — Date & Time picker with payment-term quick chips
 * 3. `MultiSelectTagInput`  — Chip/Tag multi-select with keyboard creation
 * 4. `FileUploadDropzone`   — Drag & Drop file uploader with progress & list
 */

export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP';

export const CURRENCY_META: Record<
  CurrencyCode,
  { code: CurrencyCode; symbol: string; label: string; locale: string }
> = {
  TRY: { code: 'TRY', symbol: '₺', label: '₺ TRY', locale: 'tr-TR' },
  USD: { code: 'USD', symbol: '$', label: '$ USD', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', label: '€ EUR', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', label: '£ GBP', locale: 'en-GB' },
};

export interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (nextAmount: number) => void;
  currency?: CurrencyCode;
  onCurrencyChange?: (nextCurrency: CurrencyCode) => void;
  vatRate?: number; // e.g., 20 for 20% KDV
  showVatBreakdown?: boolean;
  surface?: InputSurfaceStyle;
  size?: ComponentSize;
  validationState?: InputValidationState;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label = 'Fatura / Ödeme Tutarı',
  value,
  onChange,
  currency = 'TRY',
  onCurrencyChange,
  vatRate = 20,
  showVatBreakdown = true,
  surface = 'glass',
  validationState = 'default',
  helperText,
  disabled = false,
  required = false,
}) => {
  const inputId = useId();
  const meta = CURRENCY_META[currency] ?? CURRENCY_META.TRY;
  const [rawText, setRawText] = useState<string>(() =>
    value.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
  const [isFocused, setIsFocused] = useState(false);

  const displayedValue = isFocused
    ? rawText
    : value.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setRawText(text);
    const normalized = text.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(normalized);
    if (!Number.isNaN(parsed)) {
      onChange(Math.max(0, Math.round(parsed * 100) / 100));
    } else if (text.trim() === '') {
      onChange(0);
    }
  };

  const vatAmount = Math.round(value * (vatRate / 100) * 100) / 100;
  const grossTotal = Math.round((value + vatAmount) * 100) / 100;

  return (
    <div className="uxu-field">
      <div className="uxu-field__header">
        {label && (
          <label htmlFor={inputId} className="uxu-field__label">
            {label}
            {required && <span className="uxu-field__required">*</span>}
          </label>
        )}
        {showVatBreakdown && (
          <span className="uxu-currency-vat-pill">
            <Calculator size={11} /> %{vatRate} KDV Dahil:{' '}
            <strong>
              {meta.symbol}
              {grossTotal.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </span>
        )}
      </div>

      <div
        className={`uxu-input-box uxu-input-box--${surface} uxu-input-box--md ${
          validationState !== 'default' ? `uxu-input-box--${validationState}` : ''
        } ${disabled ? 'uxu-input-box--disabled' : ''}`}
      >
        <select
          className="uxu-currency-select"
          value={currency}
          disabled={disabled}
          aria-label="Para birimi seçin"
          onChange={(e) => onCurrencyChange?.(e.target.value as CurrencyCode)}
        >
          {Object.values(CURRENCY_META).map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <span className="uxu-currency-symbol">{meta.symbol}</span>

        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={displayedValue}
          onFocus={() => {
            setIsFocused(true);
            setRawText(
              value.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
          }}
          onBlur={() => setIsFocused(false)}
          onChange={handleTextChange}
          className="uxu-input-box__native uxu-input-box__native--mono uxu-currency-native"
          placeholder="0,00"
        />

        <div className="uxu-currency-quick-steps">
          <button
            type="button"
            disabled={disabled}
            className="uxu-currency-step-btn"
            onClick={() => onChange(Math.round((value + 1000) * 100) / 100)}
          >
            +1B
          </button>
          <button
            type="button"
            disabled={disabled}
            className="uxu-currency-step-btn"
            onClick={() => onChange(Math.round((value + 10000) * 100) / 100)}
          >
            +10B
          </button>
        </div>
      </div>

      {helperText && (
        <div
          className={`uxu-field__helper ${
            validationState !== 'default'
              ? `uxu-field__helper--${validationState}`
              : ''
          }`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export interface DateTimePickerInputProps {
  label?: string;
  dateValue: string;
  timeValue?: string;
  onDateChange: (nextDate: string) => void;
  onTimeChange?: (nextTime: string) => void;
  includeTime?: boolean;
  showPresets?: boolean;
  surface?: InputSurfaceStyle;
  size?: ComponentSize;
  validationState?: InputValidationState;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

export const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({
  label = 'İşlem & Vade Tarihi',
  dateValue,
  timeValue = '14:30',
  onDateChange,
  onTimeChange,
  includeTime = true,
  showPresets = true,
  surface = 'glass',
  validationState = 'default',
  helperText,
  disabled = false,
  required = false,
}) => {
  const inputId = useId();

  const applyOffsetDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().slice(0, 10));
  };

  const applyEndOfMonth = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    onDateChange(lastDay.toISOString().slice(0, 10));
  };

  return (
    <div className="uxu-field">
      <div className="uxu-field__header">
        {label && (
          <label htmlFor={inputId} className="uxu-field__label">
            {label}
            {required && <span className="uxu-field__required">*</span>}
          </label>
        )}
        {showPresets && (
          <div className="uxu-date-presets">
            <button
              type="button"
              disabled={disabled}
              className="uxu-date-preset-chip"
              onClick={() => applyOffsetDays(0)}
            >
              Bugün
            </button>
            <button
              type="button"
              disabled={disabled}
              className="uxu-date-preset-chip"
              onClick={() => applyOffsetDays(15)}
            >
              +15G Vade
            </button>
            <button
              type="button"
              disabled={disabled}
              className="uxu-date-preset-chip"
              onClick={() => applyOffsetDays(30)}
            >
              +30G Vade
            </button>
            <button
              type="button"
              disabled={disabled}
              className="uxu-date-preset-chip"
              onClick={applyEndOfMonth}
            >
              Ay Sonu
            </button>
          </div>
        )}
      </div>

      <div className="uxu-datetime-row">
        <div
          className={`uxu-input-box uxu-input-box--${surface} uxu-input-box--md ${
            validationState !== 'default'
              ? `uxu-input-box--${validationState}`
              : ''
          } ${disabled ? 'uxu-input-box--disabled' : ''}`}
          style={{ flex: 1.4 }}
        >
          <span className="uxu-input-box__icon">
            <Calendar size={15} />
          </span>
          <input
            id={inputId}
            type="date"
            disabled={disabled}
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            className="uxu-input-box__native uxu-input-box__native--mono"
          />
        </div>

        {includeTime && (
          <div
            className={`uxu-input-box uxu-input-box--${surface} uxu-input-box--md ${
              validationState !== 'default'
                ? `uxu-input-box--${validationState}`
                : ''
            } ${disabled ? 'uxu-input-box--disabled' : ''}`}
            style={{ flex: 1 }}
          >
            <span className="uxu-input-box__icon">
              <Clock size={15} />
            </span>
            <input
              type="time"
              disabled={disabled}
              value={timeValue}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className="uxu-input-box__native uxu-input-box__native--mono"
            />
          </div>
        )}
      </div>

      {helperText && (
        <div
          className={`uxu-field__helper ${
            validationState !== 'default'
              ? `uxu-field__helper--${validationState}`
              : ''
          }`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export interface MultiSelectTagInputProps {
  label?: string;
  tags: string[];
  onChange: (nextTags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
  placeholder?: string;
  surface?: InputSurfaceStyle;
  validationState?: InputValidationState;
  helperText?: string;
  disabled?: boolean;
}

export const MultiSelectTagInput: React.FC<MultiSelectTagInputProps> = ({
  label = 'Kurumsal Etiketler & Maliyet Merkezleri',
  tags,
  onChange,
  suggestions = [
    'e-Fatura Mükellefi',
    'SOC2-Type-II',
    'KDV İstisna',
    'Öncelikli Lojistik',
    'Kurumsal VIP',
    'ISO-27001',
  ],
  maxTags = 8,
  placeholder = 'Etiket yazıp Enter tuşuna basın...',
  surface = 'glass',
  validationState = 'default',
  helperText,
  disabled = false,
}) => {
  const [draft, setDraft] = useState('');

  const addTag = (raw: string) => {
    const clean = raw.trim();
    if (!clean || tags.includes(clean) || tags.length >= maxTags) return;
    onChange([...tags, clean]);
    setDraft('');
  };

  const removeTag = (target: string) => {
    if (disabled) return;
    onChange(tags.filter((t) => t !== target));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const availableSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div className="uxu-field">
      <div className="uxu-field__header">
        {label && <label className="uxu-field__label">{label}</label>}
        <span className="uxu-field__counter">
          {tags.length}/{maxTags} Etiket
        </span>
      </div>

      <div
        className={`uxu-tag-input-box uxu-input-box--${surface} ${
          validationState !== 'default'
            ? `uxu-input-box--${validationState}`
            : ''
        } ${disabled ? 'uxu-input-box--disabled' : ''}`}
      >
        {tags.map((tag) => (
          <span key={tag} className="uxu-tag-pill">
            <Tag size={11} />
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                className="uxu-tag-pill__remove"
                onClick={() => removeTag(tag)}
                aria-label={`${tag} etiketini kaldır`}
              >
                <X size={11} />
              </button>
            )}
          </span>
        ))}

        {tags.length < maxTags && (
          <input
            type="text"
            value={draft}
            disabled={disabled}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Yeni ekle...'}
            className="uxu-tag-input__native"
          />
        )}
      </div>

      {availableSuggestions.length > 0 && !disabled && (
        <div className="uxu-tag-suggestions">
          <span className="uxu-tag-suggestions__label">Hızlı Ekle:</span>
          {availableSuggestions.slice(0, 5).map((item) => (
            <button
              key={item}
              type="button"
              className="uxu-tag-suggestion-btn"
              onClick={() => addTag(item)}
            >
              <Plus size={11} /> {item}
            </button>
          ))}
        </div>
      )}

      {helperText && (
        <div
          className={`uxu-field__helper ${
            validationState !== 'default'
              ? `uxu-field__helper--${validationState}`
              : ''
          }`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export interface UploadedFileItem {
  id: string;
  name: string;
  sizeKb: number;
  type: 'pdf' | 'xml' | 'image' | 'doc';
  progress: number;
  status: 'uploading' | 'completed';
}

export interface FileUploadDropzoneProps {
  label?: string;
  files: UploadedFileItem[];
  onChange: (nextFiles: UploadedFileItem[]) => void;
  acceptLabel?: string;
  maxSizeMb?: number;
  disabled?: boolean;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  label = 'Kurumsal Belge & e-Fatura Ekleri (Drag & Drop)',
  files,
  onChange,
  acceptLabel = 'PDF, UBL-TR XML, PNG, XLSX (Maks. 25 MB)',
  maxSizeMb = 25,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const inferType = (name: string): UploadedFileItem['type'] => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.xml') || lower.endsWith('.json')) return 'xml';
    if (
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.webp')
    ) {
      return 'image';
    }
    if (lower.endsWith('.pdf')) return 'pdf';
    return 'doc';
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return;
    const added: UploadedFileItem[] = Array.from(fileList).map((f, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: f.name,
      sizeKb: Math.max(12, Math.round(f.size / 1024)),
      type: inferType(f.name),
      progress: 100,
      status: 'completed',
    }));
    onChange([...files, ...added]);
  };

  const injectSampleEnterpriseFile = () => {
    if (disabled) return;
    const samples: Array<{
      name: string;
      sizeKb: number;
      type: UploadedFileItem['type'];
    }> = [
      {
        name: 'GIB-eFatura-2026-TR904182.xml',
        sizeKb: 148,
        type: 'xml',
      },
      {
        name: 'Kurumsal-Tedarik-Sozlesmesi-Imzali.pdf',
        sizeKb: 1840,
        type: 'pdf',
      },
      {
        name: 'Banka-Swift-Dekont-Q4.pdf',
        sizeKb: 420,
        type: 'pdf',
      },
    ];
    const pick = samples[files.length % samples.length];
    onChange([
      ...files,
      {
        id: `sample-${Date.now()}`,
        name: pick.name,
        sizeKb: pick.sizeKb,
        type: pick.type,
        progress: 100,
        status: 'completed',
      },
    ]);
  };

  const getFileIcon = (type: UploadedFileItem['type']) => {
    switch (type) {
      case 'xml':
        return <FileCode2 size={16} />;
      case 'image':
        return <ImageIcon size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="uxu-field">
      <div className="uxu-field__header">
        {label && <label className="uxu-field__label">{label}</label>}
        <button
          type="button"
          disabled={disabled}
          className="uxu-date-preset-chip"
          onClick={injectSampleEnterpriseFile}
        >
          + Örnek e-Fatura / PDF Ekle
        </button>
      </div>

      <div
        className={`uxu-dropzone ${isDragging ? 'uxu-dropzone--dragging' : ''} ${
          disabled ? 'uxu-dropzone--disabled' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!disabled) fileInputRef.current?.click();
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          disabled={disabled}
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <div className="uxu-dropzone__icon">
          <UploadCloud size={22} />
        </div>
        <div className="uxu-dropzone__texts">
          <span className="uxu-dropzone__title">
            Dosyaları buraya sürükleyin veya{' '}
            <u>bilgisayardan seçmek için tıklayın</u>
          </span>
          <span className="uxu-dropzone__sub">
            {acceptLabel} • Maksimum {maxSizeMb} MB
          </span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="uxu-upload-list">
          {files.map((file) => (
            <div key={file.id} className="uxu-upload-item">
              <div className="uxu-upload-item__icon">
                {getFileIcon(file.type)}
              </div>
              <div className="uxu-upload-item__body">
                <div className="uxu-upload-item__top">
                  <span className="uxu-upload-item__name">{file.name}</span>
                  <span className="uxu-upload-item__meta">
                    {file.sizeKb >= 1024
                      ? `${(file.sizeKb / 1024).toFixed(2)} MB`
                      : `${file.sizeKb} KB`}{' '}
                    •{' '}
                    <span className="uxu-upload-item__ok">
                      <CheckCircle2 size={12} /> Doğrulandı
                    </span>
                  </span>
                </div>
                <div className="uxu-upload-item__bar">
                  <div
                    className="uxu-upload-item__bar-fill"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="uxu-upload-item__remove"
                aria-label={`${file.name} dosyasını kaldır`}
                onClick={() =>
                  onChange(files.filter((item) => item.id !== file.id))
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
