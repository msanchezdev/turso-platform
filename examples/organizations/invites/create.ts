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
    message: 'Enter the email of the user you want to invite',
    name: 'username',
  },
  {
    type: 'list',
    message: 'Select the role you want to assign to the new member',
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

await turso.organizations.invites.create(organization, {
  email: newMember.username,
  role: newMember.role,
});

console.log(
  `Invitation sent ${fmt.primary(newMember.username)} invited to ${fmt.primary(
    organization,
  )} as ${fmt.primary(newMember.role)}`,
);
