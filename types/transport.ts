export interface Vehicle {
  id: string;
  number: string;
  route: string;
  operator: string;
  type: 'bus' | 'metro' | 'tram';
  capacity: number;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  nextStop: string;
  estimatedArrival: string;
  isActive: boolean;
  speed: number;
  occupancy: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface Route {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
  frequency: string;
  operatingHours: {
    start: string;
    end: string;
  };
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  estimatedTime?: string;
  isNext?: boolean;
}

export interface TrackingData {
  vehicleId: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  speed: number;
  passengers: number;
  delay: number;
}