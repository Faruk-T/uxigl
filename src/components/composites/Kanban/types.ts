import type React from 'react';

export type KanbanColumnId = 'backlog' | 'progress' | 'review' | 'done';

export type KanbanPriority = 'high' | 'medium' | 'low';

export type KanbanTagTone = 'primary' | 'info' | 'warning' | 'success' | 'danger' | 'neutral';

export type KanbanViewMode = 'board' | 'list';

export interface KanbanColumn {
  id: KanbanColumnId | string;
  title: string;
  titleTr?: string;
  tone: KanbanTagTone;
  wipLimit?: number;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  tag: string;
  tagTone: KanbanTagTone;
  priority: KanbanPriority;
  assignee: string;
  progress: number;
  column: KanbanColumnId | string;
  dueDate: string;
  subtasksDone?: number;
  subtasksTotal?: number;
}

export interface KanbanProps {
  /** Controlled tasks list. */
  tasks?: KanbanTask[];
  /** Controlled tasks updater. */
  onTasksChange?: (nextTasks: KanbanTask[]) => void;
  /** Initial tasks when uncontrolled. */
  initialTasks?: KanbanTask[];
  /** Custom columns configuration (defaults to 4 standard sprint columns). */
  columns?: KanbanColumn[];
  /** Display locale (`'tr' | 'en'`, default `'tr'`). */
  locale?: 'tr' | 'en';
  /** Initial view mode (`'board' | 'list'`, default `'board'`). */
  defaultView?: KanbanViewMode;
  /** Show top sprint KPI summary bar (default `true`). */
  showStats?: boolean;
  /** Enable HTML5 drag-and-drop between columns (default `true`). */
  enableDragDrop?: boolean;
  /** Optional localStorage key for uncontrolled persistence. */
  storageKey?: string;
  /** Callback when a task card is clicked. */
  onTaskClick?: (task: KanbanTask) => void;
  className?: string;
  style?: React.CSSProperties;
}
