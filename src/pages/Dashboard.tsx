import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import StatisticsCards from "@/components/Dashboard/StatisticsCards";
import InventoryOverview from "@/components/Dashboard/InventoryOverview";
import RecentAlerts from "@/components/Dashboard/RecentAlerts";
import QuickAccessModules from "@/components/Dashboard/QuickAccessModules";
import RecentActivityTable from "@/components/Dashboard/RecentActivityTable";
import { useDashboardStats, useExportModems } from "@/hooks/useMockData";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useDashboardStats();
  const exportMutation = useExportModems();

  const handleExport = () => {
    exportMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Dashboard yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }


  const stats = dashboardData?.stats || {
    total: 0,
    fieldActive: 0,
    depot: 0,
    testing: 0,
    repair: 0,
    scrap: 0
  };

  return (
    <div className="py-6" data-testid="dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl sm:truncate">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sistem geneli envanter ve operasyon durumu
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={handleExport} data-testid="export-report-button">
              <Download className="mr-2 h-4 w-4" />
              Rapor İndir
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards stats={stats} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <InventoryOverview stats={stats} />
          <RecentAlerts />
        </div>

        {/* Quick Access Modules */}
        <QuickAccessModules />

        {/* Recent Activity Table */}
        <RecentActivityTable />
      </div>
    </div>
  );
}
