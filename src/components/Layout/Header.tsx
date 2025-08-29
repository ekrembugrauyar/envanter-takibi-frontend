import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAlerts, useGlobalSearch } from "@/hooks/useMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { type SearchResults } from "@/types";

export default function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch alerts and search
  const { data: alerts } = useAlerts();
  const { data: searchResults, isLoading: isSearching } = useGlobalSearch(searchQuery.length > 2 ? searchQuery : "");

  const unreadAlerts = alerts?.filter((alert: any) => !alert.isRead) || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearchOpen(value.length > 2);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="sticky top-0 z-10 flex h-16 bg-background border-b border-border">
      <button 
        className="lg:hidden px-4 border-r border-border text-muted-foreground focus:outline-none"
        data-testid="mobile-menu-button"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="IMEI, Numara, İş Emri No ile ara..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4"
              data-testid="global-search-input"
            />
            
            {isSearchOpen && (
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <div />
                </PopoverTrigger>
                <PopoverContent className="w-96 mt-2" align="start">
                  <div className="space-y-4">
                    {isSearching ? (
                      <div className="text-center py-4">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : searchResults ? (
                      <>
                        {searchResults.modems.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-card-foreground mb-2">Modemler</h4>
                            <div className="space-y-1">
                              {searchResults.modems.map((modem) => (
                                <div key={modem.id} className="p-2 hover:bg-accent rounded cursor-pointer">
                                  <div className="font-medium text-sm">{modem.imei}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {modem.brand} {modem.model} - {modem.status}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {searchResults.workOrders.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-card-foreground mb-2">İş Emirleri</h4>
                            <div className="space-y-1">
                              {searchResults.workOrders.map((workOrder) => (
                                <div key={workOrder.id} className="p-2 hover:bg-accent rounded cursor-pointer">
                                  <div className="font-medium text-sm">{workOrder.orderNumber}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {workOrder.description} - {workOrder.status}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {searchResults.simCards.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-card-foreground mb-2">SIM Kartları</h4>
                            <div className="space-y-1">
                              {searchResults.simCards.map((simCard) => (
                                <div key={simCard.id} className="p-2 hover:bg-accent rounded cursor-pointer">
                                  <div className="font-medium text-sm">{simCard.iccid}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {simCard.phoneNumber} - {simCard.operator}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {searchResults.modems.length === 0 && 
                         searchResults.workOrders.length === 0 && 
                         searchResults.simCards.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            Sonuç bulunamadı
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                data-testid="notifications-button"
              >
                <Bell className="h-5 w-5" />
                {unreadAlerts.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {unreadAlerts.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b border-border">
                <h4 className="font-semibold">Bildirimler</h4>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {unreadAlerts.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                    Yeni bildirim yok
                  </div>
                ) : (
                  unreadAlerts.slice(0, 5).map((alert: any) => (
                    <DropdownMenuItem key={alert.id} className="px-3 py-3 cursor-pointer">
                      <div className="flex items-start space-x-3 w-full">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.severity === 'critical' ? 'bg-destructive' :
                          alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-chart-1'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-card-foreground">
                            {alert.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {alert.message}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto" data-testid="user-menu-button">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-card-foreground hidden lg:block">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
