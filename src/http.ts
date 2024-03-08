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

  #getDefaultHeaders() {
    const defaults: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.#token) {
      defaults['Authorization'] = `Bearer ${this.#token}`;
    }

    return defaults;
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
        headers: {
          ...this.#getDefaultHeaders(),
          ...options.headers,
        },
      }),
    );
  }

  post<T>(url: string, body?: any, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        ...options,
        method: 'POST',
        headers: {
          ...this.#getDefaultHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(body),
      }),
    );
  }

  put<T>(url: string, body?: any, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        ...options,
        method: 'PUT',
        headers: {
          ...this.#getDefaultHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(body),
      }),
    );
  }

  patch<T>(url: string, body?: any, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        ...options,
        method: 'PATCH',
        headers: {
          ...this.#getDefaultHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(body),
      }),
    );
  }

  delete<T>(url: string, options: RequestInit = {}) {
    if (url.startsWith('/')) {
      url = this.#baseUrl + url;
    }

    return wrapRequest<T>(
      fetch(url, {
        ...options,
        method: 'DELETE',
        headers: {
          ...this.#getDefaultHeaders(),
          ...options.headers,
        },
      }),
    );
  }
}
