export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string, token?: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(token)
        });

        if (!response.ok) {
            const error = await this.handleError(response);
            throw error;
        }
        return response.json();
    }

    async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await this.handleError(response);
            throw error;
        }

        return response.json();
    }

    private getHeaders(token?: string) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }

    private async handleError(response: Response) {
        const errorData = await response.json().catch(() => null);
        return new Error(errorData?.message || `HTTP Error: ${response.status}`);
    }
  }