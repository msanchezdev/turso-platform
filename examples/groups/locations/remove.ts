import { turso, fmt } from '../../utils';
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

const { locations } = await turso.locations.list();
const { location } = await inquirer.prompt<{ location: string }>({
  type: 'list',
  message: 'Select a location to remove',
  name: 'location',
  loop: false,
  choices: selectedGroup.locations.map((value) => ({
    name: locations[value],
    value,
  })),
});

const { group: removed } = await turso.groups.removeLocation(
  organization,
  group,
  location,
);
console.log(
  `Location ${fmt.primary(location)} added to group ${fmt.primary(
    removed.name,
  )}`,
);
