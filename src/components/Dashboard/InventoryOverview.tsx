import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { type DashboardStats } from "@/types";

interface InventoryOverviewProps {
  stats: DashboardStats['stats'];
}

export default function InventoryOverview({ stats }: InventoryOverviewProps) {
  const breakdown = [
    { label: "Sahada", value: stats.fieldActive, color: "text-chart-2" },
    { label: "Depo", value: stats.depot, color: "text-chart-3" },
    { label: "Test", value: stats.testing, color: "text-chart-4" },
    { label: "Sorunlu", value: stats.repair, color: "text-destructive" }
  ];

  return (
    <Card className="lg:col-span-2 border-border" data-testid="inventory-overview">
      <CardHeader className="border-b border-border">
        <CardTitle>Envanter Durumu</CardTitle>
        <p className="text-sm text-muted-foreground">
          Modem dağılımı ve durum analizi
        </p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        {/* Chart placeholder */}
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <div className="text-center">
            <PieChart className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Envanter Dağılım Grafiği</p>
          </div>
        </div>
        
        {/* Status breakdown */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {breakdown.map((item, index) => (
            <div key={index} className="text-center" data-testid={`breakdown-${index}`}>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
