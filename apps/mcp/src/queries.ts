import type { TaskStatus, User } from '@tasklane/shared';
import type { Db } from '../../api/src/db';

export interface TaskSummary {
  id: number;
  title: string;
  status: TaskStatus;
  assigneeId: number | null;
}

export function listTasks(db: Db, status?: TaskStatus): TaskSummary[] {
  const where = status ? 'WHERE status = ?' : '';
  return db
    .prepare(`SELECT id, title, status, assignee_id AS assigneeId FROM tasks ${where} ORDER BY id`)
    .all(...(status ? [status] : [])) as TaskSummary[];
}

export function openTasksByAssignee(db: Db): { userId: number; name: string; open: number }[] {
  return db
    .prepare(
      `SELECT u.id AS userId, u.name AS name,
              COUNT(t.id) AS open
         FROM users u
         LEFT JOIN tasks t ON t.assignee_id = u.id AND t.status IN ('todo', 'doing')
        GROUP BY u.id
        ORDER BY open DESC, u.id`,
    )
    .all() as { userId: number; name: string; open: number }[];
}

export function getUser(db: Db, id: number): User | undefined {
  return db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id) as User | undefined;
}
