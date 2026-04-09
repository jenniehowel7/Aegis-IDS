'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppShell } from '@/components/app-shell';
import { api } from '@/lib/api';
import { BatchResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, Download, Loader as Loader2, FileText, ChartBar as BarChart3, Database } from 'lucide-react';

export default function BatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const data = await api.batch.analyze(file);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleCsv = `src_ip,dst_ip,protocol,service,src_bytes,dst_bytes,duration
192.168.1.10,192.168.1.20,TCP,http,1024,2048,1.5
10.0.0.5,10.0.0.12,UDP,dns,512,256,0.2
172.16.0.10,172.16.0.20,TCP,https,2048,4096,2.1`;

    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_traffic.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Batch Analysis</h1>
            <p className="text-slate-600">Upload and analyze traffic data in bulk</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file">Traffic Data CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={!file || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Analyze
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={handleDownloadSample}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {result.total_records.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Analyzed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {result.threats_detected.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((result.threats_detected / result.total_records) * 100).toFixed(2)}% of traffic
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Normal Traffic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {result.normal_traffic.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((result.normal_traffic / result.total_records) * 100).toFixed(2)}% of traffic
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="predictions">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="predictions">
                        <FileText className="h-4 w-4 mr-2" />
                        Predictions
                      </TabsTrigger>
                      <TabsTrigger value="raw">
                        <Database className="h-4 w-4 mr-2" />
                        Raw Data Preview
                      </TabsTrigger>
                      <TabsTrigger value="insights">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Insights
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="predictions" className="space-y-4">
                      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Source IP</TableHead>
                              <TableHead>Destination IP</TableHead>
                              <TableHead>Protocol</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Confidence</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.predictions.map((pred) => (
                              <TableRow
                                key={pred.id}
                                className={selectedRecord?.id === pred.id ? 'bg-blue-50' : ''}
                              >
                                <TableCell>{pred.id}</TableCell>
                                <TableCell className="font-mono text-xs">{pred.src_ip}</TableCell>
                                <TableCell className="font-mono text-xs">{pred.dst_ip}</TableCell>
                                <TableCell>{pred.protocol}</TableCell>
                                <TableCell>{pred.service}</TableCell>
                                <TableCell>
                                  <Badge variant={pred.status === 'Attack' ? 'destructive' : 'default'}>
                                    {pred.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{pred.confidence.toFixed(1)}%</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedRecord(pred)}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {selectedRecord && (
                        <Card className="bg-slate-50">
                          <CardHeader>
                            <CardTitle className="text-lg">Record Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold">Record ID:</span> {selectedRecord.id}
                              </div>
                              <div>
                                <span className="font-semibold">Source IP:</span> {selectedRecord.src_ip}
                              </div>
                              <div>
                                <span className="font-semibold">Destination IP:</span> {selectedRecord.dst_ip}
                              </div>
                              <div>
                                <span className="font-semibold">Protocol:</span> {selectedRecord.protocol}
                              </div>
                              <div>
                                <span className="font-semibold">Service:</span> {selectedRecord.service}
                              </div>
                              <div>
                                <span className="font-semibold">Status:</span>{' '}
                                <Badge variant={selectedRecord.status === 'Attack' ? 'destructive' : 'default'}>
                                  {selectedRecord.status}
                                </Badge>
                              </div>
                              <div className="col-span-2">
                                <span className="font-semibold">Confidence:</span> {selectedRecord.confidence.toFixed(2)}%
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="raw">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {result.raw_data.length > 0 &&
                                Object.keys(result.raw_data[0]).map((key) => (
                                  <TableHead key={key}>{key}</TableHead>
                                ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.raw_data.map((row, idx) => (
                              <TableRow key={idx}>
                                {Object.values(row).map((value: any, vidx) => (
                                  <TableCell key={vidx} className="text-xs">
                                    {typeof value === 'number' ? value.toFixed(2) : value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Service Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={result.insights.service_breakdown}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="service" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
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
                                  data={result.insights.protocol_distribution}
                                  dataKey="count"
                                  nameKey="protocol"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  label
                                >
                                  {result.insights.protocol_distribution.map((entry, index) => (
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
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
