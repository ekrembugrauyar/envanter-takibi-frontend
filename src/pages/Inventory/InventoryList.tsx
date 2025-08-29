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
  Plus, 
  Filter, 
  Download, 
  Search, 
  Edit, 
  Eye,
  MapPin,
  Package
} from "lucide-react";
import { type ModemFilters } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function InventoryList() {
  const [filters, setFilters] = useState<ModemFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModem, setSelectedModem] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modems, isLoading } = useQuery({
    queryKey: ['/api/modems', filters],
  });

  const { data: locations } = useQuery({
    queryKey: ['/api/locations'],
  });

  const { data: companies } = useQuery({
    queryKey: ['/api/companies'],
  });

  const updateModemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest('PATCH', `/api/modems/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modems'] });
      toast({ title: "Başarılı", description: "Modem bilgileri güncellendi" });
    },
    onError: () => {
      toast({ 
        title: "Hata", 
        description: "Modem güncellenemedi",
        variant: "destructive" 
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      field_active: { label: "Sahada Aktif", variant: "default" as const, color: "bg-chart-2 text-white" },
      field_inactive: { label: "Sahada Pasif", variant: "secondary" as const, color: "bg-muted text-muted-foreground" },
      depot: { label: "Depoda", variant: "outline" as const, color: "bg-chart-3 text-white" },
      headquarters: { label: "Merkezde", variant: "outline" as const, color: "bg-chart-4 text-white" },
      testing: { label: "Test", variant: "outline" as const, color: "bg-chart-1 text-white" },
      repair: { label: "Tamirde", variant: "destructive" as const, color: "bg-yellow-500 text-white" },
      scrap: { label: "Hurda", variant: "destructive" as const, color: "bg-destructive text-white" },
      lost: { label: "Kayıp", variant: "destructive" as const, color: "bg-destructive text-white" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.depot;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleStatusChange = (modemId: string, newStatus: string) => {
    updateModemMutation.mutate({
      id: modemId,
      data: { status: newStatus }
    });
  };

  const handleViewDetails = (modem: any) => {
    setSelectedModem(modem);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    window.open('/api/export/modems', '_blank');
  };

  const filteredModems = modems?.filter((modem: any) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return modem.imei.toLowerCase().includes(search) ||
             modem.model.toLowerCase().includes(search) ||
             modem.brand.toLowerCase().includes(search);
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Modem listesi yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="inventory-list-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-chart-1" />
              <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
                Envanter Takibi
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Modem listesi: IMEI, model, durum, lokasyon detayları
            </p>
          </div>
          <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
            <Button variant="outline" onClick={handleExport} data-testid="export-button">
              <Download className="mr-2 h-4 w-4" />
              Dışa Aktar
            </Button>
            <Button data-testid="add-modem-button">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Modem
            </Button>
          </div>
        </div>

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
                  placeholder="IMEI, Model, Marka ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
              
              <Select onValueChange={(value) => setFilters({...filters, status: value === 'all' ? '' : value})}>
                <SelectTrigger data-testid="status-filter">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="field_active">Sahada Aktif</SelectItem>
                  <SelectItem value="depot">Depoda</SelectItem>
                  <SelectItem value="testing">Test</SelectItem>
                  <SelectItem value="repair">Tamirde</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({...filters, brand: value === 'all' ? '' : value})}>
                <SelectTrigger data-testid="brand-filter">
                  <SelectValue placeholder="Marka" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Markalar</SelectItem>
                  <SelectItem value="Huawei">Huawei</SelectItem>
                  <SelectItem value="ZTE">ZTE</SelectItem>
                  <SelectItem value="Quectel">Quectel</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({...filters, locationId: value === 'all' ? '' : value})}>
                <SelectTrigger data-testid="location-filter">
                  <SelectValue placeholder="Lokasyon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Lokasyonlar</SelectItem>
                  {locations?.map((location: any) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => setFilters({})}>
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modem Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>
              Modem Listesi ({filteredModems.length} adet)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>IMEI</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Marka</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Lokasyon</TableHead>
                  <TableHead>Son Görülme</TableHead>
                  <TableHead>Sinyal</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Hiç modem bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModems.map((modem: any) => (
                    <TableRow key={modem.id} data-testid={`modem-row-${modem.id}`}>
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
                        <Select 
                          value={modem.status} 
                          onValueChange={(value) => handleStatusChange(modem.id, value)}
                        >
                          <SelectTrigger className="w-auto border-none p-0 h-auto">
                            {getStatusBadge(modem.status)}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="field_active">Sahada Aktif</SelectItem>
                            <SelectItem value="field_inactive">Sahada Pasif</SelectItem>
                            <SelectItem value="depot">Depoda</SelectItem>
                            <SelectItem value="headquarters">Merkezde</SelectItem>
                            <SelectItem value="testing">Test</SelectItem>
                            <SelectItem value="repair">Tamirde</SelectItem>
                            <SelectItem value="scrap">Hurda</SelectItem>
                            <SelectItem value="lost">Kayıp</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {locations?.find((l: any) => l.id === modem.locationId)?.name || 'Bilinmiyor'}
                          </span>
                        </div>
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
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(modem)}
                            data-testid={`view-details-${modem.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`edit-modem-${modem.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modem Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl" data-testid="modem-details-dialog">
            <DialogHeader>
              <DialogTitle>Modem Detayları</DialogTitle>
            </DialogHeader>
            {selectedModem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IMEI</label>
                    <p className="font-mono">{selectedModem.imei}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Model</label>
                    <p>{selectedModem.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Marka</label>
                    <p>{selectedModem.brand}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Durum</label>
                    <div className="mt-1">{getStatusBadge(selectedModem.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Firmware</label>
                    <p>{selectedModem.firmwareVersion || 'Bilinmiyor'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Son Sinyal Gücü</label>
                    <p>{selectedModem.lastSignalStrength ? `${selectedModem.lastSignalStrength} dBm` : 'Bilinmiyor'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Batarya Seviyesi</label>
                    <p>{selectedModem.batteryLevel ? `%${selectedModem.batteryLevel}` : 'Bilinmiyor'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tamir Sayısı</label>
                    <p>{selectedModem.repairCount || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Garanti Bitiş</label>
                    <p>{selectedModem.warrantyEndDate ? 
                        new Date(selectedModem.warrantyEndDate).toLocaleDateString('tr-TR') : 
                        'Bilinmiyor'
                      }</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notlar</label>
                    <p className="text-sm">{selectedModem.notes || 'Not bulunmuyor'}</p>
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
