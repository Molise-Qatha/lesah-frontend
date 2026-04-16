import { useQuery } from '@tanstack/react-query';
import { deliveryService } from '../services/deliveryService';

export const useNearbyDrivers = (lat, lng, enabled = true) => {
  return useQuery({
    queryKey: ['nearbyDrivers', lat, lng],
    queryFn: () => deliveryService.getNearbyDrivers(lat, lng),
    enabled: enabled && !!lat && !!lng,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });
};