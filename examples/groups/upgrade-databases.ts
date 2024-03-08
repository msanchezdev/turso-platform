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
  message: 'Select a group',
  name: 'group',
  loop: false,
  choices: groups.map((g) => g.name),
});

const selectedGroup = groups.find((g) => g.name === group);
if (!selectedGroup) {
  console.error(`Group ${group} not found`);
  process.exit(1);
}

console.log(fmt.muted(`Selected group: ${group}`));

console.log('Upgrading databases...');

console.log(
  fmt.warning(`
  WARNING: This operation causes some amount of downtime to occur during the update process. The version of libSQL server is taken from the latest built docker image.
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

await turso.groups.upgradeDatabases(organization, selectedGroup.name);
