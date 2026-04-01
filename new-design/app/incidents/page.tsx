'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppShell } from '@/components/app-shell';
import { api } from '@/lib/api';
import { Incident } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader as Loader2, TriangleAlert as AlertTriangle, FileText, Brain, Activity, Clock } from 'lucide-react';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'Investigating', 'Resolved', 'Closed'];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [incidentDetail, setIncidentDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    severity: SEVERITIES,
    status: ['Open', 'Investigating'],
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [incidents, filters]);

  const loadIncidents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.incidents.getAll();
      setIncidents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = incidents.filter(
      (inc) =>
        filters.severity.includes(inc.severity) &&
        filters.status.includes('Open')
    );
    setFilteredIncidents(filtered);
  };

  const handleSelectIncident = async (incident: Incident) => {
    setSelectedIncident(incident);
    setIsLoadingDetail(true);
    try {
      const detail = await api.incidents.getById(incident.id);
      setIncidentDetail(detail.detail);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const toggleSeverityFilter = (severity: string) => {
    setFilters((prev) => ({
      ...prev,
      severity: prev.severity.includes(severity)
        ? prev.severity.filter((s) => s !== severity)
        : [...prev.severity, severity],
    }));
  };

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

  return (
    <ProtectedRoute allowedRoles={['Company', 'Admin']}>
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Incident Workbench</h1>
              <p className="text-slate-600">Investigate and manage security incidents</p>
            </div>
            <Button onClick={loadIncidents} variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Severity</Label>
                  {SEVERITIES.map((sev) => (
                    <div key={sev} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sev-${sev}`}
                        checked={filters.severity.includes(sev)}
                        onCheckedChange={() => toggleSeverityFilter(sev)}
                      />
                      <label
                        htmlFor={`sev-${sev}`}
                        className="text-sm cursor-pointer flex items-center"
                      >
                        <Badge variant={getSeverityColor(sev) as any} className="ml-2">
                          {sev}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Incidents ({filteredIncidents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredIncidents.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No incidents match your filters</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Source IP</TableHead>
                          <TableHead>Dest IP</TableHead>
                          <TableHead>Protocol</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIncidents.map((incident) => (
                          <TableRow
                            key={incident.id}
                            className={selectedIncident?.id === incident.id ? 'bg-blue-50' : ''}
                          >
                            <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                            <TableCell className="text-xs">
                              {new Date(incident.time).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getSeverityColor(incident.severity) as any}>
                                {incident.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {incident.src_ip}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {incident.dst_ip}
                            </TableCell>
                            <TableCell>{incident.protocol}</TableCell>
                            <TableCell>{incident.service}</TableCell>
                            <TableCell>{incident.confidence.toFixed(1)}%</TableCell>
                            <TableCell className="text-xs">{incident.reason}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSelectIncident(incident)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedIncident && (
            <Card>
              <CardHeader>
                <CardTitle>Incident Details: {selectedIncident.id}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDetail ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : incidentDetail ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <span className="text-xs font-semibold text-slate-600">Time</span>
                        <p className="text-sm">
                          {new Date(selectedIncident.time).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-600">Severity</span>
                        <div className="mt-1">
                          <Badge variant={getSeverityColor(selectedIncident.severity) as any}>
                            {selectedIncident.severity}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-600">Confidence</span>
                        <p className="text-sm">{selectedIncident.confidence.toFixed(2)}%</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-600">Attack Type</span>
                        <p className="text-sm">{selectedIncident.reason}</p>
                      </div>
                    </div>

                    <Tabs defaultValue="request">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="request">
                          <FileText className="h-4 w-4 mr-2" />
                          Request
                        </TabsTrigger>
                        <TabsTrigger value="rationale">
                          <Brain className="h-4 w-4 mr-2" />
                          Rationale
                        </TabsTrigger>
                        <TabsTrigger value="playbook">
                          <Activity className="h-4 w-4 mr-2" />
                          Playbook
                        </TabsTrigger>
                        <TabsTrigger value="timeline">
                          <Clock className="h-4 w-4 mr-2" />
                          Timeline
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="request" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Request Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold">Method & Path</Label>
                              <p className="font-mono text-sm bg-slate-50 p-2 rounded">
                                {incidentDetail.request.method} {incidentDetail.request.path}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">Headers</Label>
                              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
                                {JSON.stringify(incidentDetail.request.headers, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">Body</Label>
                              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
                                {incidentDetail.request.body}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="rationale" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Model Rationale</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold">Reason</Label>
                              <p className="text-sm">{incidentDetail.rationale.reason}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">Key Features</Label>
                              <div className="space-y-2">
                                {incidentDetail.rationale.features.map((feature: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-slate-50 rounded">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm">{feature.name}</span>
                                      <Badge
                                        variant={
                                          feature.impact === 'High' ? 'destructive' : 'default'
                                        }
                                      >
                                        {feature.impact} Impact
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600">{feature.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="playbook" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Response Playbook</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold">Recommended Actions</Label>
                              <ul className="list-disc list-inside space-y-1">
                                {incidentDetail.playbook.recommended_actions.map(
                                  (action: string, idx: number) => (
                                    <li key={idx} className="text-sm">
                                      {action}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">Containment Steps</Label>
                              <ul className="list-disc list-inside space-y-1">
                                {incidentDetail.playbook.containment.map(
                                  (step: string, idx: number) => (
                                    <li key={idx} className="text-sm">
                                      {step}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">Investigation Steps</Label>
                              <ul className="list-disc list-inside space-y-1">
                                {incidentDetail.playbook.investigation.map(
                                  (step: string, idx: number) => (
                                    <li key={idx} className="text-sm">
                                      {step}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="timeline" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Event Timeline</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {incidentDetail.timeline.map((event: any, idx: number) => (
                                <div key={idx} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                                    {idx < incidentDetail.timeline.length - 1 && (
                                      <div className="w-0.5 h-full bg-slate-200 flex-1" />
                                    )}
                                  </div>
                                  <div className="flex-1 pb-4">
                                    <p className="text-xs text-slate-500">
                                      {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                    <p className="font-medium text-sm">{event.event}</p>
                                    <p className="text-sm text-slate-600">Actor: {event.actor}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <p className="text-center text-slate-600">No details available</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
