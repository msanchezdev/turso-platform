import type { HttpClient } from './http';

export class AuthClient {
  constructor(private http: HttpClient) {
    this.tokens = new ApiTokensClient(http);
  }

  validate() {
    return this.http.get<{ exp: string }>('/v1/auth/validate');
  }

  tokens: ApiTokensClient;
}

class ApiTokensClient {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ tokens: ApiToken[] }>('/v1/auth/api-tokens');
  }

  create(name: string) {
    return this.http.post<
      ApiToken & {
        token: string;
      }
    >(`/v1/auth/api-tokens/${name}`);
  }

  revoke(name: string) {
    return this.http.delete<{
      token: string;
    }>(`/v1/auth/api-tokens/${name}`);
  }
}

interface ApiToken {
  id: string;
  name: string;
}
