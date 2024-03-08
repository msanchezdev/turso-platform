import chalk from 'chalk';
import type {
  GroupDatabaseExtension,
  GroupTokenAuthorizationLevel,
} from '../../src/groups';
import { turso, fmt } from '../utils';
import inquirer from 'inquirer';

const organizations = await turso.organizations.list();
const { organization } = await inquirer.prompt<{ organization: string }>({
  type: 'list',
  message: 'Select an organization',
  name: 'organization',
  loop: false,
  choices: organizations.map((o) => ({
    name: o.name,
    value: o.slug,
  })),
});

console.log(fmt.muted(`Selected organization: ${organization}`));

const { groups } = await turso.groups.list(organization);
const { group } = await inquirer.prompt<{ group: string }>({
  type: 'list',
  message: 'Select a group to delete',
  name: 'group',
  loop: false,
  choices: groups.map((g) => g.name),
});
console.log(fmt.muted(`Selected group: ${group}`));

console.log(
  fmt.danger(`
  ${chalk.bold(
    `PROCEED WITH CAUTION:`,
  )} This operation is irreversible. All tokens for the group ${group} in the organization ${organization} will be invalidated.
`),
);

const confirm = await inquirer.prompt<{ confirm: boolean }>({
  type: 'confirm',
  message: 'Are you sure you want to continue?',
  name: 'confirm',
});

if (!confirm.confirm) {
  process.exit(0);
}

await turso.groups.invalidateTokens(organization, group);
console.log(fmt.success('Tokens invalidated'));
