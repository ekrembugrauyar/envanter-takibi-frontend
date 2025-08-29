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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TestTube, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock,
  Monitor
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TestDashboard() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testSessions, isLoading } = useQuery({
    queryKey: ['/api/test-sessions'],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  const { data: testScenarios } = useQuery({
    queryKey: ['/api/test-scenarios'],
  });

  const { data: modems } = useQuery({
    queryKey: ['/api/modems'],
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest('PATCH', `/api/test-sessions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-sessions'] });
      toast({ title: "Başarılı", description: "Test oturumu güncellendi" });
    },
    onError: () => {
      toast({ 
        title: "Hata", 
        description: "Test oturumu güncellenemedi",
        variant: "destructive" 
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      queued: { label: "Kuyrukta", color: "bg-muted text-muted-foreground" },
      running: { label: "Çalışıyor", color: "bg-chart-1 text-white" },
      completed: { label: "Tamamlandı", color: "bg-chart-2 text-white" },
      failed: { label: "Başarısız", color: "bg-destructive text-white" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.queued;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getResultBadge = (result: string | null) => {
    if (!result) return null;
    
    return result === 'pass' ? (
      <Badge className="bg-chart-2 text-white">
        <CheckCircle className="w-3 h-3 mr-1" />
        Başarılı
      </Badge>
    ) : (
      <Badge className="bg-destructive text-white">
        <XCircle className="w-3 h-3 mr-1" />
        Başarısız
      </Badge>
    );
  };

  const handleStartTest = (sessionId: string) => {
    updateSessionMutation.mutate({
      id: sessionId,
      data: { 
        status: 'running',
        startedAt: new Date().toISOString()
      }
    });
  };

  const handleStopTest = (sessionId: string) => {
    updateSessionMutation.mutate({
      id: sessionId,
      data: { 
        status: 'completed',
        completedAt: new Date().toISOString(),
        result: 'pass' // This would be determined by actual test results
      }
    });
  };

  const handleViewLogs = (session: any) => {
    setSelectedSession(session);
    setIsLogsOpen(true);
  };

  const queuedSessions = testSessions?.filter((s: any) => s.status === 'queued') || [];
  const runningSessions = testSessions?.filter((s: any) => s.status === 'running') || [];
  const completedSessions = testSessions?.filter((s: any) => s.status === 'completed') || [];

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Test dashboard yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="test-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <TestTube className="h-8 w-8 text-chart-2" />
            <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
              Teknik Test Ajanı
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Lab dashboard: aktif testler, kuyruğa alınan modemler
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                    <Clock className="text-muted-foreground w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Kuyrukta
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {queuedSessions.length}
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
                  <div className="w-8 h-8 bg-chart-1 rounded-md flex items-center justify-center">
                    <Play className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Aktif Test
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {runningSessions.length}
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
                      Tamamlanan
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {completedSessions.length}
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
                      Başarı Oranı
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {completedSessions.length > 0 ? 
                        Math.round((completedSessions.filter((s: any) => s.result === 'pass').length / completedSessions.length) * 100) + '%' : 
                        '-%'
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Tests */}
        {runningSessions.length > 0 && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="mr-2 h-5 w-5 text-chart-1" />
                Aktif Testler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {runningSessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-chart-1 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium">
                          IMEI: {modems?.find((m: any) => m.id === session.modemId)?.imei || 'Bilinmiyor'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Bench: {session.benchNumber || 'Atanmamış'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewLogs(session)}
                        data-testid={`view-logs-${session.id}`}
                      >
                        <Monitor className="w-4 h-4 mr-1" />
                        Logları Görüntüle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStopTest(session.id)}
                        data-testid={`stop-test-${session.id}`}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Durdur
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Queue */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              Test Kuyruğu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {queuedSessions.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Test kuyruğu boş
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>IMEI</TableHead>
                    <TableHead>Test Senaryosu</TableHead>
                    <TableHead>Bench</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Oluşturulma</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queuedSessions.map((session: any) => (
                    <TableRow key={session.id} data-testid={`queued-session-${session.id}`}>
                      <TableCell className="font-mono">
                        {modems?.find((m: any) => m.id === session.modemId)?.imei || 'Bilinmiyor'}
                      </TableCell>
                      <TableCell>
                        {testScenarios?.find((s: any) => s.id === session.scenarioId)?.name || 'Bilinmiyor'}
                      </TableCell>
                      <TableCell>
                        {session.benchNumber || (
                          <Select onValueChange={(value) => updateSessionMutation.mutate({
                            id: session.id,
                            data: { benchNumber: value }
                          })}>
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Ata" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BENCH-01">BENCH-01</SelectItem>
                              <SelectItem value="BENCH-02">BENCH-02</SelectItem>
                              <SelectItem value="BENCH-03">BENCH-03</SelectItem>
                              <SelectItem value="BENCH-04">BENCH-04</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(session.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(session.createdAt).toLocaleString('tr-TR')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStartTest(session.id)}
                          disabled={!session.benchNumber}
                          data-testid={`start-test-${session.id}`}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Başlat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Son Test Sonuçları</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {completedSessions.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Henüz tamamlanmış test bulunmuyor
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>IMEI</TableHead>
                    <TableHead>Test Senaryosu</TableHead>
                    <TableHead>Sonuç</TableHead>
                    <TableHead>Süre</TableHead>
                    <TableHead>Tamamlanma</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedSessions.slice(0, 10).map((session: any) => (
                    <TableRow key={session.id} data-testid={`completed-session-${session.id}`}>
                      <TableCell className="font-mono">
                        {modems?.find((m: any) => m.id === session.modemId)?.imei || 'Bilinmiyor'}
                      </TableCell>
                      <TableCell>
                        {testScenarios?.find((s: any) => s.id === session.scenarioId)?.name || 'Bilinmiyor'}
                      </TableCell>
                      <TableCell>
                        {getResultBadge(session.result)}
                      </TableCell>
                      <TableCell>
                        {session.startedAt && session.completedAt ? (
                          Math.round((new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 1000 / 60) + ' dk'
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {session.completedAt ? new Date(session.completedAt).toLocaleString('tr-TR') : '-'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewLogs(session)}
                          data-testid={`view-result-logs-${session.id}`}
                        >
                          <Monitor className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Test Logs Dialog */}
        <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
          <DialogContent className="max-w-4xl" data-testid="test-logs-dialog">
            <DialogHeader>
              <DialogTitle>Test Logları</DialogTitle>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">IMEI:</span> {modems?.find((m: any) => m.id === selectedSession.modemId)?.imei}
                  </div>
                  <div>
                    <span className="font-medium">Durum:</span> {getStatusBadge(selectedSession.status)}
                  </div>
                  <div>
                    <span className="font-medium">Bench:</span> {selectedSession.benchNumber || 'Atanmamış'}
                  </div>
                  <div>
                    <span className="font-medium">Sonuç:</span> {getResultBadge(selectedSession.result) || 'Henüz sonuç yok'}
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  {selectedSession.logs ? (
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(selectedSession.logs, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      Henüz log kaydı bulunmuyor
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
