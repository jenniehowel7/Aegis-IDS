'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppShell } from '@/components/app-shell';
import { api } from '@/lib/api';
import { ModelMetrics } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Target, Activity, Zap, Loader as Loader2 } from 'lucide-react';

export default function ModelPage() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.model.getMetrics();
      setMetrics(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Company', 'Admin']}>
        <AppShell>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (error || !metrics) {
    return (
      <ProtectedRoute allowedRoles={['Company', 'Admin']}>
        <AppShell>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error || 'Failed to load metrics'}</p>
            </CardContent>
          </Card>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Company', 'Admin']}>
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Model Analytics</h1>
            <p className="text-slate-600">Performance metrics and detection capabilities</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Precision</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(metrics.precision * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">True positive accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recall</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(metrics.recall * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Threat detection rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
                <Brain className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(metrics.f1_score * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Harmonic mean</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AUC</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(metrics.auc * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Area under curve</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Confusion Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">True Negative</p>
                        <p className="text-3xl font-bold text-green-600">
                          {metrics.confusion_matrix[0][0].toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Correct normal</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">False Positive</p>
                        <p className="text-3xl font-bold text-orange-600">
                          {metrics.confusion_matrix[0][1].toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">False alarms</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">False Negative</p>
                        <p className="text-3xl font-bold text-red-600">
                          {metrics.confusion_matrix[1][0].toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Missed threats</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">True Positive</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {metrics.confusion_matrix[1][1].toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Detected threats</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Rate by Attack Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.detection_by_type} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="type" width={100} />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ROC Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={metrics.roc_curve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fpr"
                    label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
                    domain={[0, 1]}
                  />
                  <YAxis
                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                    domain={[0, 1]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tpr"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Model Performance"
                  />
                  <Line
                    type="monotone"
                    data={[{ fpr: 0, baseline: 0 }, { fpr: 1, baseline: 1 }]}
                    dataKey="baseline"
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                    dot={false}
                    name="Random Classifier"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Detection Latency</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {metrics.operational.detection_latency_ms.toFixed(1)}ms
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((20 / metrics.operational.detection_latency_ms) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Target: &lt; 20ms</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">False Positive Rate</span>
                    <span className="text-2xl font-bold text-green-600">
                      {metrics.operational.false_positive_ceiling.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min((5 / metrics.operational.false_positive_ceiling) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Target: &lt; 5%</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Service Availability</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {metrics.operational.service_availability.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${metrics.operational.service_availability}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Target: &gt; 99.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
