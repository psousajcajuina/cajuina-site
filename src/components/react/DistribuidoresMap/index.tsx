import '@googlemaps/extended-component-library/react';
import { useCallback, useState } from 'react';
import type { Distribuidor } from '@/types';
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  APIProvider,
  CollisionBehavior,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  type AdvancedMarkerProps,
} from '@vis.gl/react-google-maps';
import { AutoCompleteSearchBox } from './AutoCompleteSearchBox';
import useGmapsActions from './hooks/useGmapsActions';
import React from 'react';

interface Props {
  distribuidores: Distribuidor[];
  apiKey: string;
  defaultPosition: google.maps.LatLngLiteral;
}
export type MapAnchorPointName = keyof typeof AdvancedMarkerAnchorPoint;
export type MarkerType = 'default' | 'pin' | 'html';
//
type MarkerData = Array<{
  id: string;
  position: google.maps.LatLngLiteral;
  type: MarkerType;
  zIndex: number;
  infowindowContent?: string;
}>;
export const textSnippets = {
  default: 'This is a default AdvancedMarkerElement without custom content',
  pin: 'This is a AdvancedMarkerElement with custom pin-style marker',
  html: 'This is a AdvancedMarkerElement with custom HTML content',
} as const;
export function getData() {
  const data: MarkerData = [];

  // create 50 random markers
  for (let index = 0; index < 50; index++) {
    const type =
      Math.random() < 0.1 ? 'default' : Math.random() < 0.5 ? 'pin' : 'html';

    data.push({
      id: String(index),
      position: { lat: rnd(53.52, 53.63), lng: rnd(9.88, 10.12) },
      zIndex: index,
      type,
    });
  }

  return data;
}

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
const data = getData();

// #####
export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};
// #####

