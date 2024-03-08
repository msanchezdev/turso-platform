import { fmt, turso } from '../../utils';

const { tokens } = await turso.auth.tokens.list();

for (const token of tokens) {
  console.log(`- ${token.name} (${fmt.string(token.id)})`);
}
