import {
  WIDGET_GRID_STEP,
  WIDGET_MAX_HEIGHT,
  WIDGET_MAX_WIDTH,
  WIDGET_MIN_HEIGHT,
  WIDGET_MIN_WIDTH,
  type WidgetPosition,
  type WidgetSize,
} from '../types';

export interface WidgetLayoutItem {
  id: string;
  pos: WidgetPosition;
  size: WidgetSize;
  /** Actively dragged/resized widget stays anchored while neighbours yield around it. */
  locked?: boolean;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const WIDGET_GAP = 16;
const MIN_X = 12;
const MIN_Y = 12;
const BOTTOM_DOCK_RESERVE = 88;

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
    Math.min(WIDGET_MAX_WIDTH, viewportW - posX - 12)
  );
  const availH = Math.max(
    WIDGET_MIN_HEIGHT,
    Math.min(WIDGET_MAX_HEIGHT, viewportH - posY - 44)
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
  const maxX = Math.max(MIN_X, viewportW - width - 12);
  const maxY = Math.max(MIN_Y, viewportH - 44 - Math.min(height, 140));
  return {
    x: Math.max(MIN_X, Math.min(rawX, maxX)),
    y: Math.max(MIN_Y, Math.min(rawY, maxY)),
  };
}

function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/**
 * Prevents desktop widgets from overlapping each other or overflowing into the Dock.
 * Locked (dragged/resized) widgets settle first; colliding neighbours shift below if
 * vertical room permits, or into the next column to the left without mutating saved coordinates.
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
