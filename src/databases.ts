import type { HttpClient } from './http';

export class DatabasesClient {
  constructor(private readonly client: HttpClient) {}

  list(organizationName: string) {
    return this.client.get<{ databases: Database[] }>(
      `/v1/organizations/${organizationName}/databases`,
    );
  }

  create(organizationName: string, database: DatabaseCreatePayload) {
    return this.client.post<{
      database: {
        DbId: string;
        Hostname: string;
        Name: string;
      };
    }>(`/v1/organizations/${organizationName}/databases`, database);
  }
}

interface Database {
  DbId: string;
  Hostname: string;
  Name: string;
  group: string;
  primaryGroup: string;
  regions: string[];
  type: string;
  version: string;
}

interface DatabaseCreatePayload {
  name: string;
  group: string;
  seed?: DatabaseCreateWithDatabaseSeed;
  size_limit?: string;
}

interface DatabaseCreateWithDatabaseSeed {
  type: 'database';
  name: string;
  timestamp?: string;
}
