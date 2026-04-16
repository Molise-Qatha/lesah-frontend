// src/hooks/useDeliveryTracking.js
import { useQuery } from '@tanstack/react-query';
import { deliveryService } from '../services/deliveryService';

export const useDeliveryTracking = (trackingId, enabled = true) => {
  return useQuery({
    queryKey: ['tracking', trackingId],
    queryFn: () => deliveryService.getTrackingStatus(trackingId),
    enabled: enabled && !!trackingId,
    refetchInterval: (data) => {
      // Stop refetching when delivery is completed
      if (data?.status === 'delivered') return false;
      return 15000; // refresh every 15 seconds otherwise
    },
    staleTime: 5000,
  });
};