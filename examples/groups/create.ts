import type { GroupDatabaseExtension } from '../../src/groups';
import { turso, fmt, filters } from '../utils';
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
const { name } = await inquirer.prompt<{ name: string }>({
  type: 'input',
  message: 'What is the name of the group you want to create?',
  name: 'name',
  validate: filters.required(),
});

const { locations } = await turso.locations.list();
const { location } = await inquirer.prompt<{ location: string }>({
  type: 'list',
  message: 'Where do you want to create the group?',
  name: 'location',
  loop: false,
  choices: Object.entries(locations).map(([value, name]) => ({
    name,
    value,
  })),
});
console.log(fmt.muted(`Selected location: ${location}`));

const { extensions } = await inquirer.prompt<{
  extensions: GroupDatabaseExtension[];
}>({
  type: 'checkbox',
  message: 'Select the extensions for the group',
  name: 'extensions',
  loop: false,
  choices: turso.groups.availableExtensions,
});

const { group } = await turso.groups.create(organization, {
  name,
  location,
  extensions,
});
console.log(
  `Group ${fmt.primary(group.name)} created in ${fmt.primary(organization)}`,
);
console.log(`  - UUID: ${fmt.secondary(group.uuid)}`);
console.log(`  - Locations: ${fmt.string(group.locations.join(', '))}`);
console.log(`  - Primary Location: ${fmt.string(group.primary)}`);
console.log(`  - Archived: ${fmt.boolean(group.archived)}`);
console.log(`  - Extensions:`);
for (const extension of extensions) {
  console.log(`    - ${fmt.primary(extension)}`);
}
