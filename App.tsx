import { useState, useEffect } from 'react';
import { Vehicle } from './types/transport';
import { mockVehicles } from './data/mockData';
import { VehicleCard } from './components/VehicleCard';
import { SearchAndFilter, FilterOptions, SearchOptions } from './components/SearchAndFilter';
import { VoiceSearchDemo } from './components/VoiceSearchDemo';
import { VehicleTracker } from './components/VehicleTracker';
import { StatsOverview } from './components/StatsOverview';
import { AuthPage } from './components/AuthPage';
import { UserProfile } from './components/UserProfile';
import { QuickLogoutButton } from './components/LogoutConfirmation';
import { SessionTimeout } from './components/SessionTimeout';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserMenu } from './components/UserMenu';
import { EmergencyLogout } from './components/EmergencyLogout';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { MapPin, Smartphone, Wifi, RefreshCw, Mic, LogOut, Zap } from 'lucide-react';

function MainApp() {
  const { auth } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [trackedVehicle, setTrackedVehicle] = useState<Vehicle | null>(null);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    type: 'route-planning',
    from: '',
    to: '',
    busNumber: '',
    routeName: ''
  });
  const [filters, setFilters] = useState<FilterOptions>({
    type: '',
    status: '',
    route: '',
    occupancy: ''
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showFloatingLogout, setShowFloatingLogout] = useState(false);
  const [sessionTime, setSessionTime] = useState('');

  // Calculate session time
  useEffect(() => {
    if (auth.user?.lastLogin) {
      const updateSessionTime = () => {
        const loginTime = new Date(auth.user.lastLogin);
        const now = new Date();
        const diffMs = now.getTime() - loginTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffHours > 0) {
          setSessionTime(`${diffHours}h ${diffMins % 60}m`);
        } else {
          setSessionTime(`${diffMins}m`);
        }
      };

      updateSessionTime();
      const interval = setInterval(updateSessionTime, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [auth.user?.lastLogin]);

  // Keyboard shortcut for logout (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setShowFloatingLogout(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => ({
          ...vehicle,
          speed: vehicle.isActive ? Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10) : 0,
          estimatedArrival: vehicle.isActive 
            ? `${Math.max(1, parseInt(vehicle.estimatedArrival) + (Math.random() > 0.5 ? -1 : 1))} min`
            : vehicle.estimatedArrival,
          lastUpdated: new Date().toISOString()
        }))
      );
      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter vehicles based on search and filters
  useEffect(() => {
    let filtered = vehicles;

    // Handle different search types
    if (searchOptions.type === 'route-planning' && searchOptions.from && searchOptions.to) {
      // For route planning, find vehicles that could serve the route between locations
      filtered = filtered.filter(vehicle => {
        const currentLoc = vehicle.currentLocation.address.toLowerCase();
        const nextStop = vehicle.nextStop.toLowerCase();
        const route = vehicle.route.toLowerCase();
        const from = searchOptions.from!.toLowerCase();
        const to = searchOptions.to!.toLowerCase();
        
        // Smart matching: check if vehicle connects the from/to locations
        const servesFromLocation = (
          currentLoc.includes(from) || 
          nextStop.includes(from) ||
          (from === 'current location') ||
          // Route-based matching for common destinations
          (from.includes('downtown') && (route.includes('downtown') || route.includes('loop'))) ||
          (from.includes('university') && route.includes('university')) ||
          (from.includes('airport') && route.includes('airport'))
        );
        
        const servesToLocation = (
          currentLoc.includes(to) || 
          nextStop.includes(to) ||
          // Route-based matching for common destinations  
          (to.includes('downtown') && (route.includes('downtown') || route.includes('loop'))) ||
          (to.includes('university') && route.includes('university')) ||
          (to.includes('airport') && route.includes('airport')) ||
          (to.includes('mall') && currentLoc.includes('mall')) ||
          (to.includes('hospital') && nextStop.includes('hospital'))
        );
        
        return servesFromLocation || servesToLocation;
      });
    } else if (searchOptions.type === 'bus-number' && searchOptions.busNumber) {
      // Filter by bus number with flexible matching
      filtered = filtered.filter(vehicle =>
        vehicle.number.toLowerCase().includes(searchOptions.busNumber!.toLowerCase()) ||
        vehicle.number.replace(/[-\s]/g, '').toLowerCase().includes(searchOptions.busNumber!.replace(/[-\s]/g, '').toLowerCase())
      );
    } else if (searchOptions.type === 'route-search' && searchOptions.routeName) {
      // Filter by route name with exact matching
      filtered = filtered.filter(vehicle =>
        vehicle.route.toLowerCase() === searchOptions.routeName!.toLowerCase()
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(vehicle => vehicle.type === filters.type);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(vehicle => 
        filters.status === 'active' ? vehicle.isActive : !vehicle.isActive
      );
    }

    // Route filter
    if (filters.route) {
      filtered = filtered.filter(vehicle => vehicle.route === filters.route);
    }

    // Occupancy filter
    if (filters.occupancy) {
      filtered = filtered.filter(vehicle => vehicle.occupancy === filters.occupancy);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchOptions, filters]);

  const handleSearch = (newSearchOptions: SearchOptions) => {
    setSearchOptions(newSearchOptions);
  };

  const handleVoiceSearchResult = (text: string, type: 'bus-number' | 'route-name') => {
    // Process voice input and update search options
    const newSearchOptions: SearchOptions = {
      type: type === 'bus-number' ? 'bus-number' : 'route-search',
      from: searchOptions.from,
      to: searchOptions.to,
      busNumber: type === 'bus-number' ? text : searchOptions.busNumber,
      routeName: type === 'route-name' ? text : searchOptions.routeName
    };
    
    setSearchOptions(newSearchOptions);
    
    // Auto-trigger search if we have a valid input
    if ((type === 'bus-number' && text) || (type === 'route-name' && text)) {
      // Small delay to allow state to update
      setTimeout(() => {
        handleSearch(newSearchOptions);
      }, 100);
    }
  };

  const handleTrackVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setTrackedVehicle(vehicle);
    }
  };

  const handleRefresh = () => {
    // Simulate refresh with slight data changes
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => ({
        ...vehicle,
        lastUpdated: new Date().toISOString()
      }))
    );
    setLastUpdate(new Date());
  };

  // Show loading state
  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-2xl font-semibold">CityTransit</h1>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!auth.isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Session Timeout Warning */}
      <SessionTimeout timeoutMinutes={30} warningMinutes={5} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">CityTransit Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
                <Wifi className="h-4 w-4" />
                <span>Live</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
                <RefreshCw className="h-4 w-4 sm:hidden" />
              </Button>

              {/* Emergency Logout Button - Always visible on larger screens */}
              <div className="hidden sm:block">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFloatingLogout(true)}
                  className="text-muted-foreground hover:text-destructive"
                  title="Quick Logout (Ctrl+Shift+L)"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Emergency Logout</span>
                </Button>
              </div>

              {/* User Profile & Logout Options */}
              {auth.user && (
                <>
                  {/* Mobile: Compact User Menu */}
                  <div className="md:hidden">
                    <UserMenu user={auth.user} variant="compact" />
                  </div>

                  {/* Tablet: Enhanced logout with greeting and multiple options */}
                  <div className="hidden md:flex lg:hidden items-center space-x-3">
                    <div className="text-sm text-muted-foreground">
                      Hi, {auth.user.firstName}
                    </div>
                    <div className="flex items-center gap-1">
                      <QuickLogoutButton variant="outline" size="sm" />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowFloatingLogout(true)}
                        title="Emergency Logout"
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Desktop: Full Profile Dropdown */}
                  <div className="hidden lg:block">
                    <UserProfile user={auth.user} variant="dropdown" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Welcome back, {auth.user?.firstName}!
                  </h2>
                  <p className="text-primary-foreground/90 mb-4">
                    Track vehicles in real-time across your city. Find routes, check timings, and stay updated.
                    {auth.user?.role === 'operator' && ' Manage your fleet with operator tools.'}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-4 w-4" />
                      <span>Mobile Friendly</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wifi className="h-4 w-4" />
                      <span>Real-time Updates</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mic className="h-4 w-4" />
                      <span>Voice Search</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                        {auth.user?.role === 'operator' ? 'Operator Access' : 'Passenger Mode'}
                      </Badge>
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowFloatingLogout(true)}
                        className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        Quick Logout
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{vehicles.filter(v => v.isActive).length}</div>
                    <div className="text-sm text-primary-foreground/90">Active Vehicles</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview vehicles={vehicles} />
        </div>

        {/* Voice Search Demo */}
        <div className="mb-6">
          <VoiceSearchDemo onVoiceResult={handleVoiceSearchResult} />
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Find Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchAndFilter
                onSearch={handleSearch}
                onFilterChange={setFilters}
                activeFilters={filters}
                searchOptions={searchOptions}
              />
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Tracker */}
        {trackedVehicle && (
          <div className="mb-8">
            <VehicleTracker
              vehicle={trackedVehicle}
              onClose={() => setTrackedVehicle(null)}
            />
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Available Vehicles
              <Badge variant="secondary" className="ml-2">
                {filteredVehicles.length}
              </Badge>
            </h2>
            
            {(searchOptions.from || searchOptions.busNumber || searchOptions.routeName) && (
              <p className="text-sm text-muted-foreground">
                {searchOptions.type === 'route-planning' && searchOptions.from && searchOptions.to && 
                  `Route: ${searchOptions.from} → ${searchOptions.to}`}
                {searchOptions.type === 'bus-number' && searchOptions.busNumber && 
                  `Bus: ${searchOptions.busNumber}`}
                {searchOptions.type === 'route-search' && searchOptions.routeName && 
                  `Route: ${searchOptions.routeName}`}
              </p>
            )}
          </div>

          {filteredVehicles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchOptions({
                    type: 'route-planning',
                    from: '',
                    to: '',
                    busNumber: '',
                    routeName: ''
                  });
                  setFilters({ type: '', status: '', route: '', occupancy: '' });
                }}>
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onTrack={handleTrackVehicle}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left text-sm text-muted-foreground">
              <p>CityTransit Real-Time Tracking System</p>
              <p className="mt-1">Connecting your city with smart public transportation</p>
            </div>
            
            {/* Footer Logout Options */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  Signed in as {auth.user?.firstName}
                </span>
                {sessionTime && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-xs text-muted-foreground">
                      Session: {sessionTime}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setShowFloatingLogout(true)}
                  className="text-muted-foreground hover:text-destructive p-0 h-auto"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign Out
                </Button>
                <span className="text-xs text-muted-foreground">
                  or press Ctrl+Shift+L
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Emergency Logout Component - Always available */}
      <EmergencyLogout 
        isOpen={showFloatingLogout}
        onClose={() => setShowFloatingLogout(false)}
      />

      {/* Floating Logout Button for Mobile - Only show on small screens */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <Button
          variant="destructive"
          size="icon"
          onClick={() => setShowFloatingLogout(true)}
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Quick Logout (Ctrl+Shift+L)"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Main App component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}