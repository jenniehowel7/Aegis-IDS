'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppShell } from '@/components/app-shell';
import { api } from '@/lib/api';
import { LivePacket } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, Trash2 } from 'lucide-react';

export default function LivePage() {
  const [packets, setPackets] = useState<LivePacket[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(2000);
  const [selectedPacket, setSelectedPacket] = useState<LivePacket | null>(null);
  const [trendData, setTrendData] = useState<Array<{ time: string; normal: number; attack: number }>>([]);
  const intervalRef = useRef<number | null>(null);

  const fetchPackets = useCallback(async () => {
    try {
      const newPackets = await api.live.getStream();
      setPackets(prev => {
        const combined = [...newPackets, ...prev].slice(0, 120);
        return combined;
      });

      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const normalCount = newPackets.filter(p => p.status === 'Normal').length;
      const attackCount = newPackets.filter(p => p.status === 'Attack').length;

      setTrendData(prev => {
        const updated = [...prev, { time: timeStr, normal: normalCount, attack: attackCount }];
        return updated.slice(-20);
      });
    } catch (err) {
      console.error('Failed to fetch packets:', err);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      fetchPackets();
      intervalRef.current = window.setInterval(fetchPackets, refreshInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, refreshInterval, fetchPackets]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleClear = () => {
    setPackets([]);
    setTrendData([]);
    setSelectedPacket(null);
  };

  const attackRate = packets.length > 0
    ? (packets.filter(p => p.status === 'Attack').length / packets.length) * 100
    : 0;

  const latestConfidence = packets.length > 0 ? packets[0].confidence : 0;
  const avgLatency = packets.length > 0
    ? packets.reduce((sum, p) => sum + p.latency, 0) / packets.length
    : 0;

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Live Stream</h1>
              <p className="text-slate-600">Real-time traffic monitoring</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleStart}
                disabled={isRunning}
                variant={isRunning ? 'secondary' : 'default'}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button onClick={handlePause} disabled={!isRunning} variant="secondary">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={handleClear} variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Refresh Interval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Slider
                  value={[refreshInterval]}
                  onValueChange={([value]) => setRefreshInterval(value)}
                  min={500}
                  max={5000}
                  step={500}
                  className="flex-1"
                  disabled={isRunning}
                />
                <span className="text-sm font-medium w-24">
                  {refreshInterval}ms
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attack Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {attackRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {packets.filter(p => p.status === 'Attack').length} of {packets.length} packets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Latest Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {latestConfidence.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Detection accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {avgLatency.toFixed(1)}ms
                </div>
                <p className="text-xs text-muted-foreground">Processing time</p>
              </CardContent>
            </Card>
          </div>

          {trendData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Traffic Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="normal" stroke="#10b981" name="Normal" />
                    <Line type="monotone" dataKey="attack" stroke="#ef4444" name="Attack" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Live Packets ({packets.length}/120)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Src IP</TableHead>
                      <TableHead>Dst IP</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Src Bytes</TableHead>
                      <TableHead>Dst Bytes</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Latency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packets.map((packet) => (
                      <TableRow
                        key={packet.id}
                        className={selectedPacket?.id === packet.id ? 'bg-blue-50' : ''}
                      >
                        <TableCell className="font-mono text-xs">{packet.time}</TableCell>
                        <TableCell className="font-mono text-xs">{packet.src_ip}</TableCell>
                        <TableCell className="font-mono text-xs">{packet.dst_ip}</TableCell>
                        <TableCell>{packet.port}</TableCell>
                        <TableCell>{packet.protocol}</TableCell>
                        <TableCell>{packet.service}</TableCell>
                        <TableCell>{packet.src_bytes}</TableCell>
                        <TableCell>{packet.dst_bytes}</TableCell>
                        <TableCell>{packet.duration.toFixed(2)}s</TableCell>
                        <TableCell>{packet.latency.toFixed(1)}ms</TableCell>
                        <TableCell>
                          <Badge variant={packet.status === 'Attack' ? 'destructive' : 'default'}>
                            {packet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{packet.confidence.toFixed(1)}%</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedPacket(packet)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedPacket && (
                <Card className="mt-4 bg-slate-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Packet Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Packet ID:</span> {selectedPacket.id}
                      </div>
                      <div>
                        <span className="font-semibold">Time:</span> {selectedPacket.time}
                      </div>
                      <div>
                        <span className="font-semibold">Source IP:</span> {selectedPacket.src_ip}
                      </div>
                      <div>
                        <span className="font-semibold">Destination IP:</span> {selectedPacket.dst_ip}
                      </div>
                      <div>
                        <span className="font-semibold">Port:</span> {selectedPacket.port}
                      </div>
                      <div>
                        <span className="font-semibold">Protocol:</span> {selectedPacket.protocol}
                      </div>
                      <div>
                        <span className="font-semibold">Service:</span> {selectedPacket.service}
                      </div>
                      <div>
                        <span className="font-semibold">Source Bytes:</span> {selectedPacket.src_bytes}
                      </div>
                      <div>
                        <span className="font-semibold">Destination Bytes:</span> {selectedPacket.dst_bytes}
                      </div>
                      <div>
                        <span className="font-semibold">Duration:</span> {selectedPacket.duration.toFixed(2)}s
                      </div>
                      <div>
                        <span className="font-semibold">Latency:</span> {selectedPacket.latency.toFixed(1)}ms
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>{' '}
                        <Badge variant={selectedPacket.status === 'Attack' ? 'destructive' : 'default'}>
                          {selectedPacket.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Confidence:</span> {selectedPacket.confidence.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
