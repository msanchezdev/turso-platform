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
const { name } = await inquirer.prompt<{ name: string }>({
  type: 'input',
  message:
    'Guess the name of the groups in your organization and win a prize!🎉',
  name: 'name',
});

try {
  const { group } = await turso.groups.get(organization, name);
  console.log(
    `You guessed it! The group ${fmt.primary(
      group.name,
    )} is in your organization!`,
  );
  console.write(`You won`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.write(`.`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.write(`.`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.write(`. `);
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`the satisfaction of knowing you guessed it right!`);
} catch (error) {
  console.log(
    `You guessed wrong! There is no group named ${fmt.primary(
      name,
    )} in your organization!`,
  );
  console.log(`Better luck next time!`);
}
