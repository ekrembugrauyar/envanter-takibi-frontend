import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Router, 
  Radio, 
  Warehouse, 
  AlertTriangle 
} from "lucide-react";
import { type DashboardStats } from "@/types";

interface StatisticsCardsProps {
  stats: DashboardStats['stats'];
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      title: "Toplam Modem",
      value: stats.total.toLocaleString(),
      icon: Router,
      bgColor: "bg-chart-1",
      change: "+12",
      changeLabel: "son 24 saatte",
      changeColor: "text-chart-2"
    },
    {
      title: "Sahada Aktif",
      value: stats.fieldActive.toLocaleString(),
      icon: Radio,
      bgColor: "bg-chart-2",
      change: "96.8%",
      changeLabel: "çevrimiçi",
      changeColor: "text-chart-2"
    },
    {
      title: "Depoda",
      value: stats.depot.toLocaleString(),
      icon: Warehouse,
      bgColor: "bg-chart-3",
      change: "Merkez:",
      changeLabel: "234",
      changeColor: "text-card-foreground"
    },
    {
      title: "SLA Uyarıları",
      value: "23", // This would come from alerts
      icon: AlertTriangle,
      bgColor: "bg-destructive",
      change: "8",
      changeLabel: "kritik",
      changeColor: "text-destructive"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden border border-border" data-testid={`stat-card-${index}`}>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${card.bgColor} rounded-md flex items-center justify-center`}>
                  <card.icon className="text-white w-4 h-4" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    {card.title}
                  </dt>
                  <dd className="text-lg font-medium text-card-foreground">
                    {card.value}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-muted px-5 py-3">
            <div className="text-sm">
              <span className={`font-medium ${card.changeColor}`}>
                {card.change}
              </span>
              <span className="text-muted-foreground ml-1">
                {card.changeLabel}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
