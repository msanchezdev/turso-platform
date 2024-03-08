import { fmt, turso } from '../../utils';
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

const { members } = await turso.organizations.members.list(organization);

const { username } = await inquirer.prompt<{
  username: string;
}>({
  type: 'list',
  message: 'Select a member to remove',
  name: 'username',
  loop: false,
  choices: members.map((m) => ({
    name: m.email,
    value: m.username,
  })),
});

await turso.organizations.members.remove(organization, username);

console.log(
  `Member ${fmt.primary(username)} removed from ${fmt.primary(organization)}`,
);
