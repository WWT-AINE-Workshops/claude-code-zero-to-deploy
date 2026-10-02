import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';

const USER_COLUMNS = 'id, name, email';

export function usersRoutes(app: FastifyInstance, deps: AppDeps): void {
  const { db } = deps;

  app.get('/api/users', async () => {
    const items = db.prepare(`SELECT ${USER_COLUMNS} FROM users ORDER BY id`).all();
    return { items };
  });
}
