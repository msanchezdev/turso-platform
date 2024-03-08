import { fmt, turso } from '../../utils';
import inquirer from 'inquirer';

const organizations = await turso.organizations.list();

const { organization } = await inquirer.prompt<{
  organization: string;
}>({
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

const newMember = await inquirer.prompt<{
  username: string;
  role: 'member' | 'admin';
}>([
  {
    type: 'input',
    message: 'Enter the email of the new member',
    name: 'username',
  },
  {
    type: 'list',
    message: 'Select the role of the new member',
    name: 'role',
    loop: false,
    choices: [
      {
        name: 'member',
      },
      {
        name: 'admin',
      },
    ],
  },
]);

await turso.organizations.members.add(organization, {
  email: newMember.username,
  role: newMember.role,
});

console.log(
  `Member ${fmt.primary(newMember.username)} added to ${fmt.primary(
    organization,
  )} as ${fmt.primary(newMember.role)}`,
);
