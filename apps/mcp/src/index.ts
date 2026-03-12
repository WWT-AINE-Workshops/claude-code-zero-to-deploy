import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { existsSync } from 'node:fs';
import { DB_FILE } from '../../api/src/paths';
import { openReadOnly } from './open';
import { createServer } from './server';

if (!existsSync(DB_FILE)) {
  console.error(`No database at ${DB_FILE}. Run "npm run setup" first.`);
  process.exit(1);
}

const db = openReadOnly(DB_FILE);
await createServer(db).connect(new StdioServerTransport());
