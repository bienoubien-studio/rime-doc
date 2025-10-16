
import { defineConfig, type Config } from 'drizzle-kit';

export const config: Config = {
  schema: './src/lib/+rime.generated/schema.server.ts',
  out: './db',
  strict: false,
  dialect: 'sqlite',
  dbCredentials: {
    url: './db/doc.sqlite'
  }
};

export default defineConfig(config);
