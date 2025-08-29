import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Package, 
  TestTube, 
  MapPin, 
  Clock, 
  CreditCard, 
  FlaskConical, 
  Trash2, 
  BarChart3 
} from "lucide-react";

export default function QuickAccessModules() {
  const modules = [
    { name: "Envanter", href: "/inventory", icon: Package, color: "text-chart-1" },
    { name: "Test", href: "/testing", icon: TestTube, color: "text-chart-2" },
    { name: "Saha", href: "/field", icon: MapPin, color: "text-chart-3" },
    { name: "SLA", href: "/sla", icon: Clock, color: "text-chart-4" },
    { name: "GSM", href: "/gsm", icon: CreditCard, color: "text-chart-5" },
    { name: "Lab", href: "/laboratory", icon: FlaskConical, color: "text-chart-1" },
    { name: "Hurda", href: "/scrap", icon: Trash2, color: "text-chart-2" },
    { name: "Rapor", href: "/reports", icon: BarChart3, color: "text-chart-3" },
  ];

  return (
    <Card className="border-border mb-8" data-testid="quick-access-modules">
      <CardHeader className="border-b border-border">
        <CardTitle>Hızlı Erişim</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ana modüllere kolay erişim
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {modules.map((module) => (
            <Link key={module.name} href={module.href}>
              <Button 
                variant="outline" 
                className="flex flex-col items-center p-4 h-auto space-y-2 hover:bg-accent hover:border-ring transition-colors"
                data-testid={`quick-access-${module.name.toLowerCase()}`}
              >
                <module.icon className={`w-6 h-6 ${module.color}`} />
                <span className="text-sm text-card-foreground">
                  {module.name}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
