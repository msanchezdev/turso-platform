import inquirer from 'inquirer';
import { fmt, turso } from '../../utils';

const { name } = await inquirer.prompt<{ name: string }>({
  type: 'input',
  message: 'Enter the name of the new token',
  name: 'name',
});

const token = await turso.auth.tokens.create(name);

console.log(`Token created: ${fmt.primary(token.name)}`);
console.log(`  ${fmt.string(token.token)}`);
