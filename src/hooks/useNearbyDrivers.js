// src/hooks/useNearbyDrivers.js
import { useQuery } from '@tanstack/react-query';
import { deliveryService } from '../services/deliveryService';

// Mock drivers for testing / fallback (5 drivers)
const MOCK_DRIVERS = [
  {
    id: 101,
    name: 'Thabo Mokoena',
    vehicle_type: 'Half‑Truck',
    lat: -29.4435,
    lng: 27.7155,
    distance: '0.3 km',
    eta: '5 mins',
    rating: 4.9,
    is_verified: true,
  },
  {
    id: 102,
    name: 'Mpho Letsie',
    vehicle_type: 'Van',
    lat: -29.4410,
    lng: 27.7120,
    distance: '0.8 km',
    eta: '8 mins',
    rating: 4.7,
    is_verified: true,
  },
  {
    id: 103,
    name: 'Lerato Moahloli',
    vehicle_type: 'Motorcycle',
    lat: -29.4460,
    lng: 27.7180,
    distance: '1.2 km',
    eta: '10 mins',
    rating: 4.8,
    is_verified: true,
  },
  {
    id: 104,
    name: 'Kananelo Khanyapa',
    vehicle_type: 'Sedan',
    lat: -29.4400,
    lng: 27.7200,
    distance: '1.5 km',
    eta: '12 mins',
    rating: 4.6,
    is_verified: true,
  },
  {
    id: 105,
    name: 'Tumelo Mofolo',
    vehicle_type: 'Bakkie',
    lat: -29.4480,
    lng: 27.7100,
    distance: '1.8 km',
    eta: '15 mins',
    rating: 4.5,
    is_verified: true,
  },
];

export const useNearbyDrivers = (lat, lng, enabled = true) => {
  return useQuery({
    queryKey: ['nearbyDrivers', lat, lng],
    queryFn: async () => {
      try {
        const drivers = await deliveryService.getNearbyDrivers(lat, lng);
        if (!drivers || drivers.length === 0) {
          return MOCK_DRIVERS;
        }
        return drivers;
      } catch (error) {
        console.warn('Using mock drivers due to API error:', error);
        return MOCK_DRIVERS;
      }
    },
    enabled: enabled && !!lat && !!lng,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};
