import { turso, fmt } from "../utils";
import inquirer from "inquirer";

const organizations = await turso.organizations.list();
const { organization } = await inquirer.prompt<{ organization: string }>({
  type: "list",
  message: "Select an organization",
  name: "organization",
  choices: organizations.map((o) => ({
    name: o.name,
    value: o.slug,
  })),
});

console.log(fmt.muted(`Selected organization: ${organization}`));

const {name} = await inquirer.prompt<{name: string}>({
  type: 'input',
  message: 'Enter the name of the new database',
  name: 'name',
});

const { database } = await turso.databases.create(
  organization,

});
