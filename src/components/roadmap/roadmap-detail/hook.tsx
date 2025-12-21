import { useRoadmapDetail } from '@/hooks/queries/roadmap-hooks'
import type { UUID } from '@/types'

export const useRoadmapDetailComponent = (roadmapId: UUID) => {
  // Data fetching
  const { data: roadmapData, isLoading, error } = useRoadmapDetail(roadmapId)
  const roadmap = roadmapData?.data?.roadmap

  return {
    // Data
    roadmap,
    isLoading,
    error,
  }
}
