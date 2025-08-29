# Envanter Takibi Frontend

Bu proje, Envanter Takibi sisteminin frontend uygulamasıdır. Backend yapısından bağımsız olarak çalışabilir ve gerçek API'lere bağlanmak için hazır template'ler içerir.

## 🚀 Özellikler

- **Modern React 18** ile geliştirilmiş
- **TypeScript** desteği
- **Tailwind CSS** ile responsive tasarım
- **Radix UI** bileşenleri
- **Mock Data** ile demo modunda çalışma
- **API Template'leri** ile backend entegrasyonu için hazır yapı
- **Toast bildirimleri** ve **Error handling**
- **Responsive tasarım** (mobil uyumlu)

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── components/          # UI bileşenleri
│   │   ├── Dashboard/      # Dashboard bileşenleri
│   │   ├── Layout/         # Layout bileşenleri
│   │   └── ui/             # Temel UI bileşenleri
│   ├── hooks/              # Custom hooks
│   │   ├── useMockData.ts  # Mock data hooks (demo mod)
│   │   └── useApi.ts       # Real API hooks (production mod)
│   ├── lib/                # Yardımcı fonksiyonlar
│   │   ├── mockData.ts     # Mock data
│   │   └── apiTemplate.ts  # API template'leri
│   ├── pages/              # Sayfa bileşenleri
│   ├── types/              # TypeScript tip tanımları
│   └── main.tsx           # Ana giriş noktası
├── package.json            # Bağımlılıklar
├── vite.config.ts         # Vite konfigürasyonu
├── tailwind.config.ts     # Tailwind konfigürasyonu
└── tsconfig.json          # TypeScript konfigürasyonu
```

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

3. **Production build:**
```bash
npm run build
```

4. **Build'i önizleyin:**
```bash
npm run preview
```

## 🔄 Mock Data vs Real API

### Mock Data Modu (Varsayılan)
Uygulama varsayılan olarak mock data ile çalışır. Bu mod:
- Backend gerektirmez
- Demo amaçlı kullanım için idealdir
- `useMockData.ts` hook'larını kullanır

### Real API Modu
Gerçek backend'e bağlanmak için:

1. **Environment variable'ı ayarlayın:**
```bash
REACT_APP_API_URL=http://your-backend-url/api
```

2. **Hook'ları değiştirin:**
```tsx
// Mock data yerine
import { useModems } from '@/hooks/useMockData';

// Real API kullanın
import { useModems } from '@/hooks/useApi';
```

## 📱 Sayfalar

- **Dashboard**: Genel bakış ve istatistikler
- **Inventory**: Envanter listesi ve yönetimi
- **GSM**: GSM cihazları takibi
- **Field**: Saha izleme
- **Laboratory**: Laboratuvar test takibi
- **Testing**: Test senaryoları ve oturumları
- **SLA**: SLA dashboard'u
- **Scrap**: Hurda takibi
- **Company**: Şirket portalı

## 🎨 UI Bileşenleri

Proje, Radix UI tabanlı modern bileşenler kullanır:
- Accordion, Alert, Avatar, Badge
- Button, Card, Dialog, Dropdown
- Form, Input, Select, Table
- Toast, Tooltip, ve daha fazlası

## 🔧 Konfigürasyon

### Vite
- React plugin
- Path alias (@/ -> src/)
- Port: 3000

### Tailwind CSS
- Typography plugin
- Custom animations
- Responsive breakpoints

### TypeScript
- Strict mode
- Path mapping
- Modern ES features

## 📊 Mock Data Yapısı

Sistem şu mock data'ları içerir:
- **Companies**: Şirket bilgileri
- **Locations**: Lokasyon bilgileri
- **Modems**: Modem cihazları
- **SIM Cards**: SIM kartları
- **Work Orders**: İş emirleri
- **Test Scenarios**: Test senaryoları
- **Alerts**: Uyarılar
- **Activity Logs**: Aktivite kayıtları

## 🚀 Production'a Geçiş

1. **Environment variables'ları ayarlayın**
2. **API endpoint'lerini güncelleyin**
3. **Authentication sistemini entegre edin**
4. **Error handling'i test edin**
5. **Performance optimizasyonlarını yapın**

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

MIT License

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.
