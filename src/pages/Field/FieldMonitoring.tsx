import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Radio, 
  Battery, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Signal
} from "lucide-react";

export default function FieldMonitoring() {
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: modems, isLoading } = useQuery({
    queryKey: ['/api/modems', { status: 'field_active' }],
    refetchInterval: 30000, // Real-time updates every 30 seconds
  });

  const { data: locations } = useQuery({
    queryKey: ['/api/locations'],
  });

  const getSignalStrengthIndicator = (signalStrength: number | null) => {
    if (!signalStrength) {
      return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
    
    if (signalStrength > -70) {
      return <Signal className="h-4 w-4 text-chart-2" />;
    } else if (signalStrength > -85) {
      return <Signal className="h-4 w-4 text-chart-3" />;
    } else {
      return <Signal className="h-4 w-4 text-destructive" />;
    }
  };

  const getBatteryIndicator = (batteryLevel: number | null) => {
    if (!batteryLevel) {
      return <Battery className="h-4 w-4 text-muted-foreground" />;
    }
    
    if (batteryLevel > 70) {
      return <Battery className="h-4 w-4 text-chart-2" />;
    } else if (batteryLevel > 30) {
      return <Battery className="h-4 w-4 text-chart-3" />;
    } else {
      return <Battery className="h-4 w-4 text-destructive" />;
    }
  };

  const getOnlineStatus = (isOnline: boolean, lastSeenAt: string | null) => {
    if (isOnline) {
      return <Badge className="bg-chart-2 text-white">Çevrimiçi</Badge>;
    } else {
      const lastSeen = lastSeenAt ? new Date(lastSeenAt) : null;
      const now = new Date();
      const hoursSinceLastSeen = lastSeen ? 
        Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60)) : null;
      
      if (!hoursSinceLastSeen || hoursSinceLastSeen > 24) {
        return <Badge className="bg-destructive text-white">Çevrimdışı</Badge>;
      } else {
        return <Badge className="bg-chart-3 text-white">Geçici Kesinti</Badge>;
      }
    }
  };

  const fieldModems = modems?.filter((modem: any) => 
    modem.status === 'field_active' || modem.status === 'field_inactive'
  ) || [];

  const onlineModems = fieldModems.filter((modem: any) => modem.isOnline);
  const offlineModems = fieldModems.filter((modem: any) => !modem.isOnline);
  const lowBatteryModems = fieldModems.filter((modem: any) => 
    modem.batteryLevel && modem.batteryLevel < 30
  );
  const weakSignalModems = fieldModems.filter((modem: any) => 
    modem.lastSignalStrength && modem.lastSignalStrength < -85
  );

  const filteredModems = fieldModems.filter((modem: any) => {
    if (regionFilter) {
      const location = locations?.find((l: any) => l.id === modem.locationId);
      if (!location || !location.name.toLowerCase().includes(regionFilter.toLowerCase())) {
        return false;
      }
    }
    
    if (statusFilter === 'online' && !modem.isOnline) return false;
    if (statusFilter === 'offline' && modem.isOnline) return false;
    if (statusFilter === 'low_battery' && (!modem.batteryLevel || modem.batteryLevel >= 30)) return false;
    if (statusFilter === 'weak_signal' && (!modem.lastSignalStrength || modem.lastSignalStrength >= -85)) return false;
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Saha verisi yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="field-monitoring-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-chart-3" />
            <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
              Saha Takip Ajanı
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Harita görünümü: modemlerin online/offline, sinyal, enerji durumu
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                      Çevrimiçi
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {onlineModems.length}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                %{fieldModems.length > 0 ? Math.round((onlineModems.length / fieldModems.length) * 100) : 0} çevrimiçi oranı
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-destructive rounded-md flex items-center justify-center">
                    <XCircle className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Çevrimdışı
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {offlineModems.length}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Müdahale gerekli
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-3 rounded-md flex items-center justify-center">
                    <Battery className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Düşük Batarya
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {lowBatteryModems.length}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {'<30% batarya seviyesi'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-1 rounded-md flex items-center justify-center">
                    <Signal className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Zayıf Sinyal
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {weakSignalModems.length}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {'<-85 dBm seviyesi'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {(offlineModems.length > 0 || lowBatteryModems.length > 0 || weakSignalModems.length > 0) && (
          <Card className="mb-8 border-border border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Kritik Uyarılar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {offlineModems.slice(0, 3).map((modem: any) => (
                  <div key={modem.id} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <div>
                        <div className="font-medium">Çevrimdışı Cihaz</div>
                        <div className="text-sm text-muted-foreground">
                          IMEI: {modem.imei}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {modem.lastSeenAt ? 
                        `Son görülme: ${new Date(modem.lastSeenAt).toLocaleString('tr-TR')}` : 
                        'Hiç görülmedi'
                      }
                    </div>
                  </div>
                ))}
                
                {lowBatteryModems.slice(0, 2).map((modem: any) => (
                  <div key={modem.id} className="flex items-center justify-between p-3 bg-chart-3/10 border border-chart-3/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Battery className="h-4 w-4 text-chart-3" />
                      <div>
                        <div className="font-medium">Düşük Batarya</div>
                        <div className="text-sm text-muted-foreground">
                          IMEI: {modem.imei}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-chart-3 font-medium">
                      %{modem.batteryLevel}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Placeholder */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Harita Görünümü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-96 bg-muted rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  İnteraktif Harita
                </h3>
                <p className="text-muted-foreground mb-4">
                  Saha cihazlarının konumları ve durumları
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                    <span>Çevrimiçi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span>Çevrimdışı</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                    <span>Düşük Batarya</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select onValueChange={(value) => setRegionFilter(value === 'all' ? '' : value)} value={regionFilter || 'all'}>
                <SelectTrigger data-testid="region-filter">
                  <SelectValue placeholder="Bölge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Bölgeler</SelectItem>
                  <SelectItem value="istanbul">İstanbul</SelectItem>
                  <SelectItem value="ankara">Ankara</SelectItem>
                  <SelectItem value="izmir">İzmir</SelectItem>
                  <SelectItem value="bursa">Bursa</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)} value={statusFilter || 'all'}>
                <SelectTrigger data-testid="status-filter">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="online">Çevrimiçi</SelectItem>
                  <SelectItem value="offline">Çevrimdışı</SelectItem>
                  <SelectItem value="low_battery">Düşük Batarya</SelectItem>
                  <SelectItem value="weak_signal">Zayıf Sinyal</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setRegionFilter("");
                  setStatusFilter("");
                }}
              >
                Filtreleri Temizle
              </Button>

              <Button variant="outline" data-testid="refresh-data">
                <Radio className="w-4 h-4 mr-2" />
                Verileri Yenile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Device List */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>
              Saha Cihazları ({filteredModems.length} adet)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModems.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Filtrelere uygun cihaz bulunamadı
                </div>
              ) : (
                filteredModems.map((modem: any) => (
                  <Card key={modem.id} className="border-border" data-testid={`field-device-${modem.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-mono text-sm font-medium">
                          {modem.imei}
                        </div>
                        {getOnlineStatus(modem.isOnline, modem.lastSeenAt)}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span>{modem.brand} {modem.model}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Lokasyon:</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{locations?.find((l: any) => l.id === modem.locationId)?.name || 'Bilinmiyor'}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Sinyal:</span>
                          <div className="flex items-center space-x-2">
                            {getSignalStrengthIndicator(modem.lastSignalStrength)}
                            <span>{modem.lastSignalStrength ? `${modem.lastSignalStrength} dBm` : 'Bilinmiyor'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Batarya:</span>
                          <div className="flex items-center space-x-2">
                            {getBatteryIndicator(modem.batteryLevel)}
                            <span>{modem.batteryLevel ? `%${modem.batteryLevel}` : 'Bilinmiyor'}</span>
                          </div>
                        </div>
                        
                        {modem.lastSeenAt && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Son Görülme:</span>
                            <span>{new Date(modem.lastSeenAt).toLocaleString('tr-TR')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
