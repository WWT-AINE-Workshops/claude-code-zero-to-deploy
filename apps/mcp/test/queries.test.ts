import { describe, expect, it } from 'vitest';
import { openDb } from '../../api/src/db';
import { seed } from '../../api/src/seed';
import { getUser, listTasks, openTasksByAssignee } from '../src/queries';

const db = () => {
  const d = openDb(':memory:');
  seed(d);
  return d;
};

describe('queries', () => {
  it('lists every task by id, or one status', () => {
    expect(listTasks(db())).toHaveLength(12);
    expect(listTasks(db(), 'doing').map((t) => t.id)).toEqual([4, 5, 6]);
    expect(listTasks(db())[0]).toEqual({
      id: 1,
      title: 'Draft the Q3 roadmap outline',
      status: 'done',
      assigneeId: 1,
    });
  });

  it('counts open tasks per user, most first', () => {
    expect(openTasksByAssignee(db())).toEqual([
      { userId: 2, name: 'Theo Lindqvist', open: 3 },
      { userId: 1, name: 'Mira Castillo', open: 2 },
      { userId: 3, name: 'Noor Haddad', open: 2 },
    ]);
  });

  it('gets one user, or undefined', () => {
    expect(getUser(db(), 3)).toEqual({
      id: 3,
      name: 'Noor Haddad',
      email: 'noor.haddad@tasklane.test',
    });
    expect(getUser(db(), 99)).toBeUndefined();
  });
});
