import { Vehicle, Route } from '../types/transport';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    number: 'B-101',
    route: 'Downtown Loop',
    operator: 'City Transit',
    type: 'bus',
    capacity: 45,
    currentLocation: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Central Station'
    },
    nextStop: 'City Mall',
    estimatedArrival: '3 min',
    isActive: true,
    speed: 25,
    occupancy: 'medium',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    number: 'B-205',
    route: 'University Route',
    operator: 'Metro Lines',
    type: 'bus',
    capacity: 40,
    currentLocation: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'University Campus'
    },
    nextStop: 'Downtown Plaza',
    estimatedArrival: '7 min',
    isActive: true,
    speed: 30,
    occupancy: 'high',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    number: 'M-302',
    route: 'North-South Line',
    operator: 'City Metro',
    type: 'metro',
    capacity: 150,
    currentLocation: {
      lat: 40.7282,
      lng: -73.7949,
      address: 'Metro Station'
    },
    nextStop: 'Hospital',
    estimatedArrival: '2 min',
    isActive: true,
    speed: 45,
    occupancy: 'low',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    number: 'T-150',
    route: 'Green Line',
    operator: 'City Trams',
    type: 'tram',
    capacity: 80,
    currentLocation: {
      lat: 40.7505,
      lng: -73.9934,
      address: 'Tech Park'
    },
    nextStop: 'Sports Complex',
    estimatedArrival: '5 min',
    isActive: true,
    speed: 20,
    occupancy: 'medium',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    number: 'B-407',
    route: 'Airport Express',
    operator: 'Express Transit',
    type: 'bus',
    capacity: 35,
    currentLocation: {
      lat: 40.6892,
      lng: -74.1745,
      address: 'Airport'
    },
    nextStop: 'Downtown Plaza',
    estimatedArrival: '12 min',
    isActive: true,
    speed: 35,
    occupancy: 'low',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    number: 'B-308',
    route: 'Downtown Loop',
    operator: 'City Transit',
    type: 'bus',
    capacity: 45,
    currentLocation: {
      lat: 40.7150,
      lng: -74.0080,
      address: 'City Mall'
    },
    nextStop: 'Train Station',
    estimatedArrival: '4 min',
    isActive: true,
    speed: 28,
    occupancy: 'medium',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    number: 'M-201',
    route: 'Metro Blue Line',
    operator: 'City Metro',
    type: 'metro',
    capacity: 200,
    currentLocation: {
      lat: 40.7400,
      lng: -73.9900,
      address: 'Shopping District'
    },
    nextStop: 'Bus Terminal',
    estimatedArrival: '6 min',
    isActive: true,
    speed: 50,
    occupancy: 'high',
    lastUpdated: new Date().toISOString()
  }
];

export const mockRoutes: Route[] = [
  {
    id: '1',
    name: 'Downtown Loop',
    color: '#3B82F6',
    frequency: 'Every 10 minutes',
    operatingHours: {
      start: '06:00',
      end: '23:00'
    },
    stops: [
      { id: 's1', name: 'City Hall', lat: 40.7128, lng: -74.0060 },
      { id: 's2', name: 'Main Street', lat: 40.7138, lng: -74.0070 },
      { id: 's3', name: 'City Center Plaza', lat: 40.7148, lng: -74.0080, isNext: true },
      { id: 's4', name: 'Shopping District', lat: 40.7158, lng: -74.0090 },
      { id: 's5', name: 'Central Park', lat: 40.7168, lng: -74.0100 }
    ]
  },
  {
    id: '2',
    name: 'University Route',
    color: '#10B981',
    frequency: 'Every 15 minutes',
    operatingHours: {
      start: '07:00',
      end: '22:00'
    },
    stops: [
      { id: 's6', name: 'University Gate', lat: 40.7589, lng: -73.9851 },
      { id: 's7', name: 'Student Union', lat: 40.7599, lng: -73.9861, isNext: true },
      { id: 's8', name: 'Library', lat: 40.7609, lng: -73.9871 },
      { id: 's9', name: 'Sports Complex', lat: 40.7619, lng: -73.9881 }
    ]
  }
];