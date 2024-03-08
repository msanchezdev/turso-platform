import type { HttpClient } from './http';

export class LocationsClient {
  constructor(
    private http: HttpClient,
    private regionApiUrl = 'https://region.turso.io',
  ) {}

  list() {
    return this.http.get<{ locations: Record<string, string> }>(
      '/v1/locations',
    );
  }

  closest() {
    return this.http.get<{
      server: string;
      client: string;
    }>(this.regionApiUrl);
  }
}
