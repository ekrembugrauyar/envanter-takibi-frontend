import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Satellite, 
  Package, 
  TestTube, 
  Clock, 
  MapPin, 
  Building,
  Shield,
  Zap,
  BarChart3
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Package,
      title: "Envanter Takibi",
      description: "IMEI, model, durum ve lokasyon bazlı detaylı modem envanteri"
    },
    {
      icon: TestTube,
      title: "Teknik Test",
      description: "Lab dashboard ve otomatik test senaryoları ile kalite kontrol"
    },
    {
      icon: Clock,
      title: "SLA Yönetimi",
      description: "İş emri takibi, SLA süresi kontrolü ve otomatik uyarılar"
    },
    {
      icon: MapPin,
      title: "Saha Takibi",
      description: "Harita görünümü ile cihaz durumu ve telemetri izleme"
    },
    {
      icon: Building,
      title: "Firma Portalı",
      description: "Dış firmalara özel envanter görünürlüğü ve yönetimi"
    },
    {
      icon: Shield,
      title: "Güvenlik",
      description: "Rol bazlı erişim kontrolü ve detaylı aktivite kayıtları"
    }
  ];

  const stats = [
    { label: "Aktif Modem", value: "2,847+", icon: Satellite },
    { label: "Günlük İşlem", value: "156+", icon: Zap },
    { label: "SLA Başarısı", value: "%96.8", icon: BarChart3 },
  ];

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="relative">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Satellite className="text-primary-foreground w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-foreground">TelecomIMS</h1>
              </div>
              <Button onClick={handleLogin} data-testid="login-button">
                Giriş Yap
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-foreground sm:text-6xl mb-6">
                Telecom Inventory
                <br />
                <span className="text-primary">Management System</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Modem envanteri, saha operasyonları, teknik testler ve SLA takibi için 
                kapsamlı enterprise çözüm
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleLogin} 
                size="lg" 
                className="text-lg px-8 py-3"
                data-testid="hero-login-button"
              >
                Sistemi Keşfet
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-card-foreground mb-4">
                Kapsamlı Sistem Modülleri
              </h2>
              <p className="text-lg text-muted-foreground">
                8 ana modül ile tüm operasyonlarınızı tek platformda yönetin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Hemen Başlayın
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Telecom operasyonlarınızı dijitalleştirin, verimliliğinizi artırın
              </p>
              <Button 
                onClick={handleLogin} 
                size="lg"
                data-testid="cta-login-button"
              >
                Sisteme Giriş Yap
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Satellite className="text-primary-foreground w-3 h-3" />
                </div>
                <span className="font-semibold text-foreground">TelecomIMS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 TelecomIMS. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
