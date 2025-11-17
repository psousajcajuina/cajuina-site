import { useState, useCallback } from 'react';

interface MarkerState {
  hoveredId: number | null;
  selectedId: number | null;
}

export function useDistribuidorMarkers() {
  const [markerState, setMarkerState] = useState<MarkerState>({
    hoveredId: null,
    selectedId: null,
  });

  const handleMarkerHover = useCallback((id: number | null) => {
    setMarkerState((prev) => ({ ...prev, hoveredId: id }));
  }, []);

  const handleMarkerSelect = useCallback((id: number | null) => {
    setMarkerState((prev) => ({ ...prev, selectedId: id }));
  }, []);

  const resetMarkers = useCallback(() => {
    setMarkerState({ hoveredId: null, selectedId: null });
  }, []);

  const isMarkerHovered = useCallback(
    (id: number) => markerState.hoveredId === id,
    [markerState.hoveredId]
  );

  const isMarkerSelected = useCallback(
    (id: number) => markerState.selectedId === id,
    [markerState.selectedId]
  );

  return {
    hoveredId: markerState.hoveredId,
    selectedId: markerState.selectedId,
    handleMarkerHover,
    handleMarkerSelect,
    resetMarkers,
    isMarkerHovered,
    isMarkerSelected,
  };
}
