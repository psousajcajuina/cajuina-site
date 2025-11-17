import React, { useCallback } from 'react';
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import type { Distribuidor } from '@/types';

// Cores do projeto Cajuína
const PIN_COLORS = {
  default: '#09863C', // caju-heading-primary (verde)
  hover: '#F4B013', // caju-heading-yellow (amarelo)
  selected: '#09863C', // mantém o verde quando selecionado
  border: '#00422a', // caju-primary-dark
  glyph: '#ffffffff', // branco
};

interface DistribuidorMarkerProps {
  distribuidor: Distribuidor;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: number | null) => void;
  onSelect: (
    id: number,
    marker: google.maps.marker.AdvancedMarkerElement
  ) => void;
  showInfoWindow: boolean;
  onInfoWindowClose: () => void;
}

export const DistribuidorMarker: React.FC<DistribuidorMarkerProps> = ({
  distribuidor,
  isHovered,
  isSelected,
  onHover,
  onSelect,
  showInfoWindow,
  onInfoWindowClose,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const position = { lat: distribuidor.lat, lng: distribuidor.lng };

  const handleClick = useCallback(() => {
    if (marker) {
      onSelect(distribuidor.id, marker);
    }
  }, [marker, onSelect, distribuidor.id]);

  const handleMouseEnter = useCallback(() => {
    onHover(distribuidor.id);
  }, [onHover, distribuidor.id]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  // Determina a cor do pin baseado no estado
  const pinBackground = isHovered ? PIN_COLORS.hover : PIN_COLORS.default;
  const scale = isHovered || isSelected ? 1.2 : 1;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="distribuidor-marker"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: AdvancedMarkerAnchorPoint.BOTTOM.join(' '),
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <Pin
          background={pinBackground}
          borderColor={PIN_COLORS.border}
          glyphColor={PIN_COLORS.glyph}
        />
      </AdvancedMarker>

      {showInfoWindow && marker && isSelected && (
        <InfoWindow
          anchor={marker}
          onCloseClick={onInfoWindowClose}
          headerDisabled={false}
        >
          <div className="p-2">
            <h3 className="text-caju-heading-primary mb-2 text-base font-bold">
              {distribuidor.nome}
            </h3>
            <p className="mb-1 text-sm">{distribuidor.endereco}</p>
            {distribuidor.telefone && (
              <p className="text-sm font-medium">{distribuidor.telefone}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default React.memo(DistribuidorMarker);
