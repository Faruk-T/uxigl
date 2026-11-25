import type React from 'react';
import { osWasmEngine } from './osglEngine';
import type { FloatingWindowState, WindowBounds } from './types';

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
export type SnapZone =
  | 'maximize'
  | 'left-half'
  | 'right-half'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | null;

export const DESKTOP_TOP_BAR_H = 44;
export const DESKTOP_DOCK_RESERVE = 88;
export const WINDOW_MIN_WIDTH = 380;
export const WINDOW_MIN_HEIGHT = 220;

export interface ResizeHandleSpec {
  dir: ResizeDirection;
  cursor: React.CSSProperties['cursor'];
  label: string;
  style: React.CSSProperties;
}

export const RESIZE_HANDLE_SPECS: ReadonlyArray<ResizeHandleSpec> = [
  {
    dir: 'n',
    cursor: 'ns-resize',
    label: 'Üst kenardan boyutlandır',
    style: { position: 'absolute', top: -3, left: 12, right: 12, height: 7, zIndex: 6 },
  },
  {
    dir: 's',
    cursor: 'ns-resize',
    label: 'Alt kenardan boyutlandır',
    style: { position: 'absolute', bottom: -3, left: 12, right: 12, height: 7, zIndex: 6 },
  },
  {
    dir: 'w',
    cursor: 'ew-resize',
    label: 'Sol kenardan boyutlandır',
    style: { position: 'absolute', left: -3, top: 12, bottom: 12, width: 7, zIndex: 6 },
  },
  {
    dir: 'e',
    cursor: 'ew-resize',
    label: 'Sağ kenardan boyutlandır',
    style: { position: 'absolute', right: -3, top: 12, bottom: 12, width: 7, zIndex: 6 },
  },
  {
    dir: 'nw',
    cursor: 'nwse-resize',
    label: 'Sol üst köşeden boyutlandır',
    style: { position: 'absolute', top: -4, left: -4, width: 14, height: 14, zIndex: 7 },
  },
  {
    dir: 'ne',
    cursor: 'nesw-resize',
    label: 'Sağ üst köşeden boyutlandır',
    style: { position: 'absolute', top: -4, right: -4, width: 14, height: 14, zIndex: 7 },
  },
  {
    dir: 'sw',
    cursor: 'nesw-resize',
    label: 'Sol alt köşeden boyutlandır',
    style: { position: 'absolute', bottom: -4, left: -4, width: 14, height: 14, zIndex: 7 },
  },
  {
    dir: 'se',
    cursor: 'nwse-resize',
    label: 'Sağ alt köşeden boyutlandır',
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 18,
      height: 18,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      padding: 4,
      zIndex: 8,
    },
  },
];

export function getWorkspaceMetrics(vw: number, vh: number) {
  const safeVw = Number.isFinite(vw) && vw > 0 ? vw : 1366;
  const safeVh = Number.isFinite(vh) && vh > 0 ? vh : 860;
  return {
    workspaceW: Math.max(320, Math.round(safeVw)),
    workspaceH: Math.max(240, Math.round(safeVh - DESKTOP_TOP_BAR_H)),
    topBarH: DESKTOP_TOP_BAR_H,
  };
}

export function clampWindowToViewport(
  win: FloatingWindowState,
  vw: number,
  vh: number
): FloatingWindowState {
  if (win.maximized || win.fullscreen) return win;
  const { workspaceW, workspaceH } = getWorkspaceMetrics(vw, vh);
  const minW = Math.min(WINDOW_MIN_WIDTH, workspaceW);
  const minH = Math.min(WINDOW_MIN_HEIGHT, workspaceH);

  const width = osWasmEngine.clamp(win.width, minW, workspaceW);
  const height = osWasmEngine.clamp(win.height, minH, workspaceH);
  const maxX = Math.max(0, workspaceW - width);
  const maxY = Math.max(0, workspaceH - height);
  const x = osWasmEngine.clamp(win.x, 0, maxX);
  const y = osWasmEngine.clamp(win.y, 0, maxY);

  if (x === win.x && y === win.y && width === win.width && height === win.height) {
    return win;
  }
  return { ...win, x, y, width, height };
}

export function clampWindowDragPosition(
  rawX: number,
  rawY: number,
  winW: number,
  vw: number,
  vh: number
): { x: number; y: number } {
  const { workspaceW, workspaceH } = getWorkspaceMetrics(vw, vh);
  const minVisibleTitleW = Math.min(140, Math.max(64, winW));
  const minX = Math.min(0, minVisibleTitleW - winW);
  const maxX = Math.max(0, workspaceW - minVisibleTitleW);
  const maxY = Math.max(0, workspaceH - 38);

  return {
    x: osWasmEngine.clamp(rawX, minX, maxX),
    y: osWasmEngine.clamp(rawY, 0, maxY),
  };
}

