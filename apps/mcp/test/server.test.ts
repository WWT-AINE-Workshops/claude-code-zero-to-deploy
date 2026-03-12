import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openDb, type Db } from '../../api/src/db';
import { seed } from '../../api/src/seed';
import { openTasksByAssignee } from '../src/queries';
import { createServer } from '../src/server';

let db: Db;
let client: Client;

const text = (result: Awaited<ReturnType<Client['callTool']>>) =>
  (result.content as { type: string; text: string }[])[0].text;

beforeEach(async () => {
  db = openDb(':memory:');
  seed(db);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await createServer(db).connect(serverTransport);
  client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(clientTransport);
});

afterEach(async () => {
  await client.close();
  db.close();
});

describe('MCP server', () => {
  it('lists the three read-only tools', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      'get_user',
      'list_tasks',
      'open_tasks_by_assignee',
    ]);
  });

  it('counts open tasks by assignee', async () => {
    const result = await client.callTool({ name: 'open_tasks_by_assignee', arguments: {} });
    expect(JSON.parse(text(result))).toEqual(openTasksByAssignee(db));
  });

  it('lists tasks with one status', async () => {
    const result = await client.callTool({ name: 'list_tasks', arguments: { status: 'todo' } });
    expect(JSON.parse(text(result))).toHaveLength(6);
  });

  it('returns an error result for an unknown user', async () => {
    const result = await client.callTool({ name: 'get_user', arguments: { id: 99 } });
    expect(result.isError).toBe(true);
  });

  it('rejects an unknown status', async () => {
    expect.assertions(1);
    const call = client.callTool({ name: 'list_tasks', arguments: { status: 'blocked' } });
    await call.then(
      (result) => expect(result.isError).toBe(true),
      (error: unknown) => expect(error).toBeInstanceOf(Error),
    );
  });
});
