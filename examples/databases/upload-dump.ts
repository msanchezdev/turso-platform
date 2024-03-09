import { closeSync, existsSync, openSync, readSync, statSync } from 'fs';
import { turso, fmt, filters, bytesToSize } from '../utils';
import inquirer from 'inquirer';
import { readableStreamToBlob } from 'bun';

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

const { filePath } = await inquirer.prompt<{ filePath: string }>({
  type: 'input',
  message: 'Enter the path to the dump file:',
  name: 'filePath',
  default: 'examples/dump.sql',
  validate: filters.required(),
});

if (!existsSync(filePath)) {
  console.error(`File ${filePath} does not exist`);
  process.exit(1);
}

console.log(fmt.muted(`Selected file: ${filePath}`));
console.log(fmt.muted(`First 100 bytes of the file:`));
console.log(fmt.muted(`---------------------------------`));

const { size } = statSync(filePath);
const fd = openSync(filePath, 'r');
const buffer = Buffer.alloc(100);
readSync(fd, buffer, 0, 100, 0);
closeSync(fd);
const content = buffer.toString();

console.log(fmt.muted(content));
console.log(fmt.muted(`---------------------------------`));
console.log(fmt.muted(`File size: ${bytesToSize(size)}`));

const confirm = await inquirer.prompt<{ confirm: boolean }>({
  type: 'confirm',
  message: 'Do you want to upload this file?',
  name: 'confirm',
});

if (!confirm.confirm) {
  console.log('Aborted');
  process.exit(0);
}

const result = await turso.databases.uploadDump(
  organization,
  Bun.file(filePath),
);
console.log(fmt.success(`File uploaded successfully`));
console.log(fmt.primary(`  ${result.dump_url}`));
