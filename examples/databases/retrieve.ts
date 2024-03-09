import { fmt, turso } from '../utils';
import inquirer from 'inquirer';

const { databaseName } = await inquirer.prompt<{ databaseName: string }>({
  type: 'input',
  message: 'Enter the name of the database you want to search for:',
  name: 'databaseName',
});

const organizations = await turso.organizations.list();
for (const organization of organizations) {
  try {
    const { database } = await turso.databases.retrieve(
      organization.slug,
      databaseName,
    );

    console.log(
      `Database: ${fmt.primary(database.Name)} (${fmt.secondary(
        database.DbId,
      )})`,
    );
    console.log(`  Hostname: ${fmt.string(database.Hostname)}`);
    console.log(`  Group: ${fmt.string(database.group)}`);
    console.log(`  Primary group: ${fmt.string(database.primaryGroup)}`);
    console.log(`  Regions: ${fmt.string(database.regions.join(', '))}`);
    console.log(`  Type: ${fmt.string(database.type)}`);
    console.log(`  Version: ${fmt.secondary(database.version)}`);
    process.exit(0);
  } catch (err) {}
}

console.error(`Database ${databaseName} not found`);
