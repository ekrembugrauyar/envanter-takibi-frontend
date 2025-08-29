import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  CreditCard, 
  Plus, 
  Filter, 
  Download, 
  Search, 
  Edit, 
  Eye,
  Smartphone,
  Database,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GSMInventory() {
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSim, setSelectedSim] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: simCards, isLoading } = useQuery({
    queryKey: ['/api/sim-cards'],
    refetchInterval: 30000,
  });

  const { data: modems } = useQuery({
    queryKey: ['/api/modems'],
  });

  const updateSimMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest('PATCH', `/api/sim-cards/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sim-cards'] });
      toast({ title: "Başarılı", description: "SIM kart bilgileri güncellendi" });
    },
    onError: () => {
      toast({ 
        title: "Hata", 
        description: "SIM kart güncellenemedi",
        variant: "destructive" 
      });
    },
  });

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-chart-2 text-white">Aktif</Badge>
    ) : (
      <Badge className="bg-muted text-muted-foreground">Pasif</Badge>
    );
  };

  const getBillingStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Aktif", color: "bg-chart-2 text-white" },
      suspended: { label: "Askıda", color: "bg-chart-3 text-white" },
      cancelled: { label: "İptal", color: "bg-destructive text-white" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getDataUsagePercentage = (used: number, allowance: number) => {
    if (!allowance) return 0;
    return Math.round((used / allowance) * 100);
  };

  const handleViewDetails = (sim: any) => {
    setSelectedSim(sim);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    // In a real implementation, this would be a proper export endpoint
    toast({ title: "Bilgi", description: "SIM kart raporu indiriliyor..." });
  };

  const filteredSims = simCards?.filter((sim: any) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return sim.iccid.toLowerCase().includes(search) ||
             (sim.phoneNumber && sim.phoneNumber.toLowerCase().includes(search)) ||
             sim.operator.toLowerCase().includes(search);
    }
    return true;
  }) || [];

  // Calculate statistics
  const totalSims = simCards?.length || 0;
  const activeSims = simCards?.filter((s: any) => s.isActive).length || 0;
  const assignedSims = simCards?.filter((s: any) => s.modemId).length || 0;
  const poolSims = simCards?.filter((s: any) => s.poolId && !s.modemId).length || 0;

  // Group by operator
  const operatorStats = simCards?.reduce((acc: any, sim: any) => {
    acc[sim.operator] = (acc[sim.operator] || 0) + 1;
    return acc;
  }, {}) || {};

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">GSM envanter yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="gsm-inventory-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-chart-5" />
              <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
                GSM Envanter Takibi
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Hat listesi: ICCID, numara, modem, operatör
            </p>
          </div>
          <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
            <Button variant="outline" onClick={handleExport} data-testid="export-gsm-button">
              <Download className="mr-2 h-4 w-4" />
              Dışa Aktar
            </Button>
            <Button data-testid="add-sim-button">
              <Plus className="mr-2 h-4 w-4" />
              Yeni SIM Kart
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-1 rounded-md flex items-center justify-center">
                    <CreditCard className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Toplam SIM
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {totalSims.toLocaleString()}
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
                    <Smartphone className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Aktif Hatlar
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {activeSims.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                %{totalSims > 0 ? Math.round((activeSims / totalSims) * 100) : 0} aktif oran
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-3 rounded-md flex items-center justify-center">
                    <Database className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      OIP Havuzunda
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {poolSims.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Serbest hatlar
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-4 rounded-md flex items-center justify-center">
                    <TrendingUp className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Eşleştirilmiş
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {assignedSims.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Modem ile eşli
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operator Breakdown */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle>Operatör Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(operatorStats).map(([operator, count]) => (
                <div key={operator} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-card-foreground">
                    {count as number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {operator}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ICCID, Numara, Operatör ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="gsm-search-input"
                />
              </div>
              
              <Select onValueChange={(value) => setFilters({...filters, operator: value === 'all' ? '' : value})}>
                <SelectTrigger data-testid="operator-filter">
                  <SelectValue placeholder="Operatör" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Operatörler</SelectItem>
                  <SelectItem value="Turkcell">Turkcell</SelectItem>
                  <SelectItem value="Vodafone">Vodafone</SelectItem>
                  <SelectItem value="Türk Telekom">Türk Telekom</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({...filters, status: value === 'all' ? '' : value})}>
                <SelectTrigger data-testid="sim-status-filter">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="assigned">Eşleştirilmiş</SelectItem>
                  <SelectItem value="pool">Havuzda</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({...filters, billing: value === 'all' ? '' : value})}>
                <SelectTrigger data-testid="billing-filter">
                  <SelectValue placeholder="Faturalama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Faturalama</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="suspended">Askıda</SelectItem>
                  <SelectItem value="cancelled">İptal</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {setFilters({}); setSearchTerm("");}}>
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SIM Cards Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>
              SIM Kart Listesi ({filteredSims.length} adet)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>ICCID</TableHead>
                  <TableHead>Telefon No</TableHead>
                  <TableHead>Operatör</TableHead>
                  <TableHead>Modem</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Faturalama</TableHead>
                  <TableHead>Veri Kullanımı</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Hiç SIM kart bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSims.map((sim: any) => {
                    const modem = modems?.find((m: any) => m.id === sim.modemId);
                    const usagePercentage = getDataUsagePercentage(sim.dataUsed || 0, sim.dataAllowance || 0);
                    
                    return (
                      <TableRow key={sim.id} data-testid={`sim-row-${sim.id}`}>
                        <TableCell className="font-mono text-sm">
                          {sim.iccid}
                        </TableCell>
                        <TableCell>
                          {sim.phoneNumber || 'Atanmamış'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              sim.operator === 'Turkcell' ? 'bg-yellow-500' :
                              sim.operator === 'Vodafone' ? 'bg-red-500' :
                              sim.operator === 'Türk Telekom' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}></div>
                            <span>{sim.operator}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {modem ? (
                            <span className="font-mono text-sm">{modem.imei}</span>
                          ) : sim.poolId ? (
                            <Badge variant="outline">Pool: {sim.poolId}</Badge>
                          ) : (
                            <span className="text-muted-foreground">Atanmamış</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sim.isActive)}
                        </TableCell>
                        <TableCell>
                          {getBillingStatusBadge(sim.billingStatus)}
                        </TableCell>
                        <TableCell>
                          {sim.dataAllowance ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{(sim.dataUsed || 0).toLocaleString()} MB</span>
                                <span className={usagePercentage > 90 ? 'text-destructive' : 'text-muted-foreground'}>
                                  {usagePercentage}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    usagePercentage > 90 ? 'bg-destructive' :
                                    usagePercentage > 70 ? 'bg-chart-3' : 'bg-chart-2'
                                  }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Limit yok</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(sim)}
                              data-testid={`view-sim-details-${sim.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              data-testid={`edit-sim-${sim.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* SIM Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl" data-testid="sim-details-dialog">
            <DialogHeader>
              <DialogTitle>SIM Kart Detayları</DialogTitle>
            </DialogHeader>
            {selectedSim && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ICCID</label>
                    <p className="font-mono">{selectedSim.iccid}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefon Numarası</label>
                    <p>{selectedSim.phoneNumber || 'Atanmamış'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Operatör</label>
                    <p>{selectedSim.operator}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Durum</label>
                    <div className="mt-1">{getStatusBadge(selectedSim.isActive)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Faturalama Durumu</label>
                    <div className="mt-1">{getBillingStatusBadge(selectedSim.billingStatus)}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Eşleştirilmiş Modem</label>
                    <p>{modems?.find((m: any) => m.id === selectedSim.modemId)?.imei || 'Atanmamış'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">OIP Havuz ID</label>
                    <p>{selectedSim.poolId || 'Atanmamış'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Veri Limiti</label>
                    <p>{selectedSim.dataAllowance ? `${selectedSim.dataAllowance.toLocaleString()} MB` : 'Sınırsız'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Kullanılan Veri</label>
                    <p>{(selectedSim.dataUsed || 0).toLocaleString()} MB</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bölge Kodu</label>
                    <p>{selectedSim.regionCode || 'Belirtilmemiş'}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
