import type { HttpClient } from './http';

export class DatabasesClient {
  constructor(private readonly http: HttpClient) {}

  list(organizationName: string) {
    return this.http.get<{ databases: Database[] }>(
      `/v1/organizations/${organizationName}/databases`,
    );
  }

  create(organizationName: string, database: DatabaseCreatePayload) {
    return this.http.post<{
      database: {
        DbId: string;
        Hostname: string;
        Name: string;
      };
    }>(`/v1/organizations/${organizationName}/databases`, database);
  }

  retrieve(organizationName: string, databaseName: string) {
    return this.http.get<{ database: Database }>(
      `/v1/organizations/${organizationName}/databases/${databaseName}`,
    );
  }

  delete(organizationName: string, databaseName: string) {
    return this.http.delete<{
      database: string;
    }>(`/v1/organizations/${organizationName}/databases/${databaseName}`);
  }

  listInstances(organizationName: string, databaseName: string) {
    return this.http.get<{
      instances: DatabaseInstance[];
    }>(
      `/v1/organizations/${organizationName}/databases/${databaseName}/instances`,
    );
  }

  retrieveInstance(
    organizationName: string,
    databaseName: string,
    instanceName: string,
  ) {
    return this.http.get<{
      instance: DatabaseInstance;
    }>(
      `/v1/organizations/${organizationName}/databases/${databaseName}/instances/${instanceName}`,
    );
  }

  createToken(
    organizationName: string,
    databaseName: string,
    options: {
      expiration?: string;
      authorization?: DatabaseAuthorizationLevel;
    } = {},
  ) {
    const params = new URLSearchParams();

    if (options.expiration) {
      params.set('expiration', options.expiration);
    }

    if (options.authorization) {
      params.set('authorization', options.authorization);
    }

    return this.http.post<{
      jwt: string;
    }>(
      `/v1/organizations/${organizationName}/databases/${databaseName}/auth/tokens?${params}`,
    );
  }

  invalidateTokens(organizationName: string, databaseName: string) {
    return this.http.post<void>(
      `/v1/organizations/${organizationName}/databases/${databaseName}/auth/rotate`,
    );
  }

  getUsage(
    organizationName: string,
    databaseName: string,
    filters: {
      from?: Date;
      to?: Date;
    } = {},
  ) {
    const params = new URLSearchParams();

    if (filters.from) {
      params.set('from', filters.from.toISOString());
    }

    if (filters.to) {
      params.set('to', filters.to.toISOString());
    }

    return this.http.get<{
      database: {
        uuid: string;
        usage: DatabaseUsage;
        instances: {
          uuid: string;
          usage: DatabaseUsage;
        }[];
      };
    }>(`/v1/organizations/${organizationName}/databases/${databaseName}/usage`);
  }

  getStats(organizationName: string, databaseName: string) {
    return this.http.get<{
      top_queries: {
        query: string;
        rows_read: number;
        rows_written: number;
      }[];
    }>(`/v1/organizations/${organizationName}/databases/${databaseName}/stats`);
  }

  uploadDump(organizationName: string, file: Blob) {
    const formData = new FormData();

    formData.set('file', file, file.name);

    return this.http.post<{
      dump_url: string;
    }>(`/v1/organizations/${organizationName}/databases/dumps`, formData);
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
  seed?: DatabaseCreateWithDatabaseSeed | DatabaseCreateWithDumpSeed;
  size_limit?: string;
}

interface DatabaseCreateWithDatabaseSeed {
  type: 'database';
  name: string;
  timestamp?: string;
}

interface DatabaseCreateWithDumpSeed {
  type: 'dump';
  url: string;
}

interface DatabaseUsage {
  rows_read: number;
  rows_written: number;
  storage_bytes: number;
}

export type DatabaseInstanceType = 'primary' | 'replica';

interface DatabaseInstance {
  uuid: string;
  name: string;
  region: string;
  type: DatabaseInstanceType;
  hostname: string;
}

export type DatabaseAuthorizationLevel = 'full-acccess' | 'read-only';
