import { useQuery } from "@tanstack/react-query"
import { trackingService } from "../services/tracking.service"
import { queryKeys } from "@/lib/query-keys"

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.tracking.dashboard,
    queryFn: trackingService.getDashboard,
  })
}
