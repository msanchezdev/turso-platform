import { fmt, turso } from '../utils';

const { locations } = await turso.locations.list();

for (const code in locations) {
  const location = locations[code];

  console.log(`${location} (${fmt.secondary(code)})`);
}
