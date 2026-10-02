import { describe, expect, it } from 'vitest';
import { makeTestApp } from './helpers';

describe('GET /api/users', () => {
  it('lists every user with id, name and email', async () => {
    const { app } = makeTestApp();
    const res = await app.inject({ method: 'GET', url: '/api/users' });
    expect(res.statusCode).toBe(200);
    const { items } = res.json();
    expect(items).toHaveLength(3);
    expect(Object.keys(items[0])).toEqual(['id', 'name', 'email']);
  });
});
