import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Download } from "lucide-react";
import { useDashboardStats } from "@/hooks/useMockData";

export default function RecentActivityTable() {
  const { data: dashboardData, isLoading } = useDashboardStats();

  const getActivityBadgeColor = (action: string) => {
    switch (action) {
      case 'create_modem':
      case 'update_modem':
        return 'bg-chart-2 text-white';
      case 'create_work_order':
      case 'update_work_order':
        return 'bg-chart-4 text-white';
      case 'create_scrap_request':
        return 'bg-chart-3 text-white';
      case 'sla_violation':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getActivityLabel = (action: string) => {
    switch (action) {
      case 'create_modem':
        return 'Modem Eklendi';
      case 'update_modem':
        return 'Modem Güncellendi';
      case 'create_work_order':
        return 'İş Emri Oluşturuldu';
      case 'update_work_order':
        return 'İş Emri Güncellendi';
      case 'create_scrap_request':
        return 'Hurda Talebi';
      case 'sla_violation':
        return 'SLA İhlali';
      default:
        return action;
    }
  };

  const activities = (dashboardData as any)?.recentActivities || [];

  return (
    <Card className="border-border" data-testid="recent-activity-table">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Son Aktiviteler</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sistem geneli son işlemler
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" data-testid="filter-activities">
              <Filter className="w-4 h-4 mr-1" />
              Filtrele
            </Button>
            <Button variant="outline" size="sm" data-testid="export-activities">
              <Download className="w-4 h-4 mr-1" />
              Dışa Aktar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Henüz aktivite bulunmuyor
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>İşlem</TableHead>
                  <TableHead>IMEI/No</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Zaman</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity: any) => (
                  <TableRow key={activity.id} data-testid={`activity-${activity.id}`}>
                    <TableCell className="font-medium">
                      {getActivityLabel(activity.action)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.entityId.slice(0, 15)}...
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Sistem
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getActivityBadgeColor(activity.action)}`}
                        data-testid={`activity-status-${activity.id}`}
                      >
                        Tamamlandı
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString('tr-TR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="bg-muted px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Son 24 saatte {activities.length} işlem gerçekleştirildi
                </div>
                <div className="text-sm">
                  <a 
                    href="#" 
                    className="font-medium text-primary hover:text-primary/80"
                    data-testid="view-all-activities"
                  >
                    Tümünü görüntüle
                    <span aria-hidden="true"> →</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
