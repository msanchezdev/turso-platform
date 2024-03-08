import { turso, fmt, filters } from '../utils';
import inquirer from 'inquirer';

const organizations = await turso.organizations.list();
const { organization } = await inquirer.prompt<{ organization: string }>({
  type: 'list',
  message: 'Select an organization',
  name: 'organization',
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
  choices: groups.map((g) => g.name),
});

const selectedGroup = groups.find((g) => g.name === group);
if (!selectedGroup) {
  console.error(`Group ${group} not found`);
  process.exit(1);
}

const { name } = await inquirer.prompt<{ name: string }>({
  type: 'input',
  message: 'Enter the name of the new database',
  name: 'name',
  validate: filters.required(),
});

const { size } = await inquirer.prompt<{ size: string }>({
  type: 'input',
  message:
    'Enter the size limit of the new database in bytes (units can be used, e.g. 1mb, 256mb, 1gb, etc.) (leave empty to omit)',
  name: 'size',
});

const { useSeed } = await inquirer.prompt<{
  useSeed: false | 'dump' | 'database';
}>({
  type: 'list',
  message: 'Do you want to use seed the database?',
  name: 'useSeed',
  choices: [
    {
      name: 'No',
      value: false,
    },
    {
      name: 'From another database',
      value: 'database',
    },
    {
      name: 'From a dump (please upload it first)',
      value: 'dump',
    },
  ],
});

if (!useSeed) {
  const { database } = await turso.databases.create(organization, {
    name,
    group: selectedGroup.name,
    size_limit: size,
  });

  console.log(
    `Database created: ${fmt.primary(database.Name)} (${fmt.secondary(
      database.DbId,
    )})`,
  );
  process.exit(0);
} else if (useSeed === 'database') {
  const { databases } = await turso.databases.list(organization);
  const { seedDatabase } = await inquirer.prompt<{ seedDatabase: string }>({
    type: 'list',
    message: 'Select a database to use as seed',
    name: 'seedDatabase',
    choices: databases.map((d) => ({
      name: d.Name,
      value: d.Name,
    })),
  });

  const { timestamp } = await inquirer.prompt<{ timestamp: string }>({
    type: 'input',
    message:
      'Enter the timestamp to use for the seed (leave empty to omit, use ISO format)',
    name: 'timestamp',
    validate: (input) =>
      // full date
      !input ||
      `valid format: ${new Date()
        .toISOString()
        .split('.')[0]
        .replace('T', ' ')}`,
  });

  const parsedTimestamp = timestamp ? new Date(timestamp) : undefined;
  console.log(
    fmt.muted(
      `selected timestamp: ${parsedTimestamp?.toISOString() ?? 'none'}`,
    ),
  );

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
    type: 'confirm',
    message: 'Do you want to proceed?',
    name: 'confirm',
  });
  if (!confirm) {
    console.log('Aborted');
    process.exit(0);
  }

  const { database } = await turso.databases.create(organization, {
    name,
    group: selectedGroup.name,
    size_limit: size,
    seed: {
      name: seedDatabase,
      type: 'database',
      timestamp: parsedTimestamp?.toISOString(),
    },
  });

  console.log(
    `Database created: ${fmt.primary(database.Name)} (${fmt.secondary(
      database.DbId,
    )})`,
  );
  process.exit(0);
} else if (useSeed === 'dump') {
  const { url } = await inquirer.prompt<{ url: string }>({
    type: 'input',
    message: 'Provide the URL of the dump you want to use',
    name: 'url',
  });

  const { database } = await turso.databases.create(organization, {
    name,
    group: selectedGroup.name,
    size_limit: size,
    seed: {
      type: 'dump',
      url,
    },
  });

  console.log(
    `Database created: ${fmt.primary(database.Name)} (${fmt.secondary(
      database.DbId,
    )})`,
  );
  process.exit(0);
}
