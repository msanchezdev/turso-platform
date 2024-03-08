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

console.log(
  `We will create a token for the group ${fmt.primary(
    group,
  )} in the organization ${fmt.primary(organization)}`,
);
const { expiration } = await inquirer.prompt<{ expiration: string }>({
  type: 'input',
  message:
    'Token expiration (e.g. 1h, 1d, 1w, 1m, 1y, 1h30m, 1d12h, 1w3d, 1m2w, 1y6m3w2d12h30m)',
  default: '5m',
  name: 'expiration',
});

const { authorization } = await inquirer.prompt<{
  authorization: GroupTokenAuthorizationLevel;
}>({
  type: 'list',
  message: 'Authorization level (e.g. full-access, read-only)',
  name: 'authorization',
  loop: false,
  choices: ['full-access', 'read-only'],
});

const { jwt } = await turso.groups.createToken(organization, group, {
  expiration,
  authorization,
});

console.log(
  `Token created for group ${fmt.primary(group)} in organization ${fmt.primary(
    organization,
  )}`,
);
console.log(fmt.string(`  ${jwt}`));
