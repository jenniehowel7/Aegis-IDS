import {
  User,
  UserRole,
  DashboardStats,
  TrafficTrend,
  AttackCategory,
  Alert,
  LivePacket,
  BatchResult,
  ModelMetrics,
  Incident,
  AdminUser,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}

export const api = {
  auth: {
    async login(identifier: string, password: string): Promise<User> {
      const data = await request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });
      localStorage.setItem('token', data.token);
      return data.user;
    },

    async register(data: { username: string; email: string; role: string; password: string }): Promise<User> {
      const result = await request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      localStorage.setItem('token', result.token);
      return result.user;
    },
  },

  dashboard: {
    async getStats(): Promise<{
      stats: DashboardStats;
      traffic_trends: TrafficTrend[];
      attack_categories: AttackCategory[];
      protocol_distribution: Array<{ protocol: string; count: number }>;
      service_distribution: Array<{ service: string; count: number }>;
      recent_alerts: Alert[];
    }> {
      return request('/dashboard');
    },
  },

  live: {
    async getStream(): Promise<LivePacket[]> {
      return request('/live');
    },
  },

  batch: {
    async analyze(file: File): Promise<BatchResult> {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/batch/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }
      
      return response.json();
    },

    async getHistory(): Promise<{ history: Array<{filename: string; date: string; original_filename: string; total_records: number; threats_detected: number}> }> {
      return request('/batch/history');
    },

    async getResult(filename: string): Promise<any> {
      return request(`/batch/result/${filename}`);
    }
  },

  model: {
    async getMetrics(): Promise<ModelMetrics> {
      return request('/model');
    },
  },

  incidents: {
    async getAll(): Promise<Incident[]> {
      return request('/incidents');
    },

    async getById(id: string): Promise<Incident> {
      return request(`/incidents/${id}`);
    },
  },

  profile: {
    async get(userId: string): Promise<User> {
      return request(`/profile/${userId}`);
    },

    async update(userId: string, data: Partial<User>): Promise<User> {
      return request(`/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async updateSecurity(userId: string, data: { two_factor_enabled: boolean }): Promise<void> {
      await request(`/profile/${userId}/security`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async updatePassword(userId: string, data: { current_password: string; new_password: string }): Promise<void> {
      await request(`/profile/${userId}/password`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  admin: {
    async getUsers(): Promise<AdminUser[]> {
      return request('/admin/users');
    },
  },

  health: {
    async check(): Promise<{ status: string }> {
      return request('/health');
    },
  },
};