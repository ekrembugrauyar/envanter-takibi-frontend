import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Timer
} from "lucide-react";

export default function SLADashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const { data: workOrders, isLoading } = useQuery({
    queryKey: ['/api/work-orders', { status: statusFilter, priority: priorityFilter }],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: slaAlerts } = useQuery({
    queryKey: ['/api/work-orders/sla-alerts'],
    refetchInterval: 10000, // Refresh every 10 seconds for SLA alerts
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Bekliyor", color: "bg-muted text-muted-foreground" },
      in_progress: { label: "Devam Ediyor", color: "bg-chart-1 text-white" },
      completed: { label: "Tamamlandı", color: "bg-chart-2 text-white" },
      cancelled: { label: "İptal Edildi", color: "bg-destructive text-white" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Düşük", color: "bg-chart-4 text-white" },
      normal: { label: "Normal", color: "bg-chart-1 text-white" },
      high: { label: "Yüksek", color: "bg-chart-3 text-white" },
      critical: { label: "Kritik", color: "bg-destructive text-white" },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const calculateTimeRemaining = (slaDeadline: string) => {
    const now = new Date();
    const deadline = new Date(slaDeadline);
    const diffMs = deadline.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return { text: "Süre Doldu", isOverdue: true };
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 2) {
      return { text: `${diffHours}s ${diffMinutes}dk`, isUrgent: true };
    }
    
    if (diffHours < 24) {
      return { text: `${diffHours} saat`, isWarning: diffHours < 4 };
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return { text: `${diffDays} gün`, isWarning: false };
  };

  const calculateResolutionTime = (createdAt: string, completedAt?: string) => {
    const start = new Date(createdAt);
    const end = completedAt ? new Date(completedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} saat`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün`;
  };

  const activeOrders = workOrders?.filter((wo: any) => wo.status !== 'completed' && wo.status !== 'cancelled') || [];
  const completedOrders = workOrders?.filter((wo: any) => wo.status === 'completed') || [];
  const overdueOrders = activeOrders.filter((wo: any) => new Date(wo.slaDeadline) < new Date());

  const avgResolutionTime = completedOrders.length > 0 ? 
    Math.round(completedOrders.reduce((acc: number, wo: any) => {
      const diffMs = new Date(wo.completedAt).getTime() - new Date(wo.createdAt).getTime();
      return acc + (diffMs / (1000 * 60 * 60));
    }, 0) / completedOrders.length) : 0;

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">SLA dashboard yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="sla-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-chart-4" />
            <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
              SLA Takibi
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard: ortalama çözüm süresi, SLA ihlalleri
          </p>
        </div>

        {/* SLA Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-1 rounded-md flex items-center justify-center">
                    <Timer className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Ortalama Çözüm
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {avgResolutionTime}h
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
                  <div className="w-8 h-8 bg-destructive rounded-md flex items-center justify-center">
                    <AlertTriangle className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      SLA İhlalleri
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {overdueOrders.length}
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
                    <Calendar className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Aktif İş Emirleri
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {activeOrders.length}
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
                      Başarı Oranı
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {workOrders?.length > 0 ? 
                        Math.round((completedOrders.length / workOrders.length) * 100) + '%' : 
                        '-%'
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SLA Alerts */}
        {slaAlerts && slaAlerts.length > 0 && (
          <Card className="mb-8 border-border border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Kritik SLA Uyarıları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slaAlerts.map((alert: any) => {
                  const timeInfo = calculateTimeRemaining(alert.slaDeadline);
                  return (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <div>
                          <div className="font-medium">
                            İş Emri: {alert.orderNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {alert.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          timeInfo.isOverdue ? 'text-destructive' : 
                          timeInfo.isUrgent ? 'text-yellow-600' : 'text-card-foreground'
                        }`}>
                          {timeInfo.text}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          kalan süre
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)} value={statusFilter || 'all'}>
                <SelectTrigger data-testid="status-filter">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Bekliyor</SelectItem>
                  <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="cancelled">İptal Edildi</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setPriorityFilter(value === 'all' ? '' : value)} value={priorityFilter || 'all'}>
                <SelectTrigger data-testid="priority-filter">
                  <SelectValue placeholder="Öncelik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öncelikler</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="critical">Kritik</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setStatusFilter("");
                  setPriorityFilter("");
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Work Orders Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>İş Emri Listesi</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!workOrders || workOrders.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                İş emri bulunamadı
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>İş Emri No</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>SLA Süresi</TableHead>
                    <TableHead>Kalan Süre</TableHead>
                    <TableHead>Çözüm Süresi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((workOrder: any) => {
                    const timeInfo = calculateTimeRemaining(workOrder.slaDeadline);
                    return (
                      <TableRow key={workOrder.id} data-testid={`work-order-${workOrder.id}`}>
                        <TableCell className="font-medium">
                          {workOrder.orderNumber}
                        </TableCell>
                        <TableCell>
                          {workOrder.type === 'installation' ? 'Kurulum' :
                           workOrder.type === 'repair' ? 'Tamir' :
                           workOrder.type === 'replacement' ? 'Değiştirme' :
                           workOrder.type === 'removal' ? 'Kaldırma' : workOrder.type}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(workOrder.priority)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(workOrder.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(workOrder.slaDeadline).toLocaleString('tr-TR')}
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${
                            timeInfo.isOverdue ? 'text-destructive' : 
                            timeInfo.isUrgent ? 'text-yellow-600' : 
                            timeInfo.isWarning ? 'text-chart-3' : 'text-chart-2'
                          }`}>
                            {timeInfo.text}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {calculateResolutionTime(workOrder.createdAt, workOrder.completedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
