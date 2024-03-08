import type { HttpClient } from './http';

export class OrganizationsClient {
  constructor(private http: HttpClient) {
    this.members = new OrganizationMembersClient(http);
    this.invites = new OrganizationInvitesClient(http);
  }

  list() {
    return this.http.get<Organization[]>('/v1/organizations');
  }

  update(slug: string, changes: OrganizationUpdatePayload) {
    return this.http.patch<{
      organization: Organization;
    }>(`/v1/organizations/${slug}`, changes);
  }

  auditLogs(slug: string) {
    return this.http.get<{
      audit_logs: OrganizationAuditLog[];
      pagination: {
        page: number;
        page_size: number;
        total_pages: number;
        total_rows: number;
      };
    }>(`/v1/organizations/${slug}/audit-logs`);
  }

  members: OrganizationMembersClient;
  invites: OrganizationInvitesClient;
}

class OrganizationMembersClient {
  constructor(private http: HttpClient) {}

  list(slug: string) {
    return this.http.get<{ members: OrganizationMember[] }>(
      `/v1/organizations/${slug}/members`,
    );
  }

  add(slug: string, payload: OrganizationAddMemberPayload) {
    return this.http.post<{
      member: string;
      role: OrganizationMemberRole;
    }>(`/v1/organizations/${slug}/members`, {
      username: payload.email,
      role: payload.role,
    });
  }

  remove(slug: string, username: string) {
    return this.http.delete<{
      member: string;
    }>(`/v1/organizations/${slug}/members/${username}`);
  }
}

class OrganizationInvitesClient {
  constructor(private http: HttpClient) {}

  list(slug: string) {
    return this.http.get<{ invites: OrganizationInvite[] }>(
      `/v1/organizations/${slug}/invites`,
    );
  }

  create(slug: string, payload: OrganizationInviteMemberPayload) {
    return this.http.post<{
      invited: OrganizationInvite;
    }>(`/v1/organizations/${slug}/invites`, {
      email: payload.email,
      role: payload.role,
    });
  }
}

interface Organization {
  name: string;
  slug: string;
  type: 'personal' | 'team';
  plan_id: string;
  overages: boolean;
  blocked_reads: boolean;
  blocked_writes: boolean;
  plan_timeline: string;
  memory: number;
}

interface OrganizationUpdatePayload {
  overages?: boolean;
}

type OrganizationMemberRole = 'owner' | 'member' | 'admin';
type OrganizationMemberRoleWithoutOwner = 'member' | 'admin';

interface OrganizationMember {
  email: string;
  role: OrganizationMemberRole;
  username: string;
}

interface OrganizationAddMemberPayload {
  email: string;
  role: OrganizationMemberRoleWithoutOwner;
}

interface OrganizationInvite {
  Accepted: boolean;
  CreatedAt: string;
  DeletedAt?: string;
  Email: string;
  ID: number;
  Organization: Organization;
  OrganizationID: number;
  Role: OrganizationMemberRole;
  Token: string;
  UpdatedAt: string;
}

interface OrganizationInviteMemberPayload {
  email: string;
  role: OrganizationMemberRoleWithoutOwner;
}

interface OrganizationAuditLog {
  author: string;
  code: OrganizationAuditLogCode;
  created_at: string;
  data: unknown;
  message: string;
  orirgin: OrganizationAuditLogOrigin;
}

export type OrganizationAuditLogCode =
  | 'user-signup'
  | 'db-create'
  | 'db-delete'
  | 'instance-create'
  | 'instance-delete'
  | 'org-create'
  | 'org-delete'
  | 'org-member-add'
  | 'org-member-rm'
  | 'org-member-leave'
  | 'org-plan-update'
  | 'org-set-overages'
  | 'group-create'
  | 'group-delete';

export type OrganizationAuditLogOrigin = 'cli' | 'web';
