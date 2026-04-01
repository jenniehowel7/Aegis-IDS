'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppShell } from '@/components/app-shell';
import { api } from '@/lib/api';
import { Alert } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Shield, Clock, Zap, TriangleAlert as AlertTriangle, Loader as Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await api.dashboard.getStats();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">System overview and real-time metrics</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Packets</CardTitle>
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.stats.total_packets.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
                    <div className="p-2 bg-red-600/20 rounded-lg">
                      <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {data.stats.threats_detected.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((data.stats.threats_detected / data.stats.total_packets) * 100).toFixed(2)}% of traffic
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {data.stats.uptime}
                    </div>
                    <p className="text-xs text-muted-foreground">System availability</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                    <div className="p-2 bg-yellow-600/20 rounded-lg">
                      <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{data.stats.throughput}</div>
                    <p className="text-xs text-muted-foreground">Current average</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
                    <div className="p-2 bg-orange-600/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {data.stats.open_incidents}
                    </div>
                    <p className="text-xs text-muted-foreground">Requires attention</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Trends (24h)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data.traffic_trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="normal"
                          stroke="#10b981"
                          name="Normal Traffic"
                        />
                        <Line
                          type="monotone"
                          dataKey="attack"
                          stroke="#ef4444"
                          name="Attack Traffic"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attack Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.attack_categories}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Protocol Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.protocol_distribution}
                          dataKey="count"
                          nameKey="protocol"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {data.protocol_distribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.service_distribution}
                          dataKey="count"
                          nameKey="service"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {data.service_distribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Source IP</TableHead>
                          <TableHead>Destination IP</TableHead>
                          <TableHead>Protocol</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.recent_alerts.map((alert: Alert) => (
                          <TableRow key={alert.id}>
                            <TableCell className="font-mono text-xs">
                              {new Date(alert.time).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {alert.src_ip}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {alert.dst_ip}
                            </TableCell>
                            <TableCell>{alert.protocol}</TableCell>
                            <TableCell>{alert.service}</TableCell>
                            <TableCell>
                              <Badge variant={alert.status === 'Attack' ? 'destructive' : 'default'}>
                                {alert.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getSeverityColor(alert.severity) as any}>
                                {alert.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>{alert.confidence.toFixed(1)}%</TableCell>
                            <TableCell>
                              <Select
                                value={selectedAlert?.id === alert.id ? alert.id : ''}
                                onValueChange={() => setSelectedAlert(alert)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="View" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={alert.id}>Inspect</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {selectedAlert && (
                    <Card className="mt-4 bg-slate-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Alert Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">Alert ID:</span> {selectedAlert.id}
                          </div>
                          <div>
                            <span className="font-semibold">Time:</span>{' '}
                            {new Date(selectedAlert.time).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-semibold">Source IP:</span> {selectedAlert.src_ip}
                          </div>
                          <div>
                            <span className="font-semibold">Destination IP:</span>{' '}
                            {selectedAlert.dst_ip}
                          </div>
                          <div>
                            <span className="font-semibold">Protocol:</span> {selectedAlert.protocol}
                          </div>
                          <div>
                            <span className="font-semibold">Service:</span> {selectedAlert.service}
                          </div>
                          <div>
                            <span className="font-semibold">Status:</span>{' '}
                            <Badge
                              variant={
                                selectedAlert.status === 'Attack' ? 'destructive' : 'default'
                              }
                            >
                              {selectedAlert.status}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-semibold">Severity:</span>{' '}
                            <Badge variant={getSeverityColor(selectedAlert.severity) as any}>
                              {selectedAlert.severity}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <span className="font-semibold">Confidence:</span>{' '}
                            {selectedAlert.confidence.toFixed(2)}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
