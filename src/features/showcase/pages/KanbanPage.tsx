import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, Input, Badge, Avatar, Progress } from '../../../components/primitives';
import { Card } from '../../../components/composites';
import { useToast } from '../../../providers/ToastProvider';

interface KanbanTask {
  id: string;
  title: string;
  tag: string;
  tagTone: 'primary' | 'info' | 'warning' | 'success' | 'danger';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  progress: number;
  column: 'backlog' | 'progress' | 'review' | 'done';
  dueDate: string;
}

const INITIAL_KANBAN_TASKS: KanbanTask[] = [
  {
    id: 'UXI-101',
    title: '8pt Uzamsal Grid & Liquid Glass Sidebar Standardizasyonu',
    tag: 'Design System',
    tagTone: 'primary',
    priority: 'High',
    assignee: 'Ümit Uz',
    progress: 100,
    column: 'done',
    dueDate: 'Bugün',
  },
  {
    id: 'UXI-104',
    title: 'Passkey (WebAuthn) ve Biyometrik Giriş Akışı Entegrasyonu',
    tag: 'Security',
    tagTone: 'danger',
    priority: 'High',
    assignee: 'Selin Kaya',
    progress: 75,
    column: 'review',
    dueDate: 'Yarın',
  },
  {
    id: 'UXI-108',
    title: 'SheetGL 1M Satır Sanallaştırma & Zebra Satır Performans Testi',
    tag: 'WebGL Engine',
    tagTone: 'info',
    priority: 'High',
    assignee: 'Mert Demir',
    progress: 60,
    column: 'progress',
    dueDate: '12 Kas',
  },
  {
    id: 'UXI-112',
    title: 'Kurumsal e-Fatura PDF Şablonu ve QR Doğrulama Modülü',
    tag: 'Billing',
    tagTone: 'success',
    priority: 'Medium',
    assignee: 'Zeynep Ak',
    progress: 40,
    column: 'progress',
    dueDate: '15 Kas',
  },
  {
    id: 'UXI-115',
    title: 'Çoklu Dil (i18n) Otomatik Sözlük Senkronizasyonu',
    tag: 'Core',
    tagTone: 'warning',
    priority: 'Medium',
    assignee: 'Caner Yılmaz',
    progress: 10,
    column: 'backlog',
    dueDate: '19 Kas',
  },
  {
    id: 'UXI-119',
    title: '3B Uzamsal Paneller için Optik Derinlik Gölgeleri',
    tag: 'Design System',
    tagTone: 'primary',
    priority: 'Low',
    assignee: 'Ümit Uz',
    progress: 0,
    column: 'backlog',
    dueDate: '24 Kas',
  },
];

export const KanbanPage: React.FC = () => {
  const { notify } = useToast();
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(INITIAL_KANBAN_TASKS);
  const [kanbanFilter, setKanbanFilter] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const moveKanbanTask = (taskId: string, direction: 'prev' | 'next') => {
    const order: KanbanTask['column'][] = ['backlog', 'progress', 'review', 'done'];
    setKanbanTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const idx = order.indexOf(t.column);
        const nextIdx = direction === 'next' ? Math.min(3, idx + 1) : Math.max(0, idx - 1);
        const nextCol = order[nextIdx];
        return {
          ...t,
          column: nextCol,
          progress: nextCol === 'done' ? 100 : nextCol === 'review' ? 80 : nextCol === 'progress' ? 50 : 10,
        };
      })
    );
  };

  const handleAddKanbanTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: KanbanTask = {
      id: `UXI-${Math.floor(120 + Math.random() * 80)}`,
      title: newTaskTitle.trim(),
      tag: 'Feature',
      tagTone: 'primary',
      priority: 'Medium',
      assignee: 'Ümit Uz',
      progress: 0,
      column: 'backlog',
      dueDate: '28 Kas',
    };
    setKanbanTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    notify({
      title: 'Yeni Görev Eklendi',
      description: `${newTask.id}: ${newTask.title}`,
      tone: 'primary',
    });
  };

  return (
    <div className="uxu-stack-md">
      {/* Kanban Toolbar */}
      <Card variant="glass" padding="md">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
            <Input
              placeholder="Görev veya kod ara (örn: UXI-108)..."
              value={kanbanFilter}
              onChange={setKanbanFilter}
              leadingIcon={<Search size={15} />}
            />
          </div>

          <form
            onSubmit={handleAddKanbanTask}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
          >
            <Input
              placeholder="Yeni görev başlığı..."
              value={newTaskTitle}
              onChange={setNewTaskTitle}
            />
            <Button type="submit" variant="filled" size="sm" leadingIcon={<Plus size={15} />}>
              Görev Ekle
            </Button>
          </form>
        </div>
      </Card>

      {/* 4 Kanban Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {(
          [
            { id: 'backlog', title: 'Backlog', tone: 'neutral' as const },
            { id: 'progress', title: 'In Progress', tone: 'primary' as const },
            { id: 'review', title: 'Code Review', tone: 'warning' as const },
            { id: 'done', title: 'Completed', tone: 'success' as const },
          ] as const
        ).map((col) => {
          const colTasks = kanbanTasks.filter(
            (t) =>
              t.column === col.id &&
              (t.title.toLowerCase().includes(kanbanFilter.toLowerCase()) ||
                t.id.toLowerCase().includes(kanbanFilter.toLowerCase()))
          );

          return (
            <Card key={col.id} variant="glass" padding="md">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px solid var(--uxu-border-subtle)',
                }}
              >
                <strong style={{ fontSize: '0.86rem' }}>{col.title}</strong>
                <Badge tone={col.tone} size="xs">
                  {colTasks.length}
                </Badge>
              </div>

              <div className="uxu-stack-sm">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--uxu-radius-md)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--uxu-font-mono)',
                          color: 'var(--uxu-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        {task.id}
                      </span>
                      <Badge tone={task.tagTone} size="xs">
                        {task.tag}
                      </Badge>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.35 }}>
                      {task.title}
                    </div>

                    <Progress
                      value={task.progress}
                      tone={task.progress === 100 ? 'success' : 'primary'}
                    />

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 4,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={task.assignee} size="sm" />
                        <span style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                          {task.dueDate}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 4 }}>
                        {col.id !== 'backlog' && (
                          <button
                            type="button"
                            onClick={() => moveKanbanTask(task.id, 'prev')}
                            title="Önceki Sütuna Taşı"
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              border: '1px solid var(--uxu-border-subtle)',
                              background: 'var(--uxu-bg-elevated)',
                              color: 'var(--uxu-text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            ←
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            type="button"
                            onClick={() => moveKanbanTask(task.id, 'next')}
                            title="Sonraki Sütuna Taşı"
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              border: '1px solid var(--uxu-border-subtle)',
                              background: 'var(--uxu-bg-elevated)',
                              color: 'var(--uxu-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
