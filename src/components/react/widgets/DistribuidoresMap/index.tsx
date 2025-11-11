import { useState } from 'react';
import type { Distribuidor } from '@/types';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { AutoCompleteSearchBox } from './AutoCompleteSearchBox';
import DistribuidorMarker from './DistribuidorMarker';
import DefaultLocationMarker from './DefaultLocationMarker';
import { useDistribuidorMarkers } from '../../hooks/useDistribuidorMarkers';
import useGmapsActions from '../../hooks/useGmapsActions';

interface Props {
  distribuidores: Distribuidor[];
  apiKey: string;
  defaultPosition: google.maps.LatLngLiteral & { placeId: string };
}

function Gmaps({ distribuidores, defaultPosition }: Omit<Props, 'apiKey'>) {
  const [sortedDistribuidores, setSortedDistribuidores] = useState<
    Distribuidor[]
  >([]);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const map = useMap();

  const {
    hoveredId,
    selectedId,
    handleMarkerHover,
    handleMarkerSelect,
    resetMarkers,
  } = useDistribuidorMarkers();

  const {
    handleCardClick,
    handleUseCurrentLocation,
    handlePlaceSelect,
    handleReset,
    isSearchLoading,
  } = useGmapsActions({
    map,
    defaultPosition,
    distribuidores,
    setSortedDistribuidores,
    onResetMarkers: resetMarkers,
    onSelectMarker: (id) => {
      handleMarkerSelect(id);
      setInfoWindowShown(true);
    },
  });

  const handleMarkerClick = (
    id: number,
    marker: google.maps.marker.AdvancedMarkerElement
  ) => {
    handleMarkerSelect(id);
    setInfoWindowShown((prev) => (selectedId === id ? !prev : true));

    if (map) {
      map.panTo({
        lat: marker.position!.lat as number,
        lng: marker.position!.lng as number,
      });
      map.setZoom(18);
    }
  };

  const handleInfoWindowClose = () => {
    setInfoWindowShown(false);
    handleMarkerSelect(null);

    // Volta para os bounds de todos os distribuidores
    if (map && sortedDistribuidores.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      sortedDistribuidores.forEach((d) =>
        bounds.extend({ lat: d.lat, lng: d.lng })
      );
      map.fitBounds(bounds, 90);

      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 18) {
          map.setZoom(18);
        }
      });
    }
  };

  const handleMapClick = () => {
    handleMarkerSelect(null);
    setInfoWindowShown(false);
  };

  return (
    <section className="min-h-[521px] w-full px-4 lg:px-12">
      <div className="mt-8 mb-4 lg:hidden">
        <h4 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
          Nos encontre perto de você
        </h4>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 lg:flex-row-reverse lg:gap-8">
        <div className="z-0 h-[237px] w-full rounded-xl md:min-h-[500px] lg:ml-32 lg:min-h-[600px] lg:flex-2">
          <Map
            onClick={handleMapClick}
            className="h-full w-full rounded-xl"
            defaultCenter={defaultPosition}
            defaultZoom={16}
            gestureHandling="cooperative"
            mapTypeControl={false}
            cameraControl={false}
            mapId="DISTRIBUIDORES_MAP"
          >
            {/* Renderiza markers apenas para distribuidores filtrados/selecionados */}
            {sortedDistribuidores.map((dist) => (
              <DistribuidorMarker
                key={`${dist.id}-${dist.lat}-${dist.lng}`}
                distribuidor={dist}
                isHovered={hoveredId === dist.id}
                isSelected={selectedId === dist.id}
                onHover={handleMarkerHover}
                onSelect={handleMarkerClick}
                showInfoWindow={infoWindowShown && selectedId === dist.id}
                onInfoWindowClose={handleInfoWindowClose}
              />
            ))}

            {/* Mostra marker da localização padrão apenas quando não há busca ativa */}
            {sortedDistribuidores.length === 0 && (
              <DefaultLocationMarker
                position={defaultPosition}
                placeId={defaultPosition.placeId}
              />
            )}
          </Map>
        </div>

        <div className="w-full lg:flex lg:flex-2 lg:items-center lg:justify-center">
          <div className="flex w-full flex-col gap-4">
            <div className="mt-8 hidden lg:block">
              <h4 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
                Nos encontre
                <br />
                perto de você
              </h4>
            </div>

            {/* Search */}
            <div className="flex justify-start p-0">
              <AutoCompleteSearchBox
                onPlaceSelect={handlePlaceSelect}
                onReset={handleReset}
              />
            </div>

            {isSearchLoading && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="border-caju-heading-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                <span className="text-sm text-gray-600">
                  Buscando distribuidores próximos...
                </span>
              </div>
            )}

            {!isSearchLoading && sortedDistribuidores.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-center">
                  Use sua localização para encontrar distribuidores próximos
                </p>
                <button
                  onClick={handleUseCurrentLocation}
                  className="btn-green px-6 py-3 whitespace-nowrap lg:text-base"
                  title="Usar minha localização"
                >
                  📍 Usar Minha Localização
                </button>
              </div>
            )}

            {!isSearchLoading && sortedDistribuidores.length > 0 && (
              <div className="hide-scrollbar flex cursor-grab gap-2 overflow-x-auto lg:max-h-[450px] lg:flex-col lg:overflow-y-auto">
                {sortedDistribuidores.map((dist, index) => (
                  <div
                    className="font-inter min-w-[225px] cursor-pointer border-2 border-gray-200 bg-[#FEF7FF] px-4 py-1 font-medium hover:border-gray-300 hover:shadow-md lg:max-h-20 lg:max-w-[650px]"
                    key={dist.id + dist.lat + dist.nome}
                    onClick={() => handleCardClick(dist)}
                  >
                    <h6 className="text-caju-heading-primary mb-0! text-base font-bold">
                      {dist.nome}
                    </h6>
                    <p>{dist.endereco}</p>
                    <p>{dist.telefone}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="[&_button]:font-inter! mt-auto flex gap-3 [&_button]:h-[45px] [&_button]:text-xs [&_button]:font-medium [&_button]:lg:h-[65px] [&_button]:lg:text-xl">
              <button className="btn-green px-6">VER MAIS</button>
              <button className="btn-yellow flex-1">
                SEJA UM DISTRIBUIDOR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DistribuidoresGmaps({
  distribuidores = [],
  apiKey,
}: Omit<Props, 'defaultPosition'>) {
  const saoGeraldoPosition = {
    lat: -7.225938,
    lng: -39.329313,
    placeId: 'ChIJ4ySFSl2CoQcR3LgbM8Nx8_U',
  };

  return (
    <APIProvider
      language="pt-BR"
      apiKey={apiKey}
      libraries={['marker', 'places']}
      region="BR"
      version="beta"
    >
      <Gmaps
        distribuidores={distribuidores}
        defaultPosition={saoGeraldoPosition}
      />
    </APIProvider>
  );
}
