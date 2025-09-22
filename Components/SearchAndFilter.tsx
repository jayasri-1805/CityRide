import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Search, Filter, X, ArrowRightLeft, Hash, Route, Mic } from 'lucide-react';
import { SpeechToText } from './SpeechToText';

interface SearchAndFilterProps {
  onSearch: (searchData: SearchOptions) => void;
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
  searchOptions?: SearchOptions;
}

export interface SearchOptions {
  type: 'route-planning' | 'bus-number' | 'route-search';
  from?: string;
  to?: string;
  busNumber?: string;
  routeName?: string;
}

export interface FilterOptions {
  type: string;
  status: string;
  route: string;
  occupancy: string;
}

export function SearchAndFilter({ onSearch, onFilterChange, activeFilters, searchOptions }: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState(searchOptions?.type || 'route-planning');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [searchData, setSearchData] = useState<SearchOptions>(
    searchOptions || {
      type: 'route-planning',
      from: '',
      to: '',
      busNumber: '',
      routeName: ''
    }
  );

  // Popular locations for From/To dropdowns
  const popularLocations = [
    'Central Station', 'City Mall', 'Airport', 'University Campus', 
    'Downtown Plaza', 'Hospital', 'Sports Complex', 'Tech Park',
    'Bus Terminal', 'Train Station', 'Metro Station', 'Shopping District'
  ];

  // Available routes
  const availableRoutes = [
    'Downtown Loop', 'University Route', 'North-South Line', 
    'Green Line', 'Airport Express', 'Metro Blue Line'
  ];

  // Sync with external searchOptions
  useEffect(() => {
    if (searchOptions) {
      setSearchData(searchOptions);
      setActiveTab(searchOptions.type);
    }
  }, [searchOptions]);

  const handleSearch = () => {
    const searchOptions: SearchOptions = {
      type: activeTab as 'route-planning' | 'bus-number' | 'route-search',
      from: searchData.from,
      to: searchData.to,
      busNumber: searchData.busNumber,
      routeName: searchData.routeName
    };
    onSearch(searchOptions);
  };

  const updateSearchData = (field: keyof SearchOptions, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    // Convert "all" values back to empty strings for filtering logic
    const filterValue = value === 'all' ? '' : value;
    const newFilters = { ...activeFilters, [key]: filterValue };
    onFilterChange(newFilters);
  };

  const clearFilter = (key: keyof FilterOptions) => {
    handleFilterChange(key, 'all');
  };

  const clearAllFilters = () => {
    onFilterChange({
      type: '',
      status: '',
      route: '',
      occupancy: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== '').length;
  };

  const handleVoiceInput = (text: string) => {
    // Process the voice input based on current tab
    if (activeTab === 'bus-number') {
      // Clean and format bus number input
      const cleanedText = text
        .replace(/\b(bus|number|metro|tram)\b/gi, '') // Remove common transport words
        .replace(/\b(zero|oh)\b/gi, '0') // Convert spoken numbers
        .replace(/\bone\b/gi, '1')
        .replace(/\btwo\b/gi, '2')
        .replace(/\bthree\b/gi, '3')
        .replace(/\bfour\b/gi, '4')
        .replace(/\bfive\b/gi, '5')
        .replace(/\bsix\b/gi, '6')
        .replace(/\bseven\b/gi, '7')
        .replace(/\beight\b/gi, '8')
        .replace(/\bnine\b/gi, '9')
        .replace(/\s+/g, '') // Remove spaces
        .trim()
        .toUpperCase();
      
      updateSearchData('busNumber', cleanedText);
    }
    // For route names in route-search tab
    else if (activeTab === 'route-search') {
      // Capitalize first letter of each word for route names
      const formattedText = text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      updateSearchData('routeName', formattedText);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="route-planning" className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Route Planning</span>
            <span className="sm:hidden">Routes</span>
          </TabsTrigger>
          <TabsTrigger value="bus-number" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            <span className="hidden sm:inline">Bus Number</span>
            <span className="sm:hidden">Number</span>
          </TabsTrigger>
          <TabsTrigger value="route-search" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            <span className="hidden sm:inline">Route Search</span>
            <span className="sm:hidden">Route</span>
          </TabsTrigger>
        </TabsList>

        {/* Route Planning Tab */}
        <TabsContent value="route-planning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">From</label>
              <Select value={searchData.from} onValueChange={(value) => updateSearchData('from', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select starting location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">📍 Current Location</SelectItem>
                  {popularLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">To</label>
              <Select value={searchData.to} onValueChange={(value) => updateSearchData('to', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {popularLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleSearch} 
            className="w-full"
            disabled={!searchData.from || !searchData.to}
          >
            <Search className="w-4 h-4 mr-2" />
            Find Routes
          </Button>
        </TabsContent>

        {/* Bus Number Tab */}
        <TabsContent value="bus-number" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Bus Number</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowVoiceInput(!showVoiceInput)}
                className="text-xs"
              >
                <Mic className="w-3 h-3 mr-1" />
                Voice Input
              </Button>
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Enter bus number (e.g., B001, M15, T7)"
                value={searchData.busNumber}
                onChange={(e) => updateSearchData('busNumber', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Voice Input Section */}
          <Collapsible open={showVoiceInput} onOpenChange={setShowVoiceInput}>
            <CollapsibleContent className="space-y-3">
              <div className="p-4 border rounded-lg bg-muted/20">
                <SpeechToText
                  onTextReceived={handleVoiceInput}
                  placeholder="Say the bus number clearly, e.g., 'B zero zero one' or 'Metro fifteen'"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Button 
            onClick={handleSearch} 
            className="w-full"
            disabled={!searchData.busNumber}
          >
            <Search className="w-4 h-4 mr-2" />
            Find Vehicle
          </Button>
        </TabsContent>

        {/* Route Search Tab */}
        <TabsContent value="route-search" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Route Name</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowVoiceInput(!showVoiceInput)}
                className="text-xs"
              >
                <Mic className="w-3 h-3 mr-1" />
                Voice Input
              </Button>
            </div>
            <Select value={searchData.routeName} onValueChange={(value) => updateSearchData('routeName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a route" />
              </SelectTrigger>
              <SelectContent>
                {availableRoutes.map(route => (
                  <SelectItem key={route} value={route}>{route}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Voice Input Section */}
          <Collapsible open={showVoiceInput} onOpenChange={setShowVoiceInput}>
            <CollapsibleContent className="space-y-3">
              <div className="p-4 border rounded-lg bg-muted/20">
                <SpeechToText
                  onTextReceived={handleVoiceInput}
                  placeholder="Say the route name, e.g., 'Downtown Loop' or 'University Route'"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Button 
            onClick={handleSearch} 
            className="w-full"
            disabled={!searchData.routeName}
          >
            <Search className="w-4 h-4 mr-2" />
            Show All Vehicles
          </Button>
        </TabsContent>
      </Tabs>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>

        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.type && (
            <Badge variant="outline" className="flex items-center gap-1">
              Type: {activeFilters.type}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => clearFilter('type')}
              />
            </Badge>
          )}
          {activeFilters.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {activeFilters.status}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => clearFilter('status')}
              />
            </Badge>
          )}
          {activeFilters.route && (
            <Badge variant="outline" className="flex items-center gap-1">
              Route: {activeFilters.route}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => clearFilter('route')}
              />
            </Badge>
          )}
          {activeFilters.occupancy && (
            <Badge variant="outline" className="flex items-center gap-1">
              Occupancy: {activeFilters.occupancy}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => clearFilter('occupancy')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Filter Controls */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/30">
          <div>
            <label className="block text-sm font-medium mb-2">Vehicle Type</label>
            <Select
              value={activeFilters.type || 'all'}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="metro">Metro</SelectItem>
                <SelectItem value="tram">Tram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select
              value={activeFilters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Route</label>
            <Select
              value={activeFilters.route || 'all'}
              onValueChange={(value) => handleFilterChange('route', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Routes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                <SelectItem value="Downtown Loop">Downtown Loop</SelectItem>
                <SelectItem value="University Route">University Route</SelectItem>
                <SelectItem value="North-South Line">North-South Line</SelectItem>
                <SelectItem value="Green Line">Green Line</SelectItem>
                <SelectItem value="Airport Express">Airport Express</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Occupancy</label>
            <Select
              value={activeFilters.occupancy || 'all'}
              onValueChange={(value) => handleFilterChange('occupancy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}