import chalk from 'chalk';
import { TursoPlatformClient } from '../src';

const baseUrl = !!Bun.env.LOCAL
  ? 'http://127.0.0.1:8888'
  : 'https://api.turso.tech';

export const isProd = Bun.env.TURSO_API_BASE_URL === 'https://api.turso.tech';

export const turso = new TursoPlatformClient({
  baseUrl: Bun.env.TURSO_API_BASE_URL || baseUrl,
  token: Bun.env.TURSO_API_TOKEN,
});

export const fmt = {
  string: (s: string) => chalk.blue(s),
  boolean: (b: boolean) => chalk.yellow(b),
  date: (b: Date) => chalk.yellow(b),
  number: (n: number) => chalk.yellow(n),

  primary: (s: string) => chalk.blue(s),
  secondary: (s: string) => chalk.yellow(s),
  muted: (s: string) => chalk.gray(s),

  success: (s: string) => chalk.green(s),
  danger: (s: string) => chalk.redBright(s),
  warning: (s: string) => chalk.yellow(s),
};

export const filters = {
  required: (message?: string) => (input: string) =>
    input ? true : message ?? 'this field is required',
};
