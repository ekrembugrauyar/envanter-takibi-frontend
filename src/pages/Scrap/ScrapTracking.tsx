import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Trash2, 
  Plus, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  TrendingDown
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ScrapTracking() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'rejected' | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scrapRequests, isLoading } = useQuery({
    queryKey: ['/api/scrap-requests', { status: statusFilter }],
  });

  const { data: modems } = useQuery({
    queryKey: ['/api/modems'],
  });

  const reviewRequestMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest('PATCH', `/api/scrap-requests/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scrap-requests'] });
      toast({ title: "Başarılı", description: "Hurda talebi güncellendi" });
      setIsReviewOpen(false);
      setSelectedRequest(null);
      setReviewNotes("");
      setReviewDecision(null);
    },
    onError: () => {
      toast({ 
        title: "Hata", 
        description: "Hurda talebi güncellenemedi",
        variant: "destructive" 
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        label: "Bekliyor", 
        color: "bg-chart-3 text-white",
        icon: Clock 
      },
      approved: { 
        label: "Onaylandı", 
        color: "bg-chart-2 text-white",
        icon: CheckCircle 
      },
      rejected: { 
        label: "Reddedildi", 
        color: "bg-destructive text-white",
        icon: XCircle 
      },
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

  const handleReview = (request: any) => {
    setSelectedRequest(request);
    setIsReviewOpen(true);
  };

  const handleSubmitReview = () => {
    if (!reviewDecision || !selectedRequest) return;
    
    reviewRequestMutation.mutate({
      id: selectedRequest.id,
      data: {
        status: reviewDecision,
        reviewNotes: reviewNotes,
      }
    });
  };

  const filteredRequests = scrapRequests || [];
  
  // Calculate statistics
  const pendingRequests = scrapRequests?.filter((r: any) => r.status === 'pending').length || 0;
  const approvedRequests = scrapRequests?.filter((r: any) => r.status === 'approved').length || 0;
  const rejectedRequests = scrapRequests?.filter((r: any) => r.status === 'rejected').length || 0;
  const totalRequests = scrapRequests?.length || 0;

  // Group by reason
  const reasonStats = scrapRequests?.reduce((acc: any, request: any) => {
    const key = request.reason.toLowerCase().includes('kırık') ? 'Fiziksel Hasar' :
                request.reason.toLowerCase().includes('çalışmı') ? 'Arızalı' :
                request.reason.toLowerCase().includes('eski') ? 'Eskimiş' : 'Diğer';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}) || {};

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Hurda takibi yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" data-testid="scrap-tracking-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <Trash2 className="h-8 w-8 text-chart-2" />
            <h1 className="text-2xl font-bold leading-7 text-card-foreground sm:text-3xl">
              Hurda Takibi
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Hurda aday listesi: neden, tarih, öneren kişi
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-chart-3 rounded-md flex items-center justify-center">
                    <Clock className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Bekleyen Talepler
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {pendingRequests}
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
                      Onaylanan
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {approvedRequests}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                %{totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0} onay oranı
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
                      Reddedilen
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {rejectedRequests}
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
                  <div className="w-8 h-8 bg-chart-1 rounded-md flex items-center justify-center">
                    <TrendingDown className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Toplam Talep
                    </dt>
                    <dd className="text-lg font-medium text-card-foreground">
                      {totalRequests}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reason Statistics */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Hurda Sebepleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(reasonStats).map(([reason, count]) => (
                <div key={reason} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-card-foreground">
                    {count as number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reason}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals Alert */}
        {pendingRequests > 0 && (
          <Card className="mb-8 border-border border-chart-3/20">
            <CardHeader>
              <CardTitle className="flex items-center text-chart-3">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Onay Bekleyen Talepler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                {pendingRequests} adet hurda talebi onay bekliyor
              </div>
              <Button 
                onClick={() => setStatusFilter('pending')}
                data-testid="view-pending-requests"
              >
                Bekleyen Talepleri Görüntüle
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)} value={statusFilter || 'all'}>
                <SelectTrigger data-testid="scrap-status-filter">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Bekliyor</SelectItem>
                  <SelectItem value="approved">Onaylandı</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => setStatusFilter("all")}>
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scrap Requests Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>
              Hurda Talepleri ({filteredRequests.length} adet)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Hurda talebi bulunamadı
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>IMEI</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Sebep</TableHead>
                    <TableHead>Öneren</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request: any) => {
                    const modem = modems?.find((m: any) => m.id === request.modemId);
                    return (
                      <TableRow key={request.id} data-testid={`scrap-request-${request.id}`}>
                        <TableCell className="font-mono text-sm">
                          {modem?.imei || 'Bilinmiyor'}
                        </TableCell>
                        <TableCell>
                          {modem ? `${modem.brand} ${modem.model}` : 'Bilinmiyor'}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          Kullanıcı
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {request.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReview(request)}
                                data-testid={`review-request-${request.id}`}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                İncele
                              </Button>
                            )}
                            {request.reviewNotes && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                title={request.reviewNotes}
                                data-testid={`view-notes-${request.id}`}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-2xl" data-testid="scrap-review-dialog">
            <DialogHeader>
              <DialogTitle>Hurda Talebi İnceleme</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                {/* Request Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IMEI</label>
                    <p className="font-mono">{modems?.find((m: any) => m.id === selectedRequest.modemId)?.imei}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Model</label>
                    <p>{modems?.find((m: any) => m.id === selectedRequest.modemId)?.brand} {modems?.find((m: any) => m.id === selectedRequest.modemId)?.model}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Hurda Sebebi</label>
                    <p className="mt-1">{selectedRequest.reason}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Talep Tarihi</label>
                    <p>{new Date(selectedRequest.createdAt).toLocaleString('tr-TR')}</p>
                  </div>
                </div>

                {/* Review Decision */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Karar
                    </label>
                    <div className="flex space-x-4">
                      <Button
                        variant={reviewDecision === 'approved' ? 'default' : 'outline'}
                        onClick={() => setReviewDecision('approved')}
                        className={reviewDecision === 'approved' ? 'bg-chart-2 text-white' : ''}
                        data-testid="approve-request"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Onayla
                      </Button>
                      <Button
                        variant={reviewDecision === 'rejected' ? 'default' : 'outline'}
                        onClick={() => setReviewDecision('rejected')}
                        className={reviewDecision === 'rejected' ? 'bg-destructive text-white' : ''}
                        data-testid="reject-request"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reddet
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      İnceleme Notları
                    </label>
                    <Textarea
                      placeholder="Karar gerekçenizi yazın..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="min-h-[100px]"
                      data-testid="review-notes-input"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsReviewOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={!reviewDecision || reviewRequestMutation.isPending}
                    data-testid="submit-review"
                  >
                    {reviewRequestMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
