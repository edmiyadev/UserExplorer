import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

// ─── Configuration ──────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5059';
const DEFAULT_TIMEOUT = 15_000;

// ─── Custom API Error ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }

  static fromAxiosError(error: AxiosError<{ message?: string; title?: string }>): ApiError {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
      return new ApiError('Request timed out. Please try again.', 0);
    }

    if (!error.response) {
      return new ApiError('Could not connect to the server. Check your connection.', 0);
    }

    const { status, data } = error.response;
    const message = data?.message || data?.title || getDefaultErrorMessage(status);

    return new ApiError(message, status);
  }
}

function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'The request contains invalid data.',
    401: 'Unauthorized. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'Conflict: the resource already exists or was modified.',
    422: 'The submitted data could not be processed.',
    429: 'Too many requests. Please wait and try again.',
    500: 'Internal server error. Please try later.',
    502: 'The server is temporarily unavailable.',
    503: 'Service unavailable. Please try later.',
  };

  return messages[status] || `Unexpected error (status ${status}).`;
}

// ─── Interceptors ───────────────────────────────────────────────────────────────

function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  return config;
}

function onResponse(response: AxiosResponse): AxiosResponse {
  return response;
}

function onResponseError(error: AxiosError<{ message?: string; title?: string }>): Promise<never> {
  return Promise.reject(ApiError.fromAxiosError(error));
}

// ─── Instance ───────────────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(onRequest);
apiClient.interceptors.response.use(onResponse, onResponseError);

export { apiClient };
