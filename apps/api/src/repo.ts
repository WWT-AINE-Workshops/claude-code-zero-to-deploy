import type { Task, TaskPage, TaskStatus } from '@tasklane/shared';
import type { Db } from './db';

interface TaskRow {
  id: number;
  title: string;
  status: TaskStatus;
  assignee_id: number | null;
  created_at: string;
}

const toTask = (r: TaskRow): Task => ({
  id: r.id,
  title: r.title,
  status: r.status,
  assigneeId: r.assignee_id,
  createdAt: r.created_at,
});

export function listTasks(
  db: Db,
  opts: { status?: TaskStatus; q?: string; assignee?: string; page: number; pageSize: number },
): TaskPage {
  const conds: string[] = [];
  const args: unknown[] = [];
  if (opts.status) {
    conds.push('t.status = ?');
    args.push(opts.status);
  }
  if (opts.assignee) {
    conds.push('u.name LIKE ?');
    args.push(`%${opts.assignee}%`);
  }
  if (opts.q) {
    conds.push('t.title LIKE ?');
    args.push(`%${opts.q}%`);
  }
  const from = 'FROM tasks t LEFT JOIN users u ON u.id = t.assignee_id';
  const where = conds.length ? `WHERE ${conds.join('\n  AND ')}` : '';
  const total = db
    .prepare(`SELECT COUNT(*) ${from}\n${where}`)
    .pluck()
    .get(...args) as number;
  const rows = db
    .prepare(`SELECT t.* ${from}\n${where}\nORDER BY t.id\nLIMIT ?\nOFFSET ?`)
    .all(...args, opts.pageSize, (opts.page - 1) * opts.pageSize) as TaskRow[];
  return { items: rows.map(toTask), total, page: opts.page, pageSize: opts.pageSize };
}

export function getTask(db: Db, id: number): Task | undefined {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow | undefined;
  return row && toTask(row);
}

export function listTasksForUser(db: Db, userId: number): Task[] {
  const rows = db
    .prepare('SELECT * FROM tasks WHERE assignee_id = ? ORDER BY id')
    .all(userId) as TaskRow[];
  return rows.map(toTask);
}

export function userExists(db: Db, id: number): boolean {
  return db.prepare('SELECT 1 FROM users WHERE id = ?').get(id) !== undefined;
}

export function createTask(
  db: Db,
  input: { title: string; assigneeId: number | null },
  now: Date,
): Task {
  const info = db
    .prepare('INSERT INTO tasks (title, status, assignee_id, created_at) VALUES (?, ?, ?, ?)')
    .run(input.title, 'todo', input.assigneeId, now.toISOString());
  return getTask(db, Number(info.lastInsertRowid))!;
}

export function setTaskStatus(db: Db, id: number, status: TaskStatus): Task | undefined {
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
  return getTask(db, id);
}
