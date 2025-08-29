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
import { Input } from "@/components/ui/input";
import { 
  Building, 
  Package, 
  FileDown, 
  Search,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const { user } = useAuth();

  // In a real implementation, we'd determine the company ID from the user
  const companyId = user?.role === 'company' ? 'company-1' : null;

  const { data: modems, isLoading } = useQuery({
    queryKey: ['/api/modems', { companyId }],
    enabled: !!companyId,
  });

  const { data: workOrders } = useQuery({
    queryKey: ['/api/work-orders'],
    enabled: !!companyId,
  });

  const { data: companies } = useQuery({
    queryKey: ['/api/companies'],
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      field_active: { label: "Sahada Aktif", color: "bg-chart-2 text-white" },
      field_inactive: { label: "Sahada Pasif", color: "bg-muted text-muted-foreground" },
      depot: { label: "Depoda", color: "bg-chart-3 text-white" },
      headquarters: { label: "Merkezde", color: "bg-chart-4 text-white" },
      testing: { label: "Test", color: "bg-chart-1 text-white" },
      repair: { label: "Tamirde", color: "bg-yellow-500 text-white" },
      scrap: { label: "Hurda", color: "bg-destructive text-white" },
      lost: { label: "Kayıp", color: "bg-destructive text-white" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.depot;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getWorkOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Bekliyor", color: "bg-muted text-muted-foreground", icon: Clock },
      in_progress: { label: "Devam Ediyor", color: "bg-chart-1 text-white", icon: AlertCircle },
      completed: { label: "Tamamlandı", color: "bg-chart-2 text-white", icon: CheckCircle },
      cancelled: { label: "İptal Edildi", color: "bg-destructive text-white", icon: AlertCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const companyModems = modems?.filter((modem: any) => modem.companyId === companyId) || [];
  const companyWorkOrders = workOrders?.filter((wo: any) => {
    const modem = modems?.find((m: any) => m.id === wo.modemId);
    return modem?.companyId === companyId;
  }) || [];

  const filteredModems = companyModems.filter((modem: any) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!modem.imei.toLowerCase().includes(search) && 
          !modem.model.toLowerCase().includes(search) &&
          !modem.brand.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    if (statusFilter && modem.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const activeModems = companyModems.filter((m: any) => m.status === 'field_active').length;
  const inactiveModems = companyModems.filter((m: any) => m.status === 'field_inactive').length;
  const depotModems = companyModems.filter((m: any) => m.status === 'depot').length;
  const pendingWorkOrders = companyWorkOrders.filter((wo: any) => wo.status === 'pending').length;

  const handleExport = () => {
    // In a real implementation, this would export only company's modems
    window.open(`/api/export/modems?companyId=${companyId}`, '_blank');
  };

  // Show access denied if user is not from a company
  if (!companyId || user?.role !== 'company') {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Erişim Reddedildi
            </h2>
            <p className="text-muted-foreground">
              Bu sayfaya erişim için firma hesabı gereklidir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Firma verisi yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="company-portal-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-chart-4" />
              <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
                Firma Portal
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Firma dashboard: kendi modem sayıları, aktif/pasif durum
            </p>
          </div>
          <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
            <Button variant="outline" onClick={handleExport} data-testid="export-company-data">
              <FileDown className="mr-2 h-4 w-4" />
              Rapor İndir
            </Button>
          </div>
        </div>

        {/* Company Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-1 rounded-md flex items-center justify-center">
                    <Package className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Toplam Modem
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {companyModems.length}
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
                      Aktif Sahada
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {activeModems}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                %{companyModems.length > 0 ? Math.round((activeModems / companyModems.length) * 100) : 0} aktif
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-3 rounded-md flex items-center justify-center">
                    <Package className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Depoda
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {depotModems}
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
                    <Clock className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Bekleyen İş Emri
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {pendingWorkOrders}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Work Orders */}
        {companyWorkOrders.length > 0 && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle>İş Emirleri</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>İş Emri No</TableHead>
                    <TableHead>IMEI</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Oluşturulma</TableHead>
                    <TableHead>SLA Süresi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyWorkOrders.slice(0, 5).map((workOrder: any) => {
                    const modem = modems?.find((m: any) => m.id === workOrder.modemId);
                    return (
                      <TableRow key={workOrder.id} data-testid={`company-work-order-${workOrder.id}`}>
                        <TableCell className="font-medium">
                          {workOrder.orderNumber}
                        </TableCell>
                        <TableCell className="font-mono">
                          {modem?.imei || 'Bilinmiyor'}
                        </TableCell>
                        <TableCell>
                          {workOrder.type === 'installation' ? 'Kurulum' :
                           workOrder.type === 'repair' ? 'Tamir' :
                           workOrder.type === 'replacement' ? 'Değiştirme' :
                           workOrder.type === 'removal' ? 'Kaldırma' : workOrder.type}
                        </TableCell>
                        <TableCell>
                          {getWorkOrderStatusBadge(workOrder.status)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(workOrder.createdAt).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(workOrder.slaDeadline).toLocaleDateString('tr-TR')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {companyWorkOrders.length > 5 && (
                <div className="p-4 text-center border-t border-border">
                  <Button variant="outline" size="sm">
                    Tümünü Görüntüle ({companyWorkOrders.length - 5} daha)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Modem Filtreleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="IMEI, Model, Marka ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="company-search-input"
                />
              </div>
              
              <Select onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)} value={statusFilter || 'all'}>
                <SelectTrigger data-testid="company-status-filter">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="field_active">Sahada Aktif</SelectItem>
                  <SelectItem value="field_inactive">Sahada Pasif</SelectItem>
                  <SelectItem value="depot">Depoda</SelectItem>
                  <SelectItem value="testing">Test</SelectItem>
                  <SelectItem value="repair">Tamirde</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Company Modems Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>
              Firma Envanteri ({filteredModems.length} adet)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredModems.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {companyModems.length === 0 ? 
                  "Henüz modem bulunmuyor" : 
                  "Filtrelere uygun modem bulunamadı"
                }
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>IMEI</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Görülme</TableHead>
                    <TableHead>Sinyal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModems.map((modem: any) => (
                    <TableRow key={modem.id} data-testid={`company-modem-${modem.id}`}>
                      <TableCell className="font-mono text-sm">
                        {modem.imei}
                      </TableCell>
                      <TableCell className="font-medium">
                        {modem.model}
                      </TableCell>
                      <TableCell>
                        {modem.brand}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(modem.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {modem.lastSeenAt ? 
                          new Date(modem.lastSeenAt).toLocaleDateString('tr-TR') : 
                          'Hiç'
                        }
                      </TableCell>
                      <TableCell>
                        {modem.lastSignalStrength ? (
                          <span className={`text-sm ${
                            modem.lastSignalStrength > -70 ? 'text-chart-2' :
                            modem.lastSignalStrength > -85 ? 'text-chart-3' : 'text-destructive'
                          }`}>
                            {modem.lastSignalStrength} dBm
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
