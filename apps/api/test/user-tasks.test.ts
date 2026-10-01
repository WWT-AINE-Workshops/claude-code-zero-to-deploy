import { describe, expect, it } from 'vitest';
import { makeTestApp } from './helpers';

const get = (url: string) => makeTestApp().app.inject({ method: 'GET', url });

describe('GET /api/users/:id/tasks', () => {
  it("returns the user's tasks, ordered by id", async () => {
    const res = await get('/api/users/2/tasks');
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.items.map((t: { id: number }) => t.id)).toEqual([2, 4, 7, 11]);
    expect(body.items[1]).toEqual({
      id: 4,
      title: 'Fix the login redirect loop',
      status: 'doing',
      assigneeId: 2,
      createdAt: '2026-09-04T09:00:00.000Z',
    });
  });

  it('returns 400 for an id that is not a positive integer', async () => {
    const res = await get('/api/users/abc/tasks');
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: 'invalid id' });
  });

  it('returns 404 for a user that does not exist', async () => {
    const res = await get('/api/users/99/tasks');
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: 'User 99 not found' });
  });
});
