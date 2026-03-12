import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { openDb } from '../../api/src/db';
import { seed } from '../../api/src/seed';

const MCP_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TSX_CLI = createRequire(import.meta.url).resolve('tsx/cli');
const APP_ROOT = join(MCP_ROOT, '..', '..');
const ARGS = [TSX_CLI, 'src/index.ts'];

const envWith = (dbFile: string): Record<string, string> => {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) env[key] = value;
  }
  return { ...env, TASKLANE_DB: dbFile };
};

let dir: string;

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'tasklane-mcp-'));
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('stdio server', () => {
  it('answers over stdio from the database file', { timeout: 30_000 }, async () => {
    const file = join(dir, 'tasklane.db');
    const db = openDb(file);
    seed(db);
    db.close();

    const client = new Client({ name: 'test', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ARGS,
      cwd: MCP_ROOT,
      env: envWith(file),
      stderr: 'pipe',
    });
    try {
      await client.connect(transport);
      const result = await client.callTool({ name: 'open_tasks_by_assignee', arguments: {} });
      const rows = JSON.parse((result.content as { text: string }[])[0].text) as {
        name: string;
        open: number;
      }[];
      expect(rows.find((r) => r.name === 'Theo Lindqvist')?.open).toBe(3);
    } finally {
      await client.close();
    }
  });

  it('starts from the app root the way .mcp.json will', { timeout: 30_000 }, async () => {
    const file = join(dir, 'root.db');
    const db = openDb(file);
    seed(db);
    db.close();

    const client = new Client({ name: 'test', version: '1.0.0' });
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [TSX_CLI, 'apps/mcp/src/index.ts'],
      cwd: APP_ROOT,
      env: envWith(file),
      stderr: 'pipe',
    });
    try {
      await client.connect(transport);
      const { tools } = await client.listTools();
      expect(tools.map((t) => t.name).sort()).toEqual([
        'get_user',
        'list_tasks',
        'open_tasks_by_assignee',
      ]);
    } finally {
      await client.close();
    }
  });

  it('exits 1 with a hint on stderr when there is no database', { timeout: 30_000 }, () => {
    const result = spawnSync(process.execPath, ARGS, {
      cwd: MCP_ROOT,
      env: envWith(join(dir, 'missing.db')),
      encoding: 'utf8',
      timeout: 30_000,
    });
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('npm run setup');
  });
});
