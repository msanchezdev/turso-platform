import { fmt, turso } from '../utils';

const { exp } = await turso.auth.validate();

console.log(`Token is valid until ${fmt.primary(new Date(exp).toString())}`);
