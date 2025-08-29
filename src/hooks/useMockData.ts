import { useState, useEffect } from "react";
import {
  mockCompanies,
  mockLocations,
  mockModems,
  mockSimCards,
  mockWorkOrders,
  mockTestScenarios,
  mockTestSessions,
  mockScrapRequests,
  mockAlerts,
  mockActivityLogs,
  mockStats,
  performMockSearch
} from "@/lib/mockData";

// Simulate loading delay
const simulateLoading = (data: any, delay = 300) => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(data);
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return { data: result, isLoading };
};

// Dashboard hooks
export const useDashboardStats = () => {
  return simulateLoading({
    stats: mockStats,
    alertCount: mockAlerts.filter(a => !a.isRead).length,
    recentActivities: mockActivityLogs.slice(0, 10)
  });
};


// Company hooks
export const useCompanies = () => {
  return simulateLoading(mockCompanies);
};

export const useCreateCompany = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating company", data);
      // In a real frontend-only app, you might save to localStorage
    },
    isPending: false
  };
};

// Location hooks
export const useLocations = () => {
  return simulateLoading(mockLocations);
};

export const useCreateLocation = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating location", data);
    },
    isPending: false
  };
};

// Modem hooks
export const useModems = (filters?: any) => {
  let filteredModems = mockModems;
  
  if (filters) {
    filteredModems = mockModems.filter(modem => {
      if (filters.status && modem.status !== filters.status) return false;
      if (filters.brand && modem.brand !== filters.brand) return false;
      if (filters.model && modem.model !== filters.model) return false;
      if (filters.locationId && modem.locationId !== filters.locationId) return false;
      if (filters.companyId && modem.companyId !== filters.companyId) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          modem.imei.toLowerCase().includes(searchTerm) ||
          modem.model.toLowerCase().includes(searchTerm) ||
          modem.brand.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }
  
  return simulateLoading(filteredModems);
};

export const useModem = (id: string) => {
  const modem = mockModems.find(m => m.id === id);
  return simulateLoading(modem);
};

export const useCreateModem = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating modem", data);
    },
    isPending: false
  };
};

export const useUpdateModem = () => {
  return {
    mutate: ({ id, data }: { id: string; data: any }) => {
      console.log("Mock: Updating modem", id, data);
    },
    isPending: false
  };
};

// SIM Card hooks
export const useSimCards = () => {
  return simulateLoading(mockSimCards);
};

export const useCreateSimCard = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating SIM card", data);
    },
    isPending: false
  };
};

// Work Order hooks
export const useWorkOrders = (filters?: any) => {
  let filteredOrders = mockWorkOrders;
  
  if (filters) {
    filteredOrders = mockWorkOrders.filter(order => {
      if (filters.status && order.status !== filters.status) return false;
      if (filters.priority && order.priority !== filters.priority) return false;
      if (filters.assignedUserId && order.assignedUserId !== filters.assignedUserId) return false;
      return true;
    });
  }
  
  return simulateLoading(filteredOrders);
};

export const useCreateWorkOrder = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating work order", data);
    },
    isPending: false
  };
};

export const useUpdateWorkOrder = () => {
  return {
    mutate: ({ id, data }: { id: string; data: any }) => {
      console.log("Mock: Updating work order", id, data);
    },
    isPending: false
  };
};

export const useSLAAlerts = () => {
  const slaAlerts = mockWorkOrders.filter(wo => 
    wo.status === 'in_progress' && 
    wo.slaDeadline && 
    new Date(wo.slaDeadline).getTime() - new Date().getTime() < 2 * 60 * 60 * 1000 // 2 hours
  );
  return simulateLoading(slaAlerts);
};

// Test hooks
export const useTestScenarios = () => {
  return simulateLoading(mockTestScenarios);
};

export const useCreateTestScenario = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating test scenario", data);
    },
    isPending: false
  };
};

export const useTestSessions = (filters?: any) => {
  let filteredSessions = mockTestSessions;
  
  if (filters) {
    filteredSessions = mockTestSessions.filter(session => {
      if (filters.status && session.status !== filters.status) return false;
      if (filters.modemId && session.modemId !== filters.modemId) return false;
      if (filters.technicianId && session.technicianId !== filters.technicianId) return false;
      return true;
    });
  }
  
  return simulateLoading(filteredSessions);
};

export const useCreateTestSession = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating test session", data);
    },
    isPending: false
  };
};

export const useUpdateTestSession = () => {
  return {
    mutate: ({ id, data }: { id: string; data: any }) => {
      console.log("Mock: Updating test session", id, data);
    },
    isPending: false
  };
};

// Scrap hooks
export const useScrapRequests = (filters?: any) => {
  let filteredRequests = mockScrapRequests;
  
  if (filters?.status) {
    filteredRequests = mockScrapRequests.filter(req => req.status === filters.status);
  }
  
  return simulateLoading(filteredRequests);
};

export const useCreateScrapRequest = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating scrap request", data);
    },
    isPending: false
  };
};

export const useUpdateScrapRequest = () => {
  return {
    mutate: ({ id, data }: { id: string; data: any }) => {
      console.log("Mock: Updating scrap request", id, data);
    },
    isPending: false
  };
};

// Alert hooks
export const useAlerts = () => {
  return simulateLoading(mockAlerts);
};

export const useCreateAlert = () => {
  return {
    mutate: (data: any) => {
      console.log("Mock: Creating alert", data);
    },
    isPending: false
  };
};

export const useMarkAlertAsRead = () => {
  return {
    mutate: (id: string) => {
      console.log("Mock: Marking alert as read", id);
    },
    isPending: false
  };
};

// Search hook
export const useGlobalSearch = (query: string) => {
  const results = query ? performMockSearch(query) : { modems: [], workOrders: [], simCards: [] };
  return simulateLoading(results);
};

// Export hook
export const useExportModems = () => {
  return {
    mutate: () => {
      console.log("Mock: Exporting modems to CSV");
      // In a real app, you might generate and download a CSV file
      const csvData = mockModems.map(m => 
        `${m.imei},${m.model},${m.brand},${m.status},${m.locationId || 'N/A'},${m.companyId || 'N/A'},${m.lastSeenAt?.toISOString() || 'Never'}`
      ).join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modems_export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    isPending: false
  };
};