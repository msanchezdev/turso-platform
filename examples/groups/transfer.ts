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

const availableDestinations = organizations.filter(
  (o) => o.slug !== organization,
);

if (availableDestinations.length === 0) {
  console.error(
    `No other organizations available to transfer groups from ${organization}`,
  );
  process.exit(1);
}

const { groups } = await turso.groups.list(organization);
const { group } = await inquirer.prompt<{ group: string }>({
  type: 'list',
  message: 'Select the group you want to transfer',
  name: 'group',
  loop: false,
  choices: groups.map((g) => g.name),
});

const { destination } = await inquirer.prompt<{ destination: string }>({
  type: 'list',
  message: 'Select the destination organization',
  name: 'destination',
  loop: false,
  choices: availableDestinations.map((o) => ({
    name: o.name,
    value: o.slug,
  })),
});

const transferred = await turso.groups.transfer(
  organization,
  group,
  destination,
);
console.log(
  `Group ${fmt.primary(transferred.name)} transferred from ${fmt.primary(
    organization,
  )} to ${fmt.primary(destination)}`,
);
