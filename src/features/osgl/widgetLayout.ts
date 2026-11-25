import {
  WIDGET_GRID_STEP,
  WIDGET_MAX_HEIGHT,
  WIDGET_MAX_WIDTH,
  WIDGET_MIN_HEIGHT,
  WIDGET_MIN_WIDTH,
  type WidgetPosition,
  type WidgetSize,
} from './types';

export interface WidgetLayoutItem {
  id: string;
  pos: WidgetPosition;
  size: WidgetSize;
  /** Kullanıcının o an sürüklediği/boyutlandırdığı widget yerinde kalır, diğerleri ondan kaçar. */
  locked?: boolean;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const WIDGET_GAP = 16;
const MIN_X = 16;
const MIN_Y = 14;
const BOTTOM_DOCK_RESERVE = 84;

export function snapWidgetToGrid(val: number): number {
  return Math.round(val / WIDGET_GRID_STEP) * WIDGET_GRID_STEP;
}

export function clampWidgetSize(
  rawW: number,
  rawH: number,
  posX: number,
  posY: number,
  viewportW: number,
  viewportH: number
): WidgetSize {
  const availW = Math.max(
    WIDGET_MIN_WIDTH,
    Math.min(WIDGET_MAX_WIDTH, viewportW - posX - 20)
  );
  const availH = Math.max(
    WIDGET_MIN_HEIGHT,
    Math.min(WIDGET_MAX_HEIGHT, viewportH - posY - BOTTOM_DOCK_RESERVE)
  );
  return {
    width: Math.max(WIDGET_MIN_WIDTH, Math.min(rawW, availW)),
    height: Math.max(WIDGET_MIN_HEIGHT, Math.min(rawH, availH)),
  };
}

export function clampWidgetPosition(
  rawX: number,
  rawY: number,
  width: number,
  height: number,
  viewportW: number,
  viewportH: number
): WidgetPosition {
  const maxX = Math.max(MIN_X, viewportW - width - 20);
  const maxY = Math.max(MIN_Y, viewportH - BOTTOM_DOCK_RESERVE - height);
  return {
    x: Math.max(MIN_X, Math.min(rawX, maxX)),
    y: Math.max(MIN_Y, Math.min(rawY, maxY)),
  };
}

function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/**
 * Masaüstü widget'larının üst üste binmesini ve alt Dock / ekran taşmasını engeller.
 * Kilitli widget önce yerleşir; diğerleri çakıştığında önce dikeyde tam boy sığıyorsa
 * alta, sığmıyorsa bir sol sütuna kaydırılır. Kayıtlı konumlar değiştirilmez.
 */
export function resolveWidgetOverlaps(
  items: WidgetLayoutItem[],
  viewportHeight: number
): Record<string, WidgetPosition> {
  const placed: Rect[] = [];
  const result: Record<string, WidgetPosition> = {};
  const ordered = [...items.filter((i) => i.locked), ...items.filter((i) => !i.locked)];
  const maxBottomY = Math.max(240, viewportHeight - BOTTOM_DOCK_RESERVE);

  for (const item of ordered) {
    const rect: Rect = {
      x: item.pos.x,
      y: Math.min(item.pos.y, Math.max(MIN_Y, maxBottomY - item.size.height)),
      w: item.size.width,
      h: item.size.height,
    };

    if (!item.locked) {
      for (let guard = 0; guard < items.length * 6; guard += 1) {
        const conflict = placed.find((p) => intersects(rect, p));
        if (!conflict) break;
        const belowY = conflict.y + conflict.h + WIDGET_GAP;
        const fitsCompletelyBelow = belowY + rect.h <= maxBottomY;
        const leftX = conflict.x - rect.w - WIDGET_GAP;
        if (fitsCompletelyBelow) {
          rect.y = belowY;
        } else if (leftX >= MIN_X) {
          rect.x = leftX;
          rect.y = MIN_Y;
        } else {
          rect.y = belowY;
        }
      }
    }

    placed.push(rect);
    result[item.id] = { x: rect.x, y: rect.y };
  }

  return result;
}
