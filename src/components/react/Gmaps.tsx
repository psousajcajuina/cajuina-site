import '@googlemaps/extended-component-library/react';
import { Suspense, useState } from 'react';
import type { Distribuidor } from '@/types';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from '@vis.gl/react-google-maps';
import { AutocompleteWebComponent } from './DistribuidoresMap/WebComponent';

// Raio de busca em graus (aproximadamente km)
const SEARCH_RADIUS = 0.5; // ~55km

interface Props {
  distribuidores: Distribuidor[];
  defaultPosition: google.maps.LatLngLiteral;
}

function MapController({
  defaultPosition,
  distribuidores,
  setSortedDistribuidores,
  setSelectedMarker,
  filterAndSortByLocation,
}: {
  defaultPosition: google.maps.LatLngLiteral;
  distribuidores: Distribuidor[];
  setSortedDistribuidores: (dists: Distribuidor[]) => void;
  setSelectedMarker: (id: number | null) => void;
  filterAndSortByLocation: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  const handlePlaceSelect = async (place: google.maps.places.Place | null) => {
    if (!place?.location || !map) return;

    const searchLat = place.location.lat();
    const searchLng = place.location.lng();

    map.panTo({ lat: searchLat, lng: searchLng });
    map.setZoom(18);

    filterAndSortByLocation(searchLat, searchLng);
  };

  const handleReset = () => {
    setSortedDistribuidores([]);
    setSelectedMarker(null);
    map?.panTo(defaultPosition);
    map?.setZoom(16);
  };

  return (
    <AutocompleteWebComponent
      onPlaceSelect={handlePlaceSelect}
      onReset={handleReset}
    />
  );
}

function Gmaps({ distribuidores, defaultPosition }: Props) {
  const [sortedDistribuidores, setSortedDistribuidores] = useState<
    Distribuidor[]
  >([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const map = useMap();

  const handleCardClick = (dist: Distribuidor) => {
    if (map) {
      map.panTo({ lat: dist.lat, lng: dist.lng });
      map.setZoom(18);
      setSelectedMarker(dist.id);
    }
  };

  const filterAndSortByLocation = (searchLat: number, searchLng: number) => {
    const nearby = distribuidores
      .map((dist) => ({
        ...dist,
        distance: Math.sqrt(
          Math.pow(dist.lat - searchLat, 2) + Math.pow(dist.lng - searchLng, 2)
        ),
      }))
      .filter((dist) => dist.distance <= SEARCH_RADIUS)
      .sort((a, b) => a.distance - b.distance);

    setSortedDistribuidores(nearby);

    if (nearby.length > 0 && map) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: searchLat, lng: searchLng });
      nearby
        .slice(0, 3)
        .forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
      map.fitBounds(bounds, 50);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setIsLoading(true);

    const randomDelay = Math.random() * 2000 + 1500;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          const { latitude, longitude } = position.coords;

          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
            map.setZoom(14);
          }

          filterAndSortByLocation(latitude, longitude);
          setIsLoading(false);
        }, randomDelay);
      },
      (error) => {
        setIsLoading(false);
        alert('Não foi possível obter sua localização: ' + error.message);
      }
    );
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
            className="h-full w-full rounded-xl"
            defaultCenter={defaultPosition}
            defaultZoom={16}
            gestureHandling="cooperative"
            mapTypeControl={false}
            mapId="DISTRIBUIDORES_MAP"
            // restriction={{
            //   latLngBounds: {
            //     north: 5.27,
            //     south: -33.75,
            //     west: -73.99,
            //     east: -28.84,
            //   },
            //   strictBounds: false,
            // }}
          >
            <AdvancedMarker position={defaultPosition}>
              <InfoWindow position={defaultPosition}>
                <strong>São Geraldo</strong>
              </InfoWindow>
            </AdvancedMarker>

            {distribuidores.map((dist) => (
              <AdvancedMarker
                key={dist.id}
                position={{ lat: dist.lat, lng: dist.lng }}
                onClick={() => setSelectedMarker(dist.id)}
              >
                {selectedMarker === dist.id && (
                  <InfoWindow position={{ lat: dist.lat, lng: dist.lng }}>
                    <div>
                      <strong>{dist.nome}</strong>
                      <br />
                      {dist.endereco}
                      <br />
                      {dist.telefone}
                    </div>
                  </InfoWindow>
                )}
              </AdvancedMarker>
            ))}
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

            {/* Search - Mobile */}
            <div className="flex justify-start p-0 lg:hidden">
              <MapController
                defaultPosition={defaultPosition}
                distribuidores={distribuidores}
                setSortedDistribuidores={setSortedDistribuidores}
                setSelectedMarker={setSelectedMarker}
                filterAndSortByLocation={filterAndSortByLocation}
              />
            </div>

            {/* Search - Desktop */}
            <div className="hidden justify-start p-0 lg:flex">
              <MapController
                defaultPosition={defaultPosition}
                distribuidores={distribuidores}
                setSortedDistribuidores={setSortedDistribuidores}
                setSelectedMarker={setSelectedMarker}
                filterAndSortByLocation={filterAndSortByLocation}
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="border-caju-heading-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                <span className="text-sm text-gray-600">
                  Buscando distribuidores próximos...
                </span>
              </div>
            )}

            {!isLoading && sortedDistribuidores.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-center text-gray-600">
                  Use sua localização para encontrar distribuidores próximos
                </p>
                <button
                  onClick={handleUseCurrentLocation}
                  className="btn-green px-6 py-3 whitespace-nowrap"
                  title="Usar minha localização"
                >
                  📍 Usar Minha Localização
                </button>
              </div>
            )}

            {!isLoading && sortedDistribuidores.length > 0 && (
              <div className="hide-scrollbar flex cursor-grab gap-2 overflow-x-auto lg:max-h-[450px] lg:flex-col lg:overflow-y-auto">
                {sortedDistribuidores.map((dist, index) => (
                  <div
                    className="font-inter min-w-[225px] cursor-pointer border-2 border-gray-200 bg-[#FEF7FF] px-4 py-1 font-medium hover:border-gray-300 hover:shadow-md lg:max-h-20 lg:max-w-[650px]"
                    key={dist.id + index}
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
}: Pick<Props, 'distribuidores'>) {
  const saoGeraldoPosition = { lat: -7.225938, lng: -39.329313 };

  return (
    <APIProvider
      language="pt-BR"
      apiKey={'NADA_POR_AQUI'}
    >
      <Gmaps
        distribuidores={distribuidores}
        defaultPosition={saoGeraldoPosition}
      />
    </APIProvider>
  );
}
