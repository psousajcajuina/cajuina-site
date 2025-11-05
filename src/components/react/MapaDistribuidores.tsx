import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import type { Distribuidor } from '@/types';

interface Props {
  distribuidores?: Distribuidor[];
}

export default function MapaDistribuidores({ distribuidores = [] }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortedDistribuidores, setSortedDistribuidores] =
    useState(distribuidores);

  useEffect(() => {
    setSortedDistribuidores(distribuidores);
  }, [distribuidores]);

  useEffect(() => {
    if (!mapRef.current) return;

    const DefaultIcon = L.icon({
      iconUrl: icon.src,
      iconRetinaUrl: iconRetina.src,
      shadowUrl: iconShadow.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    map.current = L.map(mapRef.current).setView([-7.225938, -39.329313], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 25,
    }).addTo(map.current);

    distribuidores.forEach((dist) => {
      const marker = L.marker([dist.lat, dist.lng]).addTo(map.current!)
        .bindPopup(`
        <strong>${dist.nome}</strong><br>
        ${dist.endereco}<br>
        ${dist.telefone}
      `);
      markersRef.current.set(dist.id, marker);
    });

    L.marker([-7.225938, -39.329313], {
      autoPan: true,
      alt: 'São Geraldo',
    })
      .addTo(map.current!)
      .bindPopup(`São Geraldo`)
      .openPopup();

    return () => {
      map.current?.remove();
      markersRef.current.clear();
    };
  }, [distribuidores]);

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue + ', Juazeiro do Norte, CE, Brasil')}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const searchLat = parseFloat(lat);
          const searchLng = parseFloat(lon);

          if (map.current) {
            map.current.setView([searchLat, searchLng], 14);

            // Encontrar distribuidores próximos e ordenar
            const nearby = distribuidores
              .map((dist) => ({
                ...dist,
                distance: Math.sqrt(
                  Math.pow(dist.lat - searchLat, 2) +
                    Math.pow(dist.lng - searchLng, 2)
                ),
              }))
              .sort((a, b) => a.distance - b.distance);

            // Atualizar a lista ordenada
            setSortedDistribuidores(nearby);

            if (nearby.length > 0) {
              const bounds = L.latLngBounds([
                [searchLat, searchLng],
                ...nearby
                  .slice(0, 3)
                  .map((d) => [d.lat, d.lng] as [number, number]),
              ]);
              map.current.fitBounds(bounds, { padding: [50, 50] });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar localização:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setSortedDistribuidores(distribuidores);
    if (map.current) {
      // Voltar para a localização da Cajuina (São Geraldo)
      map.current.setView([-7.225938, -39.329313], 16);

      // Reabrir o popup da Cajuina
      const marker = L.marker([-7.225938, -39.329313]);
      if (marker) {
        setTimeout(() => {
          map.current?.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              const popup = layer.getPopup();
              if (
                popup &&
                popup.getContent()?.toString().includes('São Geraldo')
              ) {
                layer.openPopup();
              }
            }
          });
        }, 100);
      }
    }
  };

  const handleCardClick = (dist: Distribuidor) => {
    if (map.current) {
      map.current.setView([dist.lat, dist.lng], 18, {
        animate: true,
        duration: 1,
      });

      const marker = markersRef.current.get(dist.id);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <section className="min-h-[521px] w-full px-4 lg:px-12">
      <div className="mt-8 mb-4 lg:hidden">
        <h4 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
          Nos encontre perto de você
        </h4>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 lg:flex-row-reverse lg:gap-8">
        {/* Mapa */}
        <div
          ref={mapRef}
          className="z-0 h-[237px] w-full rounded-xl md:min-h-[500px] lg:ml-32 lg:min-h-[600px] lg:flex-2"
        />

        {/* Conteúdo */}
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
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Digite sua localização"
                  disabled={isSearching}
                  className="text-md focus:caret-caju-success-hover h-[45px] w-full rounded-full bg-[#ECE6F0] px-12 pr-12 text-gray-800 placeholder-gray-500 focus:ring-2 focus:outline-none disabled:opacity-50 lg:h-[60px]"
                />
                <svg
                  className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchValue && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700"
                    aria-label="Limpar busca"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

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
