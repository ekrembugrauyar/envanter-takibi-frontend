// Real API Hooks - Backend bağlantısı için hazır yapı
// Bu dosya, gerçek backend API'lerine bağlanmak için kullanılabilir

import { useState, useEffect, useCallback } from 'react';
import { apiClient, API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/apiTemplate';
import { useToast } from '@/hooks/use-toast';

// Generic API hook for data fetching
export const useApiData = <T>(
  endpoint: string,
  params?: Record<string, any>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.get<T>(endpoint, params);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
        toast({
          title: "Error",
          description: response.error || 'Failed to fetch data',
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, params, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

// Generic API hook for mutations (POST, PUT, PATCH, DELETE)
export const useApiMutation = <T = any, R = any>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  onSuccess?: (data: R) => void,
  onError?: (error: string) => void
) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const mutate = useCallback(async (data?: T) => {
    try {
      setIsPending(true);
      setError(null);

      let response: ApiResponse<R>;
      
      switch (method) {
        case 'POST':
          response = await apiClient.post<R>(endpoint, data);
          break;
        case 'PUT':
          response = await apiClient.put<R>(endpoint, data);
          break;
        case 'PATCH':
          response = await apiClient.patch<R>(endpoint, data);
          break;
        case 'DELETE':
          response = await apiClient.delete<R>(endpoint);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      if (response.success && response.data) {
        toast({
          title: "Success",
          description: response.message || 'Operation completed successfully',
        });
        onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.error || 'Operation failed';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        onError?.(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [method, endpoint, onSuccess, onError, toast]);

  return { mutate, isPending, error };
};

// Specific API hooks for each entity

// Companies
export const useCompanies = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.COMPANIES.LIST, params);
};

export const useCreateCompany = () => {
  return useApiMutation('POST', API_ENDPOINTS.COMPANIES.CREATE);
};

export const useUpdateCompany = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.COMPANIES.UPDATE(id));
};

export const useDeleteCompany = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.COMPANIES.DELETE(id));
};

// Locations
export const useLocations = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.LOCATIONS.LIST, params);
};

export const useCreateLocation = () => {
  return useApiMutation('POST', API_ENDPOINTS.LOCATIONS.CREATE);
};

export const useUpdateLocation = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.LOCATIONS.UPDATE(id));
};

export const useDeleteLocation = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.LOCATIONS.DELETE(id));
};

// Modems
export const useModems = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.MODEMS.LIST, params);
};

export const useModem = (id: string) => {
  return useApiData(API_ENDPOINTS.MODEMS.GET(id), undefined, [id]);
};

export const useCreateModem = () => {
  return useApiMutation('POST', API_ENDPOINTS.MODEMS.CREATE);
};

export const useUpdateModem = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.MODEMS.UPDATE(id));
};

export const useDeleteModem = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.MODEMS.DELETE(id));
};

export const useSearchModems = (query: string) => {
  return useApiData(API_ENDPOINTS.MODEMS.SEARCH, { q: query }, [query]);
};

// SIM Cards
export const useSimCards = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.SIM_CARDS.LIST, params);
};

export const useCreateSimCard = () => {
  return useApiMutation('POST', API_ENDPOINTS.SIM_CARDS.CREATE);
};

export const useUpdateSimCard = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.SIM_CARDS.UPDATE(id));
};

export const useDeleteSimCard = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.SIM_CARDS.DELETE(id));
};

// Work Orders
export const useWorkOrders = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.WORK_ORDERS.LIST, params);
};

export const useCreateWorkOrder = () => {
  return useApiMutation('POST', API_ENDPOINTS.WORK_ORDERS.CREATE);
};

export const useUpdateWorkOrder = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.WORK_ORDERS.UPDATE(id));
};

export const useDeleteWorkOrder = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.WORK_ORDERS.DELETE(id));
};

export const useSLAAlerts = () => {
  return useApiData(API_ENDPOINTS.WORK_ORDERS.SLA_ALERTS);
};

// Test Scenarios
export const useTestScenarios = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.TEST_SCENARIOS.LIST, params);
};

export const useCreateTestScenario = () => {
  return useApiMutation('POST', API_ENDPOINTS.TEST_SCENARIOS.CREATE);
};

export const useUpdateTestScenario = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.TEST_SCENARIOS.UPDATE(id));
};

export const useDeleteTestScenario = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.TEST_SCENARIOS.DELETE(id));
};

// Test Sessions
export const useTestSessions = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.TEST_SESSIONS.LIST, params);
};

export const useCreateTestSession = () => {
  return useApiMutation('POST', API_ENDPOINTS.TEST_SESSIONS.CREATE);
};

export const useUpdateTestSession = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.TEST_SESSIONS.UPDATE(id));
};

export const useDeleteTestSession = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.TEST_SESSIONS.DELETE(id));
};

// Scrap Requests
export const useScrapRequests = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.SCRAP_REQUESTS.LIST, params);
};

export const useCreateScrapRequest = () => {
  return useApiMutation('POST', API_ENDPOINTS.SCRAP_REQUESTS.CREATE);
};

export const useUpdateScrapRequest = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.SCRAP_REQUESTS.UPDATE(id));
};

export const useDeleteScrapRequest = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.SCRAP_REQUESTS.DELETE(id));
};

// Alerts
export const useAlerts = (params?: Record<string, any>) => {
  return useApiData(API_ENDPOINTS.ALERTS.LIST, params);
};

export const useCreateAlert = () => {
  return useApiMutation('POST', API_ENDPOINTS.ALERTS.CREATE);
};

export const useUpdateAlert = (id: string) => {
  return useApiMutation('PUT', API_ENDPOINTS.ALERTS.UPDATE(id));
};

export const useDeleteAlert = (id: string) => {
  return useApiMutation('DELETE', API_ENDPOINTS.ALERTS.DELETE(id));
};

export const useMarkAlertAsRead = (id: string) => {
  return useApiMutation('PATCH', API_ENDPOINTS.ALERTS.MARK_READ(id));
};

// Dashboard
export const useDashboardStats = () => {
  return useApiData(API_ENDPOINTS.DASHBOARD.STATS);
};

export const useRecentActivities = () => {
  return useApiData(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
};

export const useDashboardAlerts = () => {
  return useApiData(API_ENDPOINTS.DASHBOARD.ALERTS);
};

// Search
export const useGlobalSearch = (query: string) => {
  return useApiData(API_ENDPOINTS.SEARCH.GLOBAL, { q: query }, [query]);
};

// Export functionality
export const useExportModems = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportData = useCallback(async () => {
    try {
      setIsExporting(true);
      
      const response = await apiClient.get(API_ENDPOINTS.MODEMS.EXPORT);
      
      if (response.success && response.data) {
        // Handle file download
        const blob = new Blob([JSON.stringify(response.data)], { 
          type: 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `modems_export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Export Successful",
          description: "Modem data exported successfully",
        });
      } else {
        throw new Error(response.error || 'Export failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      toast({
        title: "Export Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast]);

  return { exportData, isExporting };
};
