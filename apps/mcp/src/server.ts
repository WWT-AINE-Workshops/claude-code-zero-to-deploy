import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TASK_STATUSES } from '@tasklane/shared';
import { z } from 'zod';
import type { Db } from '../../api/src/db';
import { getUser, listTasks, openTasksByAssignee } from './queries';

const json = (result: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
});

export function createServer(db: Db): McpServer {
  const server = new McpServer({ name: 'tasklane', version: '1.0.0' });

  server.registerTool(
    'list_tasks',
    {
      description: 'List Tasklane tasks in id order, optionally only those with one status.',
      inputSchema: { status: z.enum(TASK_STATUSES).optional() },
    },
    ({ status }) => json(listTasks(db, status)),
  );

  server.registerTool(
    'open_tasks_by_assignee',
    {
      description: 'Count open tasks (todo or doing) for every user, most first.',
    },
    () => json(openTasksByAssignee(db)),
  );

  server.registerTool(
    'get_user',
    {
      description: 'Get one Tasklane user by id: name and email.',
      inputSchema: { id: z.number().int().positive() },
    },
    ({ id }) => {
      const user = getUser(db, id);
      if (!user) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `No user with id ${id}` }],
        };
      }
      return json(user);
    },
  );

  return server;
}
