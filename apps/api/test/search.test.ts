import { describe, expect, it } from 'vitest';
import { makeTestApp } from './helpers';

const search = (q: string) =>
  makeTestApp().app.inject({ method: 'GET', url: `/api/tasks?q=${encodeURIComponent(q)}` });

describe('GET /api/tasks?q=', () => {
  it('finds a title with an apostrophe', async () => {
    const res = await search("O'Brien");
    expect(res.statusCode).toBe(200);
    expect(res.json().items.map((t: { id: number }) => t.id)).toEqual([9]);
  });

  it('treats an injected condition as text', async () => {
    const res = await search("zzz' OR 1=1 --");
    expect(res.statusCode).toBe(200);
    expect(res.json().total).toBe(0);
  });

  it('still matches an ordinary word', async () => {
    const res = await search('roadmap');
    expect(res.statusCode).toBe(200);
    expect(res.json().items.map((t: { id: number }) => t.id)).toEqual([1]);
  });
});
