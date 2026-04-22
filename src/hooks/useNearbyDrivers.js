// src/hooks/useNearbyDrivers.js
import { useQuery } from '@tanstack/react-query';
import { deliveryService } from '../services/deliveryService';

// Mock driver profile – half‑truck driver in Roma
const MOCK_DRIVER = {
  id: 101,
  name: 'Tsika Tsika',
  vehicle_type: 'Half‑Truck',
  lat: -29.4435,
  lng: 27.7155,
  distance: '0.3 km',
  eta: '5 mins',
  rating: 4.9,
  is_verified: true,
  can_carry_heavy: true,
};

export const useNearbyDrivers = (lat, lng, enabled = true) => {
  return useQuery({
    queryKey: ['nearbyDrivers', lat, lng],
    queryFn: async () => {
      try {
        const drivers = await deliveryService.getNearbyDrivers(lat, lng);
        // If backend returns empty, use mock
        if (!drivers || drivers.length === 0) {
          return [MOCK_DRIVER];
        }
        return drivers;
      } catch (error) {
        // On error, return mock driver
        console.warn('Using mock driver due to API error:', error);
        return [MOCK_DRIVER];
      }
    },
    enabled: enabled && !!lat && !!lng,
    refetchInterval: 30000, // refresh every 30 seconds
    staleTime: 10000,
  });
};
