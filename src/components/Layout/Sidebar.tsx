import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Satellite, 
  Package, 
  TestTube, 
  Clock, 
  MapPin, 
  Building, 
  CreditCard, 
  Trash2, 
  FlaskConical, 
  BarChart3, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Envanter Takibi", href: "/inventory", icon: Package },
  { name: "Teknik Test", href: "/testing", icon: TestTube },
  { name: "SLA Takibi", href: "/sla", icon: Clock },
  { name: "Saha Takibi", href: "/field", icon: MapPin },
  { name: "Firma Portal", href: "/company", icon: Building },
  { name: "GSM Envanter", href: "/gsm", icon: CreditCard },
  { name: "Hurda Takibi", href: "/scrap", icon: Trash2 },
  { name: "Laboratuvar", href: "/laboratory", icon: FlaskConical },
];

const secondaryNavigation = [
  { name: "Raporlar", href: "/reports", icon: BarChart3 },
  { name: "Ayarlar", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Satellite className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-lg font-semibold text-card-foreground">TelecomIMS</h1>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              data-testid={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border">
                  {secondaryNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              data-testid={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
        </div>
      </nav>
    </div>
  );
}