export function computeResizedWindowBounds(
  orig: WindowBounds,
  dir: ResizeDirection,
  dx: number,
  dy: number,
  vw: number,
  vh: number,
  minW = WINDOW_MIN_WIDTH,
  minH = WINDOW_MIN_HEIGHT
): WindowBounds {
  const { workspaceW, workspaceH } = getWorkspaceMetrics(vw, vh);
  const effMinW = Math.min(minW, workspaceW);
  const effMinH = Math.min(minH, workspaceH);

  let x = orig.x;
  let y = orig.y;
  let width = orig.width;
  let height = orig.height;

  if (dir.includes('e')) {
    const maxW = Math.max(effMinW, workspaceW - orig.x);
    width = osWasmEngine.clamp(orig.width + dx, effMinW, maxW);
  } else if (dir.includes('w')) {
    const rightEdge = orig.x + orig.width;
    const maxW = Math.max(effMinW, rightEdge);
    width = osWasmEngine.clamp(orig.width - dx, effMinW, maxW);
    x = rightEdge - width;
  }

  if (dir.includes('s')) {
    const maxH = Math.max(effMinH, workspaceH - orig.y);
    height = osWasmEngine.clamp(orig.height + dy, effMinH, maxH);
  } else if (dir.includes('n')) {
    const bottomEdge = orig.y + orig.height;
    const maxH = Math.max(effMinH, bottomEdge);
    height = osWasmEngine.clamp(orig.height - dy, effMinH, maxH);
    y = bottomEdge - height;
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  };
}

export function detectEdgeSnapZone(
  clientX: number,
  clientY: number,
  vw: number,
  vh: number
): SnapZone {
  const safeVw = Number.isFinite(vw) && vw > 0 ? vw : 1366;
  const safeVh = Number.isFinite(vh) && vh > 0 ? vh : 860;
  const cornerSpan = 92;
  const nearLeft = clientX <= 18;
  const nearRight = clientX >= safeVw - 18;
  const nearTop = clientY <= DESKTOP_TOP_BAR_H + 12;
  const nearBottom = clientY >= safeVh - 22;

  if ((nearLeft && clientY <= DESKTOP_TOP_BAR_H + cornerSpan) || (nearTop && clientX <= cornerSpan)) {
    return 'top-left';
  }
  if ((nearRight && clientY <= DESKTOP_TOP_BAR_H + cornerSpan) || (nearTop && clientX >= safeVw - cornerSpan)) {
    return 'top-right';
  }
  if ((nearLeft && clientY >= safeVh - cornerSpan) || (nearBottom && clientX <= cornerSpan)) {
    return 'bottom-left';
  }
  if ((nearRight && clientY >= safeVh - cornerSpan) || (nearBottom && clientX >= safeVw - cornerSpan)) {
    return 'bottom-right';
  }
  if (clientY <= DESKTOP_TOP_BAR_H + 8) return 'maximize';
  if (clientX <= 14) return 'left-half';
  if (clientX >= safeVw - 14) return 'right-half';
  return null;
}

export function computeSnapBounds(
  zone: Exclude<SnapZone, null>,
  vw: number,
  vh: number,
  dockVisible = false
): WindowBounds {
  const { workspaceW, workspaceH } = getWorkspaceMetrics(vw, vh);
  if (zone === 'maximize') {
    return { x: 0, y: 0, width: workspaceW, height: workspaceH };
  }
  if (!dockVisible) {
    const halfW = Math.floor(workspaceW / 2);
    const halfH = Math.floor(workspaceH / 2);
    if (zone === 'left-half') return { x: 0, y: 0, width: halfW, height: workspaceH };
    if (zone === 'right-half') return { x: halfW, y: 0, width: workspaceW - halfW, height: workspaceH };
    if (zone === 'top-left') return { x: 0, y: 0, width: halfW, height: halfH };
    if (zone === 'top-right') return { x: halfW, y: 0, width: workspaceW - halfW, height: halfH };
    if (zone === 'bottom-left') return { x: 0, y: halfH, width: halfW, height: workspaceH - halfH };
    return { x: halfW, y: halfH, width: workspaceW - halfW, height: workspaceH - halfH };
  }

  const availW = Math.max(400, workspaceW - 16);
  const availH = Math.max(320, workspaceH - DESKTOP_DOCK_RESERVE - 12);
  const colW = Math.floor((availW - 8) / 2);
  const rightW = availW - colW - 8;
  const rightX = 16 + colW;
  const rowH = Math.floor((availH - 8) / 2);
  const botH = availH - rowH - 8;
  const botY = 6 + rowH + 8;

  if (zone === 'left-half') return { x: 8, y: 6, width: colW, height: availH };
  if (zone === 'right-half') return { x: rightX, y: 6, width: rightW, height: availH };
  if (zone === 'top-left') return { x: 8, y: 6, width: colW, height: rowH };
  if (zone === 'top-right') return { x: rightX, y: 6, width: rightW, height: rowH };
  if (zone === 'bottom-left') return { x: 8, y: botY, width: colW, height: botH };
  return { x: rightX, y: botY, width: rightW, height: botH };
}

export function computeUnmaximizeDragOrigin(
  pointerClientX: number,
  pointerClientY: number,
  restored: WindowBounds,
  vw: number,
  vh: number
): { x: number; y: number } {
  const { workspaceW } = getWorkspaceMetrics(vw, vh);
  const ratioX = Math.max(0.1, Math.min(0.9, pointerClientX / Math.max(1, workspaceW)));
  const rawX = Math.round(pointerClientX - restored.width * ratioX);
  const rawY = Math.max(4, Math.round(pointerClientY - DESKTOP_TOP_BAR_H - 18));
  return clampWindowDragPosition(rawX, rawY, restored.width, vw, vh);
}
