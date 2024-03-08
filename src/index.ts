import { AuthClient } from './auth';
import { DatabasesClient } from './databases';
import { GroupsClient } from './groups';
import { HttpClient } from './http';
import { LocationsClient } from './locations';
import { OrganizationsClient } from './organizations';

export interface TursoPlatformClientOptions {
  /**
   * The base URL for the Turso Platform API.
   * Useful when using [`turso-local`](https://github.com/msanchezdev/turso-local) for local development.
   * @default 'https://api.turso.io'
   */
  baseUrl?: string;

  /**
   * The API token to use for authenticating requests to the Turso Platform API.
   */
  token?: string;

  /**
   * The API URL for the regions API.
   * @default 'https://region.turso.io'
   */
  regionApiUrl?: string;
}

export class TursoPlatformClient {
  private http: HttpClient;

  constructor(options: TursoPlatformClientOptions = {}) {
    const baseUrl = options.baseUrl ?? 'https://api.turso.tech';
    const token = options.token;

    const http = new HttpClient();
    this.http = http;
    if (baseUrl) {
      http.setBaseUrl(baseUrl);
    }

    if (token) {
      http.setToken(token);
    }

    this.auth = new AuthClient(http);
    this.groups = new GroupsClient(http);
    this.databases = new DatabasesClient(http);
    this.locations = new LocationsClient(http, options.regionApiUrl);
    this.organizations = new OrganizationsClient(http);
  }

  auth: AuthClient;
  groups: GroupsClient;
  databases: DatabasesClient;
  organizations: OrganizationsClient;
  locations: LocationsClient;
}
