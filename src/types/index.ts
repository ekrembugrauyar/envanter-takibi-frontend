export interface DashboardStats {
  stats: {
    total: number;
    fieldActive: number;
    depot: number;
    testing: number;
    repair: number;
    scrap: number;
  };
  alertCount: number;
  recentActivities: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    createdAt: string;
  }>;
}

export interface SearchResults {
  modems: Array<{
    id: string;
    imei: string;
    model: string;
    brand: string;
    status: string;
  }>;
  workOrders: Array<{
    id: string;
    orderNumber: string;
    description: string;
    status: string;
  }>;
  simCards: Array<{
    id: string;
    iccid: string;
    phoneNumber: string;
    operator: string;
  }>;
}

export interface ModemFilters {
  status?: string;
  brand?: string;
  model?: string;
  locationId?: string;
  companyId?: string;
  search?: string;
}

export interface WorkOrderFilters {
  status?: string;
  priority?: string;
  assignedUserId?: string;
}

export interface TestSessionFilters {
  status?: string;
  modemId?: string;
  technicianId?: string;
}
