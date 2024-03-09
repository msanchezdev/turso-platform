import chalk from 'chalk';
import { TursoPlatformClient } from '../src';
import inquirer from 'inquirer';

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

export function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 bytes';
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function confirmExplicit(
  message: string = 'Are you sure you want to continue?',
  attempts = 5,
) {
  let confirmed = attempts;
  const { confirm } = await inquirer.prompt<{ confirm: string }>({
    type: 'input',
    message: message,
    name: 'confirm',

    validate(input) {
      const value = input.trim().toLowerCase();
      if (!value || !['yes', 'no'].includes(value)) {
        return 'Type "yes" or "no" to confirm';
      }

      if (value === 'no') {
        return true;
      }

      confirmed--;
      return [
        true,
        'This is your last chance, I promise',
        'This is your last chance',
        'Really?',
        'Are you sure?',
        'Please confirm',
      ][confirmed];
    },
  });

  return confirm.toLowerCase() === 'yes';
}
