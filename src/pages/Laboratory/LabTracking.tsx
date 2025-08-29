import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FlaskConical, 
  Monitor, 
  Play, 
  Pause, 
  RotateCcw,
  Activity,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LabTracking() {
  const [selectedBench, setSelectedBench] = useState<string | null>(null);
  const [isBenchDetailsOpen, setIsBenchDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testSessions, isLoading } = useQuery({
    queryKey: ['/api/test-sessions'],
    refetchInterval: 5000, // Real-time updates
  });

  const { data: testScenarios } = useQuery({
    queryKey: ['/api/test-scenarios'],
  });

  const { data: modems } = useQuery({
    queryKey: ['/api/modems'],
  });

  // Define lab benches
  const labBenches = [
    { id: 'BENCH-01', name: 'Bench 01', row: 1, col: 1 },
    { id: 'BENCH-02', name: 'Bench 02', row: 1, col: 2 },
    { id: 'BENCH-03', name: 'Bench 03', row: 1, col: 3 },
    { id: 'BENCH-04', name: 'Bench 04', row: 1, col: 4 },
    { id: 'BENCH-05', name: 'Bench 05', row: 2, col: 1 },
    { id: 'BENCH-06', name: 'Bench 06', row: 2, col: 2 },
    { id: 'BENCH-07', name: 'Bench 07', row: 2, col: 3 },
    { id: 'BENCH-08', name: 'Bench 08', row: 2, col: 4 },
  ];

  const getBenchStatus = (benchId: string) => {
    const session = testSessions?.find((s: any) => s.benchNumber === benchId);
    if (!session) return { status: 'idle', session: null };
    
    return { status: session.status, session };
  };

  const getBenchStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-muted border-border';
      case 'queued':
        return 'bg-chart-3/20 border-chart-3';
      case 'running':
        return 'bg-chart-1/20 border-chart-1 animate-pulse';
      case 'completed':
        return 'bg-chart-2/20 border-chart-2';
      case 'failed':
        return 'bg-destructive/20 border-destructive';
      default:
        return 'bg-muted border-border';
    }
  };

  const getBenchIcon = (status: string) => {
    switch (status) {
      case 'idle':
        return <Monitor className="w-6 h-6 text-muted-foreground" />;
      case 'queued':
        return <Timer className="w-6 h-6 text-chart-3" />;
      case 'running':
        return <Activity className="w-6 h-6 text-chart-1" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-chart-2" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-destructive" />;
      default:
        return <Monitor className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      idle: { label: "Boş", color: "bg-muted text-muted-foreground" },
      queued: { label: "Kuyrukta", color: "bg-chart-3 text-white" },
      running: { label: "Çalışıyor", color: "bg-chart-1 text-white" },
      completed: { label: "Tamamlandı", color: "bg-chart-2 text-white" },
      failed: { label: "Başarısız", color: "bg-destructive text-white" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleBenchClick = (benchId: string) => {
    setSelectedBench(benchId);
    setIsBenchDetailsOpen(true);
  };

  // Calculate statistics
  const activeBenches = labBenches.filter(bench => {
    const { status } = getBenchStatus(bench.id);
    return status === 'running';
  }).length;

  const queuedTests = testSessions?.filter((s: any) => s.status === 'queued').length || 0;
  const completedToday = testSessions?.filter((s: any) => 
    s.status === 'completed' && 
    new Date(s.completedAt).toDateString() === new Date().toDateString()
  ).length || 0;

  const utilizationRate = Math.round((activeBenches / labBenches.length) * 100);

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Laboratuvar verisi yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="lab-tracking-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-8 w-8 text-chart-1" />
            <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
              Laboratuvar Takip Ekranı
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Lab panosu: sanal yerleşim, hangi bench'te hangi modem var
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-1 rounded-md flex items-center justify-center">
                    <Activity className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Aktif Bench
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {activeBenches} / {labBenches.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-3 rounded-md flex items-center justify-center">
                    <Timer className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Kuyrukta
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {queuedTests}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-2 rounded-md flex items-center justify-center">
                    <CheckCircle className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Bugün Tamamlanan
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {completedToday}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-4 rounded-md flex items-center justify-center">
                    <Monitor className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Kullanım Oranı
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      %{utilizationRate}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lab Layout */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FlaskConical className="mr-2 h-5 w-5" />
              Laboratuvar Yerleşimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-muted border border-border rounded"></div>
                  <span className="text-sm">Boş</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-chart-3/20 border border-chart-3 rounded"></div>
                  <span className="text-sm">Kuyrukta</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-chart-1/20 border border-chart-1 rounded"></div>
                  <span className="text-sm">Çalışıyor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-chart-2/20 border border-chart-2 rounded"></div>
                  <span className="text-sm">Tamamlandı</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-destructive/20 border border-destructive rounded"></div>
                  <span className="text-sm">Başarısız</span>
                </div>
              </div>

              {/* Bench Grid */}
              <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
                {labBenches.map((bench) => {
                  const { status, session } = getBenchStatus(bench.id);
                  const modem = session ? modems?.find((m: any) => m.id === session.modemId) : null;
                  
                  return (
                    <Card 
                      key={bench.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${getBenchStatusColor(status)}`}
                      onClick={() => handleBenchClick(bench.id)}
                      data-testid={`lab-bench-${bench.id}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          {getBenchIcon(status)}
                          <div className="font-medium text-sm">
                            {bench.name}
                          </div>
                          {getStatusBadge(status)}
                          {modem && (
                            <div className="text-xs text-muted-foreground font-mono">
                              {modem.imei.slice(-8)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Tests */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Aktif Test Oturumları</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!testSessions || testSessions.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Aktif test oturumu bulunmuyor
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>Bench</TableHead>
                    <TableHead>IMEI</TableHead>
                    <TableHead>Test Senaryosu</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Başlama</TableHead>
                    <TableHead>Süre</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testSessions
                    .filter((session: any) => session.benchNumber)
                    .map((session: any) => {
                      const modem = modems?.find((m: any) => m.id === session.modemId);
                      const scenario = testScenarios?.find((s: any) => s.id === session.scenarioId);
                      const duration = session.startedAt ? 
                        Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 60000) : 0;

                      return (
                        <TableRow key={session.id} data-testid={`lab-session-${session.id}`}>
                          <TableCell className="font-medium">
                            {session.benchNumber}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {modem?.imei || 'Bilinmiyor'}
                          </TableCell>
                          <TableCell>
                            {scenario?.name || 'Bilinmiyor'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(session.status)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {session.startedAt ? 
                              new Date(session.startedAt).toLocaleTimeString('tr-TR') : 
                              '-'
                            }
                          </TableCell>
                          <TableCell>
                            {session.status === 'running' && duration > 0 ? 
                              `${duration} dk` : 
                              '-'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {session.status === 'running' && (
                                <Button variant="ghost" size="sm" data-testid={`pause-session-${session.id}`}>
                                  <Pause className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" data-testid={`view-session-${session.id}`}>
                                <Monitor className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Bench Details Dialog */}
        <Dialog open={isBenchDetailsOpen} onOpenChange={setIsBenchDetailsOpen}>
          <DialogContent className="max-w-2xl" data-testid="bench-details-dialog">
            <DialogHeader>
              <DialogTitle>
                Bench Detayları - {selectedBench}
              </DialogTitle>
            </DialogHeader>
            {selectedBench && (
              <div className="space-y-4">
                {(() => {
                  const { status, session } = getBenchStatus(selectedBench);
                  const modem = session ? modems?.find((m: any) => m.id === session.modemId) : null;
                  const scenario = session ? testScenarios?.find((s: any) => s.id === session.scenarioId) : null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Bench ID</label>
                          <p className="font-medium">{selectedBench}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Durum</label>
                          <div className="mt-1">{getStatusBadge(status)}</div>
                        </div>
                      </div>
                      
                      {session ? (
                        <div className="p-4 bg-muted rounded-lg space-y-3">
                          <h4 className="font-medium">Aktif Test Oturumu</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">IMEI:</span>
                              <p className="font-mono">{modem?.imei || 'Bilinmiyor'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Test Senaryosu:</span>
                              <p>{scenario?.name || 'Bilinmiyor'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Başlama Zamanı:</span>
                              <p>{session.startedAt ? new Date(session.startedAt).toLocaleString('tr-TR') : 'Henüz başlamamış'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sonuç:</span>
                              <p>{session.result ? (session.result === 'pass' ? 'Başarılı' : 'Başarısız') : 'Devam ediyor'}</p>
                            </div>
                          </div>
                          
                          {session.logs && (
                            <div>
                              <span className="text-muted-foreground text-sm">Son Log:</span>
                              <div className="mt-1 p-2 bg-background rounded text-xs font-mono max-h-32 overflow-y-auto">
                                {JSON.stringify(session.logs, null, 2)}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
                          Bu bench şu anda boş
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
