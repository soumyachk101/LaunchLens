const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || `HTTP error! Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(path: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
