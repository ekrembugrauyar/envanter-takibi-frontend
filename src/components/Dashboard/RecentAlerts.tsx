import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Signal, Battery, CheckCircle } from "lucide-react";
import { useAlerts } from "@/hooks/useMockData";

export default function RecentAlerts() {
  const { data: alerts, isLoading } = useAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'sla_warning':
        return AlertTriangle;
      case 'device_offline':
        return Signal;
      case 'low_battery':
        return Battery;
      case 'test_completed':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-chart-1';
      default:
        return 'bg-chart-1';
    }
  };

  const recentAlerts = alerts?.slice(0, 4) || [];

  return (
    <Card className="border-border" data-testid="recent-alerts">
      <CardHeader className="border-b border-border">
        <CardTitle>Son Uyarılar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Kritik bildirimler
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : recentAlerts.length === 0 ? (
          <div className="px-4 py-6 text-sm text-muted-foreground text-center">
            Aktif uyarı bulunmuyor
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentAlerts.map((alert: any) => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <div key={alert.id} className="px-4 py-4" data-testid={`alert-${alert.id}`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 ${getAlertColor(alert.severity)} rounded-full flex items-center justify-center`}>
                        <IconComponent className="text-white w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {alert.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    {!alert.isRead && (
                      <Badge variant="destructive" className="text-xs">
                        Yeni
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="bg-muted px-4 py-4">
          <div className="text-sm">
            <a 
              href="#" 
              className="font-medium text-primary hover:text-primary/80"
              data-testid="view-all-alerts"
            >
              Tümünü görüntüle
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
