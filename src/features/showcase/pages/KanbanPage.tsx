import React from 'react';
import { Kanban, type KanbanProps } from '../../../components/composites/Kanban';

export type KanbanPageProps = KanbanProps;

export const KanbanPage: React.FC<KanbanPageProps> = (props) => {
  return (
    <Kanban
      locale="tr"
      storageKey="uxigl.kanban.page.v1"
      {...props}
    />
  );
};