function Gmaps({ distribuidores, defaultPosition }: Omit<Props, 'apiKey'>) {
  const [sortedDistribuidores, setSortedDistribuidores] = useState<
    Distribuidor[]
  >([]);
  const [selectedMarker, setSelectedMarker] = useState<
    number | null | google.maps.marker.AdvancedMarkerElement
  >(null);
  const [anchorPoint, setAnchorPoint] = useState(
    'LEFT_CENTER' as MapAnchorPointName
  );
  //
  const map = useMap();
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
    setSelectedMarker,
  });
  //
  const [markers] = useState(data);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [infowindowContent, setInfowindowContent] = useState<string | null>(
    null
  );
  //

  // A common pattern for applying z-indexes is to sort the markers
  // by latitude and apply a default z-index according to the index position
  // This usually is the most pleasing visually. Markers that are more "south"
  // thus appear in front.
  const Z_INDEX_SELECTED = distribuidores.length;
  const Z_INDEX_HOVER = distribuidores.length + 1;

  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (
      id: string | null,
      marker?: google.maps.marker.AdvancedMarkerElement,
      type?: MarkerType
    ) => {
      setSelectedId(id);

      if (marker) {
        setSelectedMarker(marker);
      }

      setInfowindowContent(type ? textSnippets[type] : null);

      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown((isShown) => !isShown);
      }
    },
    [selectedId]
  );
  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedMarker(null);
  }, []);
  const handleInfowindowCloseClick = useCallback(
    () => setInfoWindowShown(false),
    []
  );

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
            onClick={onMapClick}
            className="h-full w-full rounded-xl"
            defaultCenter={defaultPosition}
            defaultZoom={16}
            gestureHandling="cooperative"
            mapTypeControl={false}
            cameraControl={false}
            mapId="DISTRIBUIDORES_MAP"
          >
            {/* <AdvancedMarker position={defaultPosition}>
              <InfoWindow position={defaultPosition}>
                <strong>São Geraldo</strong>
              </InfoWindow>
            </AdvancedMarker> */}

            {/* {distribuidores.map((dist) => (
              <AdvancedMarker
                key={dist.id + dist.lng + dist.nome}
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
            ))} */}
            {markers.map(({ id, zIndex: zIndexDefault, position, type }) => {
              let zIndex = zIndexDefault;

              if (hoverId === id) {
                zIndex = Z_INDEX_HOVER;
              }

              if (selectedId === id) {
                zIndex = Z_INDEX_SELECTED;
              }

              if (type === 'default') {
                return (
                  <AdvancedMarkerWithRef
                    key={id}
                    zIndex={zIndex}
                    position={position}
                    onMarkerClick={(marker) => onMarkerClick(id, marker, type)}
                    onMouseEnter={() => onMouseEnter(id)}
                    onMouseLeave={onMouseLeave}
                  />
                );
              }

              if (type === 'pin') {
                return (
                  <AdvancedMarkerWithRef
                    onMarkerClick={(
                      marker: google.maps.marker.AdvancedMarkerElement
                    ) => onMarkerClick(id, marker, type)}
                    onMouseEnter={() => onMouseEnter(id)}
                    onMouseLeave={onMouseLeave}
                    key={id}
                    zIndex={zIndex}
                    className="custom-marker"
                    style={{
                      transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                      transformOrigin:
                        AdvancedMarkerAnchorPoint['BOTTOM'].join(' '),
                    }}
                    position={position}
                  >
                    <Pin
                      background={selectedId === id ? '#22ccff' : 'orange'}
                      borderColor={selectedId === id ? '#1e89a1' : null}
                      glyphColor={selectedId === id ? '#0f677a' : null}
                    />
                  </AdvancedMarkerWithRef>
                );
              }

              if (type === 'html') {
                return (
                  <React.Fragment key={id}>
                    <AdvancedMarkerWithRef
                      position={position}
                      zIndex={zIndex}
                      anchorPoint={AdvancedMarkerAnchorPoint[anchorPoint]}
                      className="custom-marker"
                      style={{
                        transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                        transformOrigin:
                          AdvancedMarkerAnchorPoint[anchorPoint].join(' '),
                      }}
                      onMarkerClick={(
                        marker: google.maps.marker.AdvancedMarkerElement
                      ) => {
                        onMarkerClick(id, marker, type);
                      }}
                      onMouseEnter={() => onMouseEnter(id)}
                      collisionBehavior={
                        CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                      }
                      onMouseLeave={onMouseLeave}
                    >
                      <div
                        className={`custom-html-content ${selectedId === id ? 'selected' : ''}`}
                      ></div>
                    </AdvancedMarkerWithRef>

                    {/* anchor point visualization marker */}
                    <AdvancedMarkerWithRef
                      onMarkerClick={(
                        marker: google.maps.marker.AdvancedMarkerElement
                      ) => onMarkerClick(id, marker)}
                      zIndex={zIndex + 1}
                      onMouseEnter={() => onMouseEnter(id)}
                      onMouseLeave={onMouseLeave}
                      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                      position={position}
                    >
                      <div className="visualization-marker"></div>
                    </AdvancedMarkerWithRef>
                  </React.Fragment>
                );
              }
            })}

            {infoWindowShown && selectedMarker && (
              <InfoWindow
                headerDisabled={true}
                anchor={
                  selectedMarker as google.maps.marker.AdvancedMarkerElement
                }
                pixelOffset={[0, -2]}
                onCloseClick={handleInfowindowCloseClick}
              >
                <h2>Marker {selectedId}</h2>
                <p>{infowindowContent}</p>
              </InfoWindow>
            )}
          </Map>
          {/* <ControlPanel
            anchorPointName={anchorPoint}
            onAnchorPointChange={(newAnchorPoint: AnchorPointName) =>
              setAnchorPoint(newAnchorPoint)
            }
          /> */}
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
  const saoGeraldoPosition = { lat: -7.225938, lng: -39.329313 };

  return (
    <APIProvider language="pt-BR" apiKey={apiKey} libraries={['marker']}>
      <Gmaps
        distribuidores={distribuidores}
        defaultPosition={saoGeraldoPosition}
      />
    </APIProvider>
  );
}
