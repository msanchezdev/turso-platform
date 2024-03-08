import type { HttpClient } from './http';

export class GroupsClient {
  constructor(private readonly http: HttpClient) {}

  availableExtensions = [
    'vector',
    'vss',
    'crypto',
    'fuzzy',
    'math',
    'stats',
    'text',
    'unicode',
    'uuid',
    'regexp',
  ] as const;

  list(organizationName: string) {
    return this.http.get<{ groups: Group[] }>(
      `/v1/organizations/${organizationName}/groups`,
    );
  }

  get(organizationName: string, groupName: string) {
    return this.http.get<{ group: Group }>(
      `/v1/organizations/${organizationName}/groups/${groupName}`,
    );
  }

  create(organizationName: string, group: GroupCreatePayload) {
    return this.http.post<{ group: Group }>(
      `/v1/organizations/${organizationName}/groups`,
      group,
    );
  }

  delete(organizationName: string, groupName: string) {
    return this.http.delete<{
      group: Group;
    }>(`/v1/organizations/${organizationName}/groups/${groupName}`);
  }

  transfer(
    organizationName: string,
    groupName: string,
    destinationOrganization: string,
  ) {
    return this.http.post<Group>(
      `/v1/organizations/${organizationName}/groups/${groupName}/transfer`,
      { organization: destinationOrganization },
    );
  }

  addLocation(organizationName: string, groupName: string, location: string) {
    return this.http.post<{ group: Group }>(
      `/v1/organizations/${organizationName}/groups/${groupName}/locations/${location}`,
    );
  }

  removeLocation(
    organizationName: string,
    groupName: string,
    location: string,
  ) {
    return this.http.delete<{ group: Group }>(
      `/v1/organizations/${organizationName}/groups/${groupName}/locations/${location}`,
    );
  }

  /**
   * @alias upgradeDatabases
   */
  update = this.upgradeDatabases;

  upgradeDatabases(organizationName: string, groupName: string) {
    return this.http.post<void>(
      `/v1/organizations/${organizationName}/groups/${groupName}/update`,
      {
        update: true,
      },
    );
  }

  createToken(
    organizationName: string,
    groupName: string,
    payload: GroupCreateTokenPayload,
  ) {
    const params = new URLSearchParams();
    if (payload.expiration) {
      params.set('expiration', payload.expiration);
    }
    if (payload.authorization) {
      params.set('authorization', payload.authorization);
    }

    return this.http.post<{ jwt: string }>(
      `/v1/organizations/${organizationName}/groups/${groupName}/auth/tokens?${params}`,
    );
  }

  invalidateTokens(organizationName: string, groupName: string) {
    return this.http.post<void>(
      `/v1/organizations/${organizationName}/groups/${groupName}/auth/rotate`,
    );
  }
}

interface Group {
  uuid: string;
  archived: boolean;
  locations: string[];
  name: string;
  primary: string;
}

export type GroupDatabaseExtension =
  (typeof GroupsClient.prototype.availableExtensions)[number];

interface GroupCreatePayload {
  location: string;
  name: string;
  extensions?: 'all' | GroupDatabaseExtension[];
}

export type GroupTokenAuthorizationLevel = 'full-access' | 'read-only';

interface GroupCreateTokenPayload {
  /**
   * @example '2w1d30m'
   * @default never
   */
  expiration?: string;

  /**
   * @default 'full-access'
   */
  authorization?: GroupTokenAuthorizationLevel;
}
