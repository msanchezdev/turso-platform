import inquirer from 'inquirer';
import { fmt, turso } from '../utils';

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

const { databases } = await turso.databases.list(organization);
const { databaseName } = await inquirer.prompt<{ databaseName: string }>({
  type: 'list',
  message: 'Select a database',
  name: 'databaseName',
  loop: false,
  choices: databases.map((d) => d.Name),
});

const { top_queries } = await turso.databases.getStats(
  organization,
  databaseName,
);

console.log(`Database: ${fmt.string(databaseName)}`);

for (const query of top_queries) {
  console.log(`  - ${fmt.string(query.query.replace(/\n/g, '\n    '))}`);
  console.log(`    Rows Read: ${fmt.number(query.rows_read)}`);
  console.log(`    Rows Written: ${fmt.number(query.rows_written)}`);
}
