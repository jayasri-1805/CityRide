import { Vehicle } from '../types/transport';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bus, Zap, Users, MapPin } from 'lucide-react';

interface StatsOverviewProps {
  vehicles: Vehicle[];
}

export function StatsOverview({ vehicles }: StatsOverviewProps) {
  const activeVehicles = vehicles.filter(v => v.isActive).length;
  const totalVehicles = vehicles.length;
  const averageSpeed = vehicles
    .filter(v => v.isActive)
    .reduce((sum, v) => sum + v.speed, 0) / (activeVehicles || 1);
  
  const occupancyStats = vehicles.reduce((acc, v) => {
    acc[v.occupancy] = (acc[v.occupancy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeStats = vehicles.reduce((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Vehicles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
          <Bus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeVehicles}</div>
          <p className="text-xs text-muted-foreground">
            of {totalVehicles} total vehicles
          </p>
          <div className="mt-2">
            <Badge variant={activeVehicles > totalVehicles * 0.8 ? "default" : "secondary"}>
              {Math.round((activeVehicles / totalVehicles) * 100)}% operational
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Average Speed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(averageSpeed)} km/h</div>
          <p className="text-xs text-muted-foreground">
            across active vehicles
          </p>
        </CardContent>
      </Card>

      {/* Fleet Composition */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fleet Composition</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(typeStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="capitalize">{type}s</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Occupancy Levels */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(occupancyStats).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    level === 'low' ? 'bg-green-500' :
                    level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="capitalize">{level}</span>
                </div>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}