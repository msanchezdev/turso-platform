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
  message: 'To which group do you want add the location?',
  name: 'group',
  loop: false,
  choices: groups.map((g) => g.name),
});

const selectedGroup = groups.find((g) => g.name === group);
if (!selectedGroup) {
  console.error(`Group ${group} not found`);
  process.exit(1);
}

const availableLocations = await turso.locations
  .list()
  .then(({ locations }) =>
    Object.entries(locations).filter(
      ([code, name]) => !selectedGroup?.locations.includes(code),
    ),
  );

const { destination } = await inquirer.prompt<{ destination: string }>({
  type: 'list',
  message: 'Select a location to add',
  name: 'destination',
  loop: false,
  choices: availableLocations.map(([value, name]) => ({
    name,
    value,
  })),
});

console.log(fmt.muted(`Selected location: ${destination}`));

const { group: transferred } = await turso.groups.addLocation(
  organization,
  group,
  destination,
);
console.log(
  `Location ${fmt.primary(destination)} added to group ${fmt.primary(
    transferred.name,
  )}`,
);
