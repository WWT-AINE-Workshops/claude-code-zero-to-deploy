import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { notFound, toId } from '../errors';
import { listTasksForUser, userExists } from '../repo';

export function userRoutes(app: FastifyInstance, deps: AppDeps): void {
  const { db } = deps;

  app.get<{ Params: { id: string } }>('/api/users/:id/tasks', async (request) => {
    const id = toId(request.params.id);
    if (!userExists(db, id)) throw notFound(`User ${id}`);
    return { items: listTasksForUser(db, id) };
  });
}
