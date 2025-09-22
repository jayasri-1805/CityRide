import { useState, useEffect } from 'react';
import { Vehicle, Route } from '../types/transport';
import { mockRoutes } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { MapPin, Clock, Navigation, Users, X } from 'lucide-react';

interface VehicleTrackerProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export function VehicleTracker({ vehicle, onClose }: VehicleTrackerProps) {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Find the route for this vehicle
    const route = mockRoutes.find(r => r.name === vehicle.route);
    setCurrentRoute(route || null);
    
    // Simulate progress along route
    setProgress(Math.random() * 100);
  }, [vehicle.route]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 2) % 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getNextStops = () => {
    if (!currentRoute) return [];
    
    const currentStopIndex = currentRoute.stops.findIndex(stop => stop.isNext);
    if (currentStopIndex === -1) return currentRoute.stops.slice(0, 3);
    
    return currentRoute.stops.slice(currentStopIndex, currentStopIndex + 3);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Tracking {vehicle.number}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Real-time Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>Real-time Status</h3>
            <Badge variant={vehicle.isActive ? "default" : "secondary"}>
              {vehicle.isActive ? "Live" : "Offline"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Speed</p>
              <p className="text-lg font-medium">{vehicle.speed} km/h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Occupancy</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  vehicle.occupancy === 'low' ? 'bg-green-500' :
                  vehicle.occupancy === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="capitalize">{vehicle.occupancy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Progress */}
        {currentRoute && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3>Route Progress</h3>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% completed</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentRoute.stops[0]?.name}</span>
              <span>{currentRoute.stops[currentRoute.stops.length - 1]?.name}</span>
            </div>
          </div>
        )}

        {/* Current Location */}
        <div className="space-y-2">
          <h3>Current Location</h3>
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">{vehicle.currentLocation.address}</p>
              <p className="text-sm text-muted-foreground">
                {vehicle.currentLocation.lat.toFixed(4)}, {vehicle.currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Next Stops */}
        <div className="space-y-3">
          <h3>Next Stops</h3>
          <div className="space-y-2">
            {getNextStops().map((stop, index) => (
              <div key={stop.id} className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                  <span className={index === 0 ? 'font-medium' : 'text-muted-foreground'}>
                    {stop.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {index === 0 ? vehicle.estimatedArrival : `${(index + 1) * 5} min`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Info */}
        {currentRoute && (
          <div className="space-y-2">
            <h3>Route Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Frequency</p>
                <p>{currentRoute.frequency}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Operating Hours</p>
                <p>{currentRoute.operatingHours.start} - {currentRoute.operatingHours.end}</p>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {new Date(vehicle.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}