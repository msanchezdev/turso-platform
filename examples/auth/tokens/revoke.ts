import inquirer from 'inquirer';
import { fmt, turso } from '../../utils';

const { tokens } = await turso.auth.tokens.list();

const name = await inquirer.prompt<{ name: string }>({
  type: 'list',
  message: 'Select a token to revoke',
  name: 'name',
  loop: false,
  choices: tokens.map((t) => ({
    name: t.name,
    value: t.name,
  })),
});

await turso.auth.tokens.revoke(name.name);

console.log(`Token ${fmt.primary(name.name)} revoked`);
