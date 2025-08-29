// Mock data for frontend-only mode
export const mockUser = {
  id: "user-1",
  email: "admin@telecomims.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  profileImageUrl: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const mockCompanies = [
  {
    id: "comp-1",
    name: "Turkcell Teknoloji",
    contactEmail: "iletisim@turkcell.com.tr",
    contactPhone: "+90 212 313 1313",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: "comp-2", 
    name: "Vodafone Türkiye",
    contactEmail: "destek@vodafone.com.tr",
    contactPhone: "+90 544 540 5405",
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: "comp-3",
    name: "Türk Telekom",
    contactEmail: "info@turktelekom.com.tr", 
    contactPhone: "+90 444 1 444",
    isActive: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
];

export const mockLocations = [
  {
    id: "loc-1",
    name: "İstanbul Merkez Depo",
    type: "depot",
    address: "Maslak Mahallesi, Büyükdere Caddesi No: 123, Şişli/İstanbul",
    coordinates: "41.1079,29.0233",
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: "loc-2",
    name: "Ankara Saha Ofisi",
    type: "field",
    address: "Çankaya Mahallesi, Atatürk Bulvarı No: 45, Çankaya/Ankara",
    coordinates: "39.9208,32.8541",
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: "loc-3",
    name: "İzmir Depo",
    type: "depot",
    address: "Alsancak Mahallesi, Kordon Boyu No: 67, Konak/İzmir",
    coordinates: "38.4237,27.1428",
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: "loc-4",
    name: "Test Laboratuvarı",
    type: "headquarters",
    address: "Teknokent Kampüsü, ODTÜ, Çankaya/Ankara",
    coordinates: "39.8917,32.7814",
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

export const mockModems = [
  {
    id: "modem-1",
    imei: "352094087654321",
    model: "Huawei B535-232",
    brand: "Huawei",
    status: "field_active",
    locationId: "loc-1",
    companyId: "comp-1",
    warrantyEndDate: new Date('2025-06-15'),
    repairCount: 0,
    lastSignalStrength: -75,
    batteryLevel: 85,
    firmwareVersion: "11.189.63.00.00",
    isOnline: true,
    lastSeenAt: new Date('2024-08-29T10:30:00'),
    notes: "Saha kurulumu tamamlandı",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-29')
  },
  {
    id: "modem-2", 
    imei: "352094087654322",
    model: "ZTE MF286R",
    brand: "ZTE",
    status: "depot",
    locationId: "loc-2",
    companyId: "comp-2",
    warrantyEndDate: new Date('2024-12-20'),
    repairCount: 1,
    lastSignalStrength: null,
    batteryLevel: null,
    firmwareVersion: "B08",
    isOnline: false,
    lastSeenAt: new Date('2024-08-25T14:20:00'),
    notes: "Depo beklemede",
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-08-25')
  },
  {
    id: "modem-3",
    imei: "352094087654323", 
    model: "Nokia FastMile 5G21",
    brand: "Nokia",
    status: "testing",
    locationId: "loc-4",
    companyId: "comp-1",
    warrantyEndDate: new Date('2026-03-10'),
    repairCount: 0,
    lastSignalStrength: -68,
    batteryLevel: 92,
    firmwareVersion: "3FGPP01.01.01.00",
    isOnline: true,
    lastSeenAt: new Date('2024-08-29T11:15:00'),
    notes: "5G performans testi devam ediyor",
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-08-29')
  },
  {
    id: "modem-4",
    imei: "352094087654324",
    model: "Ericsson Router 6000",
    brand: "Ericsson", 
    status: "repair",
    locationId: "loc-4",
    companyId: "comp-3",
    warrantyEndDate: new Date('2025-01-30'),
    repairCount: 2,
    lastSignalStrength: null,
    batteryLevel: null,
    firmwareVersion: "22.1.R1A",
    isOnline: false,
    lastSeenAt: new Date('2024-08-20T09:45:00'),
    notes: "Güç kaynağı arızası tespit edildi",
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-08-20')
  },
  {
    id: "modem-5",
    imei: "352094087654325",
    model: "Huawei B525s-23a",
    brand: "Huawei",
    status: "field_active",
    locationId: "loc-2",
    companyId: "comp-2",
    warrantyEndDate: new Date('2025-09-15'),
    repairCount: 0,
    lastSignalStrength: -82,
    batteryLevel: 78,
    firmwareVersion: "11.189.63.00.00",
    isOnline: true,
    lastSeenAt: new Date('2024-08-29T10:45:00'),
    notes: "Normal operasyonda",
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-08-29')
  }
];

export const mockSimCards = [
  {
    id: "sim-1",
    iccid: "8990001234567890123",
    phoneNumber: "+905551234567",
    operator: "Turkcell",
    modemId: "modem-1",
    poolId: "POOL-001",
    isActive: true,
    dataAllowance: 100000, // 100GB in MB
    dataUsed: 45230,
    billingStatus: "active",
    regionCode: "TR-34",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-29')
  },
  {
    id: "sim-2",
    iccid: "8990001234567890124", 
    phoneNumber: "+905557654321",
    operator: "Vodafone",
    modemId: "modem-5",
    poolId: "POOL-002",
    isActive: true,
    dataAllowance: 50000, // 50GB in MB
    dataUsed: 32100,
    billingStatus: "active", 
    regionCode: "TR-06",
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-08-29')
  },
  {
    id: "sim-3",
    iccid: "8990001234567890125",
    phoneNumber: "+905559876543",
    operator: "Türk Telekom",
    modemId: null,
    poolId: "POOL-003",
    isActive: true,
    dataAllowance: 200000, // 200GB in MB
    dataUsed: 0,
    billingStatus: "active",
    regionCode: "TR-35",
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-08-29')
  }
];

export const mockWorkOrders = [
  {
    id: "wo-1",
    orderNumber: "WO-2024-001",
    modemId: "modem-1",
    assignedUserId: "user-1",
    type: "installation",
    priority: "high",
    status: "completed",
    description: "İstanbul Maslak'ta yeni 5G modem kurulumu",
    slaDeadline: new Date('2024-08-30T17:00:00'),
    startedAt: new Date('2024-08-29T09:00:00'),
    completedAt: new Date('2024-08-29T15:30:00'),
    resolutionNotes: "Kurulum başarıyla tamamlandı. Sinyal seviyesi optimal.",
    createdAt: new Date('2024-08-28'),
    updatedAt: new Date('2024-08-29')
  },
  {
    id: "wo-2", 
    orderNumber: "WO-2024-002",
    modemId: "modem-4",
    assignedUserId: "user-1",
    type: "repair",
    priority: "critical",
    status: "in_progress",
    description: "Ericsson Router güç kaynağı arızası",
    slaDeadline: new Date('2024-08-30T12:00:00'),
    startedAt: new Date('2024-08-29T08:00:00'),
    completedAt: null,
    resolutionNotes: null,
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-29')
  },
  {
    id: "wo-3",
    orderNumber: "WO-2024-003", 
    modemId: "modem-3",
    assignedUserId: "user-1",
    type: "replacement",
    priority: "normal",
    status: "pending",
    description: "Nokia FastMile 5G performans testi sonrası değerlendirme",
    slaDeadline: new Date('2024-09-05T16:00:00'),
    startedAt: null,
    completedAt: null,
    resolutionNotes: null,
    createdAt: new Date('2024-08-28'),
    updatedAt: new Date('2024-08-28')
  }
];

export const mockTestScenarios = [
  {
    id: "test-1",
    name: "5G Bağlantı Testi",
    description: "5G ağ bağlantısı ve hız performans testi",
    steps: [
      { step: 1, action: "Cihazı 5G ağa bağla", expected: "Bağlantı kurulmalı" },
      { step: 2, action: "Hız testi çalıştır", expected: "Min 100 Mbps download" },
      { step: 3, action: "Sinyal gücünü ölç", expected: "-80 dBm üzerinde olmalı" }
    ],
    isActive: true,
    createdBy: "user-1",
    createdAt: new Date('2024-01-10')
  },
  {
    id: "test-2",
    name: "Güç Tüketimi Testi",
    description: "Cihazın güç tüketimi ve batarya performansı testi",
    steps: [
      { step: 1, action: "Tam şarjdan başla", expected: "100% batarya" },
      { step: 2, action: "8 saat sürekli kullanım", expected: "Minimum %20 batarya kalmalı" },
      { step: 3, action: "Isınma kontrolü", expected: "60°C altında kalmalı" }
    ],
    isActive: true,
    createdBy: "user-1", 
    createdAt: new Date('2024-01-15')
  }
];

export const mockTestSessions = [
  {
    id: "session-1",
    modemId: "modem-3",
    scenarioId: "test-1",
    technicianId: "user-1",
    benchNumber: "BENCH-01",
    status: "running",
    result: null,
    logs: [
      { timestamp: new Date('2024-08-29T10:00:00'), message: "Test başlatıldı" },
      { timestamp: new Date('2024-08-29T10:05:00'), message: "5G bağlantı kuruldu" },
      { timestamp: new Date('2024-08-29T10:10:00'), message: "Hız testi başladı" }
    ],
    startedAt: new Date('2024-08-29T10:00:00'),
    completedAt: null,
    createdAt: new Date('2024-08-29T09:55:00')
  },
  {
    id: "session-2",
    modemId: "modem-1", 
    scenarioId: "test-2",
    technicianId: "user-1",
    benchNumber: "BENCH-02",
    status: "completed",
    result: "pass",
    logs: [
      { timestamp: new Date('2024-08-28T09:00:00'), message: "Güç testi başlatıldı" },
      { timestamp: new Date('2024-08-28T17:00:00'), message: "8 saatlik test tamamlandı" },
      { timestamp: new Date('2024-08-28T17:05:00'), message: "Sonuç: Başarılı - %25 batarya kaldı" }
    ],
    startedAt: new Date('2024-08-28T09:00:00'),
    completedAt: new Date('2024-08-28T17:05:00'),
    createdAt: new Date('2024-08-28T08:55:00')
  }
];

export const mockScrapRequests = [
  {
    id: "scrap-1",
    modemId: "modem-4",
    requestedBy: "user-1",
    reason: "Güç kaynağı arızası tekrar ediyor, ekonomik ömrü dolmuş",
    status: "pending",
    reviewedBy: null,
    reviewNotes: null,
    reviewedAt: null,
    createdAt: new Date('2024-08-25')
  },
  {
    id: "scrap-2",
    modemId: "modem-2",
    requestedBy: "user-1", 
    reason: "Fiziksel hasar, kasa çatlağı mevcut",
    status: "approved",
    reviewedBy: "user-1",
    reviewNotes: "Fotoğraflar incelendi, hurda onaylandı",
    reviewedAt: new Date('2024-08-20T14:30:00'),
    createdAt: new Date('2024-08-15')
  }
];

export const mockAlerts = [
  {
    id: "alert-1",
    type: "sla_warning", 
    severity: "warning",
    title: "SLA Uyarısı",
    message: "WO-2024-002 numaralı iş emri için SLA süresi yaklaşıyor (2 saat kaldı)",
    entityType: "work_order",
    entityId: "wo-2",
    isRead: false,
    userId: "user-1",
    createdAt: new Date('2024-08-29T10:00:00')
  },
  {
    id: "alert-2",
    type: "device_offline",
    severity: "critical", 
    title: "Cihaz Çevrimdışı",
    message: "Modem 352094087654324 (Ericsson Router 6000) 9 gündür çevrimdışı",
    entityType: "modem",
    entityId: "modem-4", 
    isRead: false,
    userId: null,
    createdAt: new Date('2024-08-29T08:30:00')
  },
  {
    id: "alert-3",
    type: "low_battery",
    severity: "info",
    title: "Düşük Batarya",
    message: "Modem 352094087654325 batarya seviyesi %78'e düştü",
    entityType: "modem",
    entityId: "modem-5",
    isRead: true,
    userId: "user-1", 
    createdAt: new Date('2024-08-29T07:45:00')
  }
];

export const mockActivityLogs = [
  {
    id: "log-1",
    userId: "user-1",
    action: "create_work_order",
    entityType: "work_order",
    entityId: "wo-1",
    oldData: null,
    newData: mockWorkOrders[0],
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: new Date('2024-08-28T15:30:00')
  },
  {
    id: "log-2", 
    userId: "user-1",
    action: "update_modem",
    entityType: "modem", 
    entityId: "modem-1",
    oldData: { status: "depot" },
    newData: { status: "field_active" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: new Date('2024-08-29T09:15:00')
  },
  {
    id: "log-3",
    userId: "user-1", 
    action: "create_company",
    entityType: "company",
    entityId: "comp-1",
    oldData: null,
    newData: mockCompanies[0],
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: new Date('2024-01-01T10:00:00')
  }
];

// Dashboard stats
export const mockStats = {
  total: mockModems.length,
  fieldActive: mockModems.filter(m => m.status === 'field_active').length,
  depot: mockModems.filter(m => m.status === 'depot').length, 
  testing: mockModems.filter(m => m.status === 'testing').length,
  repair: mockModems.filter(m => m.status === 'repair').length,
  scrap: mockModems.filter(m => m.status === 'scrap').length,
};

// Search results
export const performMockSearch = (query: string) => {
  const searchTerm = query.toLowerCase();
  
  return {
    modems: mockModems.filter(m => 
      m.imei.toLowerCase().includes(searchTerm) ||
      m.model.toLowerCase().includes(searchTerm) ||
      m.brand.toLowerCase().includes(searchTerm)
    ),
    workOrders: mockWorkOrders.filter(wo =>
      wo.orderNumber.toLowerCase().includes(searchTerm) ||
      wo.description.toLowerCase().includes(searchTerm)
    ),
    simCards: mockSimCards.filter(sim =>
      sim.iccid.toLowerCase().includes(searchTerm) ||
      (sim.phoneNumber && sim.phoneNumber.includes(searchTerm))
    )
  };
};