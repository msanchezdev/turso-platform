async function wrapRequest<T>(request: Promise<Response>) {
  const response = await request;
  if (!response.ok) {
    const text = await response.text();

    throw new Error(`Request failed with status ${response.status}: ${text}`);
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    const text = await response.text();

    if (!text) {
      return undefined as T;
    }

    throw new Error(
      `Failed to parse response: ${error}. Response: '${JSON.stringify(text)}'`,
    );
  }
}

export class HttpClient {
  #baseUrl = 'https://api.turso.tech';
  #token = '';

  prepareRequest(options: RequestInit = {}, body?: RequestInit['body']) {
    const headers: Record<string, string> = {};

    const prepared: RequestInit = {
      ...options,
      headers,
    };

    if (this.#token) {
      headers['Authorization'] = `Bearer ${this.#token}`;
    }

    if (body instanceof FormData) {
      prepared.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      prepared.body = JSON.stringify(body);
    }

    return prepared;
  }

  setToken(token: string) {
    if (!token) {
      throw new Error('Token must be a non-empty string');
    }

    this.#token = token;
  }

  clearToken() {
    this.#token = '';
  }

  setBaseUrl(url: string) {
    if (!url) {
      throw new Error('Base URL must be a non-empty string');
    }

    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    this.#baseUrl = url;
  }

  get<T>(url: string, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        ...options,
        method: 'GET',
        ...this.prepareRequest(options),
      }),
    );
  }

  post<T>(url: string, body?: any, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        method: 'POST',
        ...this.prepareRequest(options, body),
      }),
    );
  }

  put<T>(url: string, body?: any, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        method: 'PUT',
        ...this.prepareRequest(options, body),
      }),
    );
  }

  patch<T>(url: string, body?: any, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        method: 'PATCH',
        ...this.prepareRequest(options, body),
      }),
    );
  }

  delete<T>(url: string, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        method: 'DELETE',
        ...this.prepareRequest(options),
      }),
    );
  }
}
