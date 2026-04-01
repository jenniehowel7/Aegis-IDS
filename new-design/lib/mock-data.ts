import {
  User,
  DashboardStats,
  TrafficTrend,
  AttackCategory,
  Alert,
  LivePacket,
  Incident,
  AdminUser,
  ModelMetrics,
} from './types';

const IPS = [
  '192.168.1.10', '192.168.1.15', '192.168.1.20', '192.168.1.25',
  '10.0.0.5', '10.0.0.12', '10.0.0.18', '10.0.0.25',
  '172.16.0.10', '172.16.0.20', '172.16.0.30',
  '203.0.113.45', '198.51.100.12', '192.0.2.89',
];

const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
const SERVICES = ['http', 'https', 'ssh', 'ftp', 'dns', 'smtp', 'mysql'];
const ATTACK_TYPES = ['DoS', 'Probe', 'R2L', 'U2R', 'SQL Injection', 'XSS', 'Port Scan'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function formatTime(date: Date): string {
  return date.toISOString().split('T')[1].split('.')[0];
}

export const mockData = {
  users: [
    {
      id: 'user_1',
      username: 'individual_user',
      email: 'individual@aegis.com',
      role: 'Individual' as const,
      full_name: 'John Doe',
      title: 'Security Analyst',
      team: 'Security Operations',
      phone: '+1-555-0101',
      timezone: 'America/New_York',
      two_factor_enabled: false,
    },
    {
      id: 'user_2',
      username: 'company_user',
      email: 'company@aegis.com',
      role: 'Company' as const,
      full_name: 'Jane Smith',
      title: 'Security Manager',
      team: 'Enterprise Security',
      phone: '+1-555-0102',
      timezone: 'America/Los_Angeles',
      two_factor_enabled: true,
    },
    {
      id: 'user_3',
      username: 'admin_user',
      email: 'admin@aegis.com',
      role: 'Admin' as const,
      full_name: 'Admin User',
      title: 'System Administrator',
      team: 'Platform Team',
      phone: '+1-555-0103',
      timezone: 'UTC',
      two_factor_enabled: true,
    },
  ] as User[],

  dashboard: {
    stats: {
      total_packets: 1247893,
      threats_detected: 3847,
      uptime: '99.97%',
      throughput: '1.2 Gbps',
      open_incidents: 12,
    } as DashboardStats,
    traffic_trends: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      normal: randomInt(8000, 15000),
      attack: randomInt(100, 800),
    })) as TrafficTrend[],
    attack_categories: ATTACK_TYPES.map(type => ({
      category: type,
      count: randomInt(50, 500),
    })) as AttackCategory[],
    protocol_distribution: PROTOCOLS.map(protocol => ({
      protocol,
      count: randomInt(1000, 5000),
    })),
    service_distribution: SERVICES.map(service => ({
      service,
      count: randomInt(500, 3000),
    })),
    recent_alerts: Array.from({ length: 10 }, (_, i) => ({
      id: `alert_${i + 1}`,
      time: new Date(Date.now() - i * 60000).toISOString(),
      src_ip: randomItem(IPS),
      dst_ip: randomItem(IPS),
      protocol: randomItem(PROTOCOLS),
      service: randomItem(SERVICES),
      status: Math.random() > 0.3 ? 'Attack' : 'Normal',
      severity: randomItem(['Low', 'Medium', 'High', 'Critical']),
      confidence: parseFloat((Math.random() * 30 + 70).toFixed(2)),
    })) as Alert[],
  },

  generateLivePackets(count: number): LivePacket[] {
    return Array.from({ length: count }, (_, i) => {
      const now = new Date(Date.now() - i * 1000);
      const isAttack = Math.random() > 0.85;
      return {
        id: `pkt_${Date.now()}_${i}`,
        time: formatTime(now),
        src_ip: randomItem(IPS),
        dst_ip: randomItem(IPS),
        port: randomInt(1024, 65535),
        protocol: randomItem(PROTOCOLS),
        service: randomItem(SERVICES),
        src_bytes: randomInt(64, 8192),
        dst_bytes: randomInt(64, 8192),
        duration: randomFloat(0.01, 5.0),
        latency: randomFloat(1, 50),
        status: isAttack ? 'Attack' : 'Normal',
        confidence: parseFloat((Math.random() * 30 + (isAttack ? 70 : 90)).toFixed(2)),
      };
    });
  },

  generateBatchResult() {
    const total = randomInt(800, 1200);
    const threats = randomInt(50, 150);
    const predictions = Array.from({ length: Math.min(total, 100) }, (_, i) => ({
      id: i + 1,
      src_ip: randomItem(IPS),
      dst_ip: randomItem(IPS),
      protocol: randomItem(PROTOCOLS),
      service: randomItem(SERVICES),
      status: Math.random() > 0.85 ? 'Attack' : 'Normal',
      confidence: parseFloat((Math.random() * 30 + 70).toFixed(2)),
    }));

    return {
      total_records: total,
      threats_detected: threats,
      normal_traffic: total - threats,
      predictions,
      raw_data: predictions.slice(0, 10).map(p => ({
        ...p,
        src_bytes: randomInt(64, 8192),
        dst_bytes: randomInt(64, 8192),
        duration: randomFloat(0.01, 5.0),
      })),
      insights: {
        service_breakdown: SERVICES.map(service => ({
          service,
          count: randomInt(50, 200),
        })),
        protocol_distribution: PROTOCOLS.map(protocol => ({
          protocol,
          count: randomInt(100, 400),
        })),
      },
    };
  },

  model: {
    precision: 0.963,
    recall: 0.947,
    f1_score: 0.955,
    auc: 0.982,
    confusion_matrix: [
      [8523, 234],
      [187, 3421],
    ],
    detection_by_type: ATTACK_TYPES.map(type => ({
      type,
      rate: parseFloat((Math.random() * 15 + 85).toFixed(1)),
    })),
    roc_curve: Array.from({ length: 20 }, (_, i) => ({
      fpr: i / 19,
      tpr: Math.min(1, (i / 19) * 1.05 + randomFloat(-0.02, 0.02)),
    })),
    operational: {
      detection_latency_ms: 12.4,
      false_positive_ceiling: 2.3,
      service_availability: 99.97,
    },
  } as ModelMetrics,

  incidents: Array.from({ length: 15 }, (_, i) => ({
    id: `inc_${i + 1}`,
    time: new Date(Date.now() - i * 3600000).toISOString(),
    src_ip: randomItem(IPS),
    dst_ip: randomItem(IPS),
    protocol: randomItem(PROTOCOLS),
    service: randomItem(SERVICES),
    status: 'Attack' as const,
    severity: randomItem(['Low', 'Medium', 'High', 'Critical']) as any,
    confidence: parseFloat((Math.random() * 20 + 80).toFixed(2)),
    method: randomItem(['GET', 'POST', 'PUT', 'DELETE']),
    path: randomItem(['/api/users', '/admin', '/login', '/data', '/config']),
    reason: randomItem(ATTACK_TYPES),
  })) as Incident[],

  generateIncidentDetail(incident: Incident) {
    return {
      request: {
        method: incident.method || 'GET',
        path: incident.path || '/api/endpoint',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; scanner/1.0)',
          'Content-Type': 'application/json',
          'X-Forwarded-For': incident.src_ip,
        },
        body: '{"query": "SELECT * FROM users WHERE id=1 OR 1=1"}',
      },
      rationale: {
        reason: incident.reason || randomItem(ATTACK_TYPES),
        features: [
          { name: 'Request Pattern', value: 'SQL Injection Signature', impact: 'High' },
          { name: 'Traffic Volume', value: 'Anomalous Spike', impact: 'Medium' },
          { name: 'Source Reputation', value: 'Known Malicious', impact: 'High' },
        ],
      },
      playbook: {
        severity: incident.severity,
        recommended_actions: [
          'Block source IP immediately',
          'Review application logs for exploitation attempts',
          'Verify database integrity',
        ],
        containment: [
          'Add firewall rule to block source IP',
          'Enable rate limiting on affected endpoint',
          'Activate enhanced monitoring',
        ],
        investigation: [
          'Collect full packet capture',
          'Analyze application logs',
          'Check for data exfiltration',
          'Review user access patterns',
        ],
      },
      timeline: [
        {
          timestamp: incident.time,
          event: 'Initial detection',
          actor: 'Aegis IDS',
        },
        {
          timestamp: new Date(new Date(incident.time).getTime() + 5000).toISOString(),
          event: 'Alert generated',
          actor: 'Detection Engine',
        },
        {
          timestamp: new Date(new Date(incident.time).getTime() + 10000).toISOString(),
          event: 'Incident created',
          actor: 'System',
        },
      ],
    };
  },

  adminUsers: [
    {
      id: 'user_1',
      username: 'individual_user',
      email: 'individual@aegis.com',
      role: 'Individual' as const,
      created_at: '2024-01-15T10:30:00Z',
      last_login: '2024-03-20T14:22:00Z',
      status: 'Active' as const,
    },
    {
      id: 'user_2',
      username: 'company_user',
      email: 'company@aegis.com',
      role: 'Company' as const,
      created_at: '2024-01-10T09:15:00Z',
      last_login: '2024-03-23T08:45:00Z',
      status: 'Active' as const,
    },
    {
      id: 'user_3',
      username: 'admin_user',
      email: 'admin@aegis.com',
      role: 'Admin' as const,
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-03-23T10:00:00Z',
      status: 'Active' as const,
    },
  ] as AdminUser[],
};
