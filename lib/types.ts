export type UserRole = 'Individual' | 'Company' | 'Admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  full_name?: string;
  title?: string;
  team?: string;
  phone?: string;
  timezone?: string;
  two_factor_enabled?: boolean;
}

export interface AuthSession {
  user: User;
  token?: string;
}

export interface DashboardStats {
  total_packets: number;
  threats_detected: number;
  uptime: string;
  throughput: string;
  open_incidents: number;
}

export interface TrafficTrend {
  time: string;
  normal: number;
  attack: number;
}

export interface AttackCategory {
  category: string;
  count: number;
}

export interface Alert {
  id: string;
  time: string;
  src_ip: string;
  dst_ip: string;
  protocol: string;
  service: string;
  status: 'Normal' | 'Attack';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  method?: string;
  path?: string;
  reason?: string;
}

export interface LivePacket {
  id: string;
  time: string;
  src_ip: string;
  dst_ip: string;
  port: number;
  protocol: string;
  service: string;
  src_bytes: number;
  dst_bytes: number;
  duration: number;
  latency: number;
  status: 'Normal' | 'Attack';
  confidence: number;
}

export interface BatchResult {
  total_records: number;
  threats_detected: number;
  normal_traffic: number;
  predictions: Array<{
    id: number;
    src_ip: string;
    dst_ip: string;
    protocol: string;
    service: string;
    status: string;
    confidence: number;
  }>;
  raw_data: Array<Record<string, unknown>>;
  insights: {
    service_breakdown: Array<{ service: string; count: number }>;
    protocol_distribution: Array<{ protocol: string; count: number }>;
  };
}

export interface IncidentFeature {
  name: string;
  value: string;
  impact: 'Low' | 'Medium' | 'High';
}

export interface IncidentTimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
}

export interface IncidentDetail {
  request: {
    method: string;
    path: string;
    headers: Record<string, string>;
    body: string;
  };
  rationale: {
    reason: string;
    features: IncidentFeature[];
  };
  playbook: {
    severity: string;
    recommended_actions: string[];
    containment: string[];
    investigation: string[];
  };
  timeline: IncidentTimelineEvent[];
}

export interface DashboardResponse {
  stats: DashboardStats;
  traffic_trends: TrafficTrend[];
  attack_categories: AttackCategory[];
  protocol_distribution: Array<{ protocol: string; count: number }>;
  service_distribution: Array<{ service: string; count: number }>;
  recent_alerts: Alert[];
}

export interface ModelMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  auc: number;
  confusion_matrix: number[][];
  detection_by_type: Array<{ type: string; rate: number }>;
  roc_curve: Array<{ fpr: number; tpr: number }>;
  operational: {
    detection_latency_ms: number;
    false_positive_ceiling: number;
    service_availability: number;
  };
}

export interface Incident extends Alert {
  detail?: IncidentDetail;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
  last_login?: string;
  status: 'Active' | 'Inactive';
}
