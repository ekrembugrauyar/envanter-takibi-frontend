// API Template - Backend bağlantısı için hazır yapı
// Bu dosya, gerçek backend API'lerine bağlanmak için kullanılabilir

// Base API configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// HTTP Client
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.headers = config.headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...this.headers,
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
            statusCode: 408,
          };
        }
        return {
          success: false,
          error: error.message,
          statusCode: 500,
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred',
        statusCode: 500,
      };
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API Client instance
export const apiClient = new ApiClient(API_CONFIG);

// Authentication helpers
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  apiClient.headers['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete apiClient.headers['Authorization'];
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Companies
  COMPANIES: {
    LIST: '/companies',
    CREATE: '/companies',
    GET: (id: string) => `/companies/${id}`,
    UPDATE: (id: string) => `/companies/${id}`,
    DELETE: (id: string) => `/companies/${id}`,
  },
  
  // Locations
  LOCATIONS: {
    LIST: '/locations',
    CREATE: '/locations',
    GET: (id: string) => `/locations/${id}`,
    UPDATE: (id: string) => `/locations/${id}`,
    DELETE: (id: string) => `/locations/${id}`,
  },
  
  // Modems
  MODEMS: {
    LIST: '/modems',
    CREATE: '/modems',
    GET: (id: string) => `/modems/${id}`,
    UPDATE: (id: string) => `/modems/${id}`,
    DELETE: (id: string) => `/modems/${id}`,
    SEARCH: '/modems/search',
    EXPORT: '/modems/export',
  },
  
  // SIM Cards
  SIM_CARDS: {
    LIST: '/sim-cards',
    CREATE: '/sim-cards',
    GET: (id: string) => `/sim-cards/${id}`,
    UPDATE: (id: string) => `/sim-cards/${id}`,
    DELETE: (id: string) => `/sim-cards/${id}`,
  },
  
  // Work Orders
  WORK_ORDERS: {
    LIST: '/work-orders',
    CREATE: '/work-orders',
    GET: (id: string) => `/work-orders/${id}`,
    UPDATE: (id: string) => `/work-orders/${id}`,
    DELETE: (id: string) => `/work-orders/${id}`,
    SLA_ALERTS: '/work-orders/sla-alerts',
  },
  
  // Test Scenarios
  TEST_SCENARIOS: {
    LIST: '/test-scenarios',
    CREATE: '/test-scenarios',
    GET: (id: string) => `/test-scenarios/${id}`,
    UPDATE: (id: string) => `/test-scenarios/${id}`,
    DELETE: (id: string) => `/test-scenarios/${id}`,
  },
  
  // Test Sessions
  TEST_SESSIONS: {
    LIST: '/test-sessions',
    CREATE: '/test-sessions',
    GET: (id: string) => `/test-sessions/${id}`,
    UPDATE: (id: string) => `/test-sessions/${id}`,
    DELETE: (id: string) => `/test-sessions/${id}`,
  },
  
  // Scrap Requests
  SCRAP_REQUESTS: {
    LIST: '/scrap-requests',
    CREATE: '/scrap-requests',
    GET: (id: string) => `/scrap-requests/${id}`,
    UPDATE: (id: string) => `/scrap-requests/${id}`,
    DELETE: (id: string) => `/scrap-requests/${id}`,
  },
  
  // Alerts
  ALERTS: {
    LIST: '/alerts',
    CREATE: '/alerts',
    GET: (id: string) => `/alerts/${id}`,
    UPDATE: (id: string) => `/alerts/${id}`,
    DELETE: (id: string) => `/alerts/${id}`,
    MARK_READ: (id: string) => `/alerts/${id}/mark-read`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
    ALERTS: '/dashboard/alerts',
  },
  
  // Search
  SEARCH: {
    GLOBAL: '/search',
  },
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Request interceptor example
export const addRequestInterceptor = (interceptor: (config: any) => any) => {
  // Implementation for request interception
  console.log('Request interceptor added:', interceptor);
};

// Response interceptor example
export const addResponseInterceptor = (
  onSuccess: (response: any) => any,
  onError: (error: any) => any
) => {
  // Implementation for response interception
  console.log('Response interceptors added:', { onSuccess, onError });
};
