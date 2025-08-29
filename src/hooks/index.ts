// Hooks index - Tüm hook'ları tek yerden export et

// Data mode hooks
export { useDataMode, getDefaultDataMode, getModeIndicatorText, getModeIndicatorColor, getModeIndicatorBgColor } from './useDataMode';
export type { DataMode } from './useDataMode';

// Mock data hooks (demo mode)
export {
  useDashboardStats,
  useCompanies,
  useCreateCompany,
  useLocations,
  useCreateLocation,
  useModems,
  useModem,
  useCreateModem,
  useUpdateModem,
  useSimCards,
  useCreateSimCard,
  useWorkOrders,
  useCreateWorkOrder,
  useUpdateWorkOrder,
  useSLAAlerts,
  useTestScenarios,
  useCreateTestScenario,
  useTestSessions,
  useCreateTestSession,
  useUpdateTestSession,
  useScrapRequests,
  useCreateScrapRequest,
  useUpdateScrapRequest,
  useAlerts,
  useCreateAlert,
  useMarkAlertAsRead,
  useGlobalSearch,
  useExportModems
} from './useMockData';

// Real API hooks (production mode)
export {
  useApiData,
  useApiMutation,
  useCompanies as useApiCompanies,
  useCreateCompany as useApiCreateCompany,
  useUpdateCompany as useApiUpdateCompany,
  useDeleteCompany as useApiDeleteCompany,
  useLocations as useApiLocations,
  useCreateLocation as useApiCreateLocation,
  useUpdateLocation as useApiUpdateLocation,
  useDeleteLocation as useApiDeleteLocation,
  useModems as useApiModems,
  useModem as useApiModem,
  useCreateModem as useApiCreateModem,
  useUpdateModem as useApiUpdateModem,
  useDeleteModem as useApiDeleteModem,
  useSearchModems as useApiSearchModems,
  useSimCards as useApiSimCards,
  useCreateSimCard as useApiCreateSimCard,
  useUpdateSimCard as useApiUpdateSimCard,
  useDeleteSimCard as useApiDeleteSimCard,
  useWorkOrders as useApiWorkOrders,
  useCreateWorkOrder as useApiCreateWorkOrder,
  useUpdateWorkOrder as useApiUpdateWorkOrder,
  useDeleteWorkOrder as useApiDeleteWorkOrder,
  useSLAAlerts as useApiSLAAlerts,
  useTestScenarios as useApiTestScenarios,
  useCreateTestScenario as useApiCreateTestScenario,
  useUpdateTestScenario as useApiUpdateTestScenario,
  useDeleteTestScenario as useApiDeleteTestScenario,
  useTestSessions as useApiTestSessions,
  useCreateTestSession as useApiCreateTestSession,
  useUpdateTestSession as useApiUpdateTestSession,
  useDeleteTestSession as useApiDeleteTestSession,
  useScrapRequests as useApiScrapRequests,
  useCreateScrapRequest as useApiCreateScrapRequest,
  useUpdateScrapRequest as useApiUpdateScrapRequest,
  useDeleteScrapRequest as useApiDeleteScrapRequest,
  useAlerts as useApiAlerts,
  useCreateAlert as useApiCreateAlert,
  useUpdateAlert as useApiUpdateAlert,
  useDeleteAlert as useApiDeleteAlert,
  useMarkAlertAsRead as useApiMarkAlertAsRead,
  useDashboardStats as useApiDashboardStats,
  useRecentActivities as useApiRecentActivities,
  useDashboardAlerts as useApiDashboardAlerts,
  useGlobalSearch as useApiGlobalSearch,
  useExportModems as useApiExportModems
} from './useApi';

// Utility hooks
export { useMobile } from './use-mobile';
export { useToast } from './use-toast';
export { useAuth } from './useAuth';

// Conditional hook selector
export const useConditionalHook = <T>(
  mockHook: () => T,
  apiHook: () => T,
  mode: 'mock' | 'api' = 'mock'
): T => {
  return mode === 'mock' ? mockHook() : apiHook();
};

// Smart hook that automatically selects based on data mode
export const useSmartHook = <T>(
  mockHook: () => T,
  apiHook: () => T
): T => {
  const { mode } = useDataMode();
  return useConditionalHook(mockHook, apiHook, mode);
};
