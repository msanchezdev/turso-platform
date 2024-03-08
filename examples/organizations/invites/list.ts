import { fmt, turso } from '../../utils';

const organizations = await turso.organizations.list();

for (const organization of organizations) {
  const { invites } = await turso.organizations.invites.list(organization.slug);

  console.log(
    `Organization: ${fmt.string(organization.name)} (${fmt.secondary(
      organization.slug,
    )})`,
  );
  for (const invite of invites) {
    console.log(
      `  ${fmt.primary(invite.Email)} (${fmt.secondary(invite.Role)})`,
    );
    console.log(fmt.muted(`    Accepted: ${invite.Accepted}`));
    console.log(fmt.muted(`    Created: ${invite.CreatedAt}`));
    console.log(fmt.muted(`    Deleted: ${invite.DeletedAt}`));
    console.log(fmt.muted(`    Updated: ${invite.UpdatedAt}`));
  }
}
