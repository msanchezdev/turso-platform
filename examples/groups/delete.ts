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

const { group: deleted } = await turso.groups.delete(organization, group);
console.log(
  `Group ${fmt.primary(deleted.name)} deleted from ${fmt.primary(
    organization,
  )}`,
);
