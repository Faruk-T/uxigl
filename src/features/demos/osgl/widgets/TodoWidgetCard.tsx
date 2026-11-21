import React, { useEffect, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import type { WidgetThemeStyle } from './widgetCards';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

const TODOS_STORAGE_KEY = 'uxigl_osgl_widget_todos';

const DEFAULT_TODOS: TodoItem[] = [
  { id: 't1', text: 'Tema renklerini kontrol et', done: true },
  { id: 't2', text: 'FileManGL ikon paketini seç', done: false },
  { id: 't3', text: 'Dokümantasyonu incele', done: false },
];

export function TodoWidgetCard({ theme }: { theme: WidgetThemeStyle }) {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const raw = window.localStorage.getItem(TODOS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_TODOS;
  });
  const [todoDraft, setTodoDraft] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore storage errors
    }
  }, [todos]);

  const addTodo = () => {
    const clean = todoDraft.trim();
    if (!clean) return;
    setTodos((prev) => [...prev, { id: `t-${Date.now()}`, text: clean, done: false }]);
    setTodoDraft('');
  };

  const { isTR, primaryColor, subtleBg, subtleBorder, cardStyle } = theme;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>{isTR ? 'Yapılacaklar' : 'To-Do List'}</span>
        <span style={{ fontSize: 11, opacity: 0.65 }}>
          {todos.filter((t) => t.done).length}/{todos.length}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={todoDraft}
          onChange={(e) => setTodoDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTodo();
          }}
          placeholder={isTR ? 'Yeni görev ekle...' : 'Add a task...'}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '5px 8px',
            borderRadius: 8,
            border: `1px solid ${subtleBorder}`,
            backgroundColor: subtleBg,
            color: 'inherit',
            fontSize: 11.5,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={addTodo}
          aria-label={isTR ? 'Ekle' : 'Add'}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            border: 'none',
            backgroundColor: primaryColor,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 132, overflowY: 'auto' }}>
        {todos.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '4px 6px',
              borderRadius: 8,
              backgroundColor: subtleBg,
              fontSize: 11.5,
            }}
          >
            <button
              type="button"
              onClick={() =>
                setTodos((prev) =>
                  prev.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t))
                )
              }
              style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                border: item.done ? 'none' : `1px solid ${subtleBorder}`,
                backgroundColor: item.done ? primaryColor : 'transparent',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
              }}
            >
              {item.done && <Check size={11} />}
            </button>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textDecoration: item.done ? 'line-through' : 'none',
                opacity: item.done ? 0.55 : 1,
              }}
            >
              {item.text}
            </span>
            <button
              type="button"
              onClick={() => setTodos((prev) => prev.filter((t) => t.id !== item.id))}
              aria-label={isTR ? 'Sil' : 'Delete'}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                opacity: 0.5,
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

