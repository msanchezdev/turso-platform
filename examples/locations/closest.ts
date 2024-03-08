import { fmt, turso } from '../utils';

const { server, client } = await turso.locations.closest();

console.log(`Server: ${fmt.string(server)}`);
console.log(`Client: ${fmt.string(client)}`);
