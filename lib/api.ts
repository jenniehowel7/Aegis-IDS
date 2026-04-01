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
import { mockData } from './mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
void API_BASE;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const MOCK_MODE = true;
void MOCK_MODE;

const isUserRole = (role: string): role is UserRole =>
  role === 'Individual' || role === 'Company' || role === 'Admin';

async function mockDelay(ms: number = 500) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

export const api = {
  auth: {
    async login(identifier: string, password: string): Promise<User> {
      await mockDelay();
      const user = mockData.users.find(
        u => (u.username === identifier || u.email === identifier) && password === 'Aegis2026!'
      );
      if (!user) {
        throw new ApiError(401, 'Invalid credentials');
      }
      return user;
    },

    async register(data: {
      username: string;
      email: string;
      role: string;
      password: string;
    }): Promise<User> {
      await mockDelay();
      if (data.password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
      }
      const newUser: User = {
        id: `user_${Date.now()}`,
        username: data.username,
        email: data.email,
        role: isUserRole(data.role) ? data.role : 'Individual',
      };
      return newUser;
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
      await mockDelay();
      return mockData.dashboard;
    },
  },

  live: {
    async getStream(): Promise<LivePacket[]> {
      await mockDelay(200);
      return mockData.generateLivePackets(10);
    },
  },

  batch: {
    async analyze(file: File): Promise<BatchResult> {
      void file;
      await mockDelay(1500);
      return mockData.generateBatchResult();
    },
  },

  model: {
    async getMetrics(): Promise<ModelMetrics> {
      await mockDelay();
      return mockData.model;
    },
  },

  incidents: {
    async getAll(): Promise<Incident[]> {
      await mockDelay();
      return mockData.incidents;
    },

    async getById(id: string): Promise<Incident> {
      await mockDelay();
      const incident = mockData.incidents.find(i => i.id === id);
      if (!incident) {
        throw new ApiError(404, 'Incident not found');
      }
      return {
        ...incident,
        detail: mockData.generateIncidentDetail(incident),
      };
    },
  },

  profile: {
    async get(userId: string): Promise<User> {
      await mockDelay();
      const user = mockData.users.find(u => u.id === userId);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      return user;
    },

    async update(userId: string, data: Partial<User>): Promise<User> {
      await mockDelay();
      const user = mockData.users.find(u => u.id === userId);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      return { ...user, ...data };
    },

    async updateSecurity(userId: string, data: { two_factor_enabled: boolean }): Promise<void> {
      void userId;
      void data;
      await mockDelay();
    },

    async updatePassword(
      userId: string,
      data: { current_password: string; new_password: string }
    ): Promise<void> {
      void userId;
      await mockDelay();
      if (data.current_password !== 'Aegis2026!') {
        throw new ApiError(401, 'Current password is incorrect');
      }
      if (data.new_password.length < 8) {
        throw new ApiError(400, 'New password must be at least 8 characters');
      }
    },
  },

  admin: {
    async getUsers(): Promise<AdminUser[]> {
      await mockDelay();
      return mockData.adminUsers;
    },
  },

  health: {
    async check(): Promise<{ status: string }> {
      await mockDelay(100);
      return { status: 'healthy' };
    },
  },
};
