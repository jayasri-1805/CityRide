import { Vehicle } from '../types/transport';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Users, Zap, Eye } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onTrack: (vehicleId: string) => void;
}

export function VehicleCard({ vehicle, onTrack }: VehicleCardProps) {
  const getOccupancyColor = (occupancy: Vehicle['occupancy']) => {
    switch (occupancy) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getVehicleIcon = (type: Vehicle['type']) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'bus': return '🚌';
      case 'metro': return '🚇';
      case 'tram': return '🚊';
      default: return '🚌';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{getVehicleIcon(vehicle.type)}</span>
            {vehicle.number}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={vehicle.isActive ? "default" : "secondary"}>
              {vehicle.isActive ? "Active" : "Offline"}
            </Badge>
            {vehicle.isActive && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getOccupancyColor(vehicle.occupancy)}`} />
                <span className="text-sm text-muted-foreground capitalize">{vehicle.occupancy}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">{vehicle.route}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current:</span>
              <span>{vehicle.currentLocation.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next Stop:</span>
              <span>{vehicle.nextStop}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">ETA:</span>
              <span className="font-medium text-primary">{vehicle.estimatedArrival}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Capacity:</span>
              <span>{vehicle.capacity} passengers</span>
            </div>
            
            {vehicle.isActive && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Speed:</span>
                <span>{vehicle.speed} km/h</span>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              Updated: {new Date(vehicle.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onTrack(vehicle.id)} 
            className="flex-1"
            variant="default"
          >
            <Eye className="w-4 h-4 mr-2" />
            Track Vehicle
          </Button>
          <Button variant="outline" className="flex-1">
            View Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}