import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { openDb } from '../../api/src/db';
import { seed } from '../../api/src/seed';
import { openReadOnly } from '../src/open';

let dir: string;
let file: string;

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'tasklane-ro-'));
  file = join(dir, 'tasklane.db');
  const db = openDb(file);
  seed(db);
  db.close();
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('read-only connection', () => {
  it('reads rows', () => {
    const db = openReadOnly(file);
    try {
      expect(db.prepare('SELECT COUNT(*) AS n FROM tasks').get()).toEqual({ n: 12 });
    } finally {
      db.close();
    }
  });

  it('refuses writes with SQLITE_READONLY', () => {
    const db = openReadOnly(file);
    try {
      expect(() => db.prepare("UPDATE tasks SET title = 'x' WHERE id = 1").run()).toThrow(
        expect.objectContaining({ code: 'SQLITE_READONLY' }),
      );
      expect(() => db.prepare('DELETE FROM tasks WHERE id = 1').run()).toThrow(
        expect.objectContaining({ code: 'SQLITE_READONLY' }),
      );
    } finally {
      db.close();
    }
  });
});
