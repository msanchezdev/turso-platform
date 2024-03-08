import { fmt, turso } from '../../utils';

const organizations = await turso.organizations.list();

for (const organization of organizations) {
  const { members } = await turso.organizations.members.list(organization.slug);

  console.log(
    `Organization: ${fmt.string(organization.name)} (${fmt.secondary(
      organization.slug,
    )})`,
  );
  for (const member of members) {
    console.log(
      `  ${member.role === 'owner' ? '👑' : ' '} ${fmt.primary(
        member.username,
      )} (${fmt.secondary(member.email)})`,
    );
  }
}
