'use client';

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
  const [searchValue, setSearchValue] = useState('');

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
      L.marker([dist.lat, dist.lng]).addTo(map.current!).bindPopup(`
        <strong>${dist.nome}</strong><br>
        ${dist.endereco}<br>
        ${dist.telefone}
      `);
    });

    L.marker([-7.225938, -39.329313], {
      autoPan: true,
      alt: 'São Geraldo',
    })
      .addTo(map.current!)
      .bindPopup(`São Geraldo`)
      .openPopup();

    if (distribuidores.length > 0) {
      const group = L.featureGroup(
        distribuidores.map((dist) => L.marker([dist.lat, dist.lng]))
      );

      if (map.current && searchValue) {
        map.current.fitBounds(group.getBounds());
      }
    }

    return () => {
      map.current?.remove();
    };
  }, [distribuidores]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') console.log('Buscar:', searchValue);
  };

  return (
    <section className="min-h-[521px] w-full px-4 lg:px-12">
      <div className="mt-8 mb-4 lg:hidden">
        <h4 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
          NOS ENCONTRE PERTO DE VOCÊ
        </h4>
      </div>

      <div className="flex flex-col items-center gap-6 lg:flex-row-reverse lg:gap-8">
        {/* Mapa */}
        <div
          ref={mapRef}
          className="z-0 h-[237px] w-full rounded-xl md:min-h-[500px] lg:ml-32 lg:min-h-[600px] lg:flex-2"
        />

        {/* Conteúdo */}
        <div className="w-full lg:flex lg:flex-2 lg:items-center lg:justify-center">
          <div className="flex w-full max-w-[500px] flex-col gap-4">
            <div className="mt-8 hidden lg:block">
              <h4 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
                NOS ENCONTRE
                <br />
                PERTO DE VOCÊ
              </h4>
            </div>
            {/*  */}
            <div className="flex justify-start p-0">
              <div className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Digite sua localização"
                    className="text-md focus:caret-caju-success-hover h-[45px] w-full rounded-full bg-[#ECE6F0] px-12 text-gray-800 placeholder-gray-500 focus:ring-2 focus:outline-none lg:h-[60px]"
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
                </div>
              </div>
            </div>

            <div className="hide-scrollbar flex cursor-grab gap-3 overflow-x-auto lg:max-h-[450px] lg:flex-col lg:overflow-y-auto">
              {distribuidores.map((dist, index) => (
                <div
                  className="font-inter min-w-[225px] rounded-lg border-2 border-gray-200 bg-[#D9D9D9] px-4 py-3 font-medium lg:max-w-[654px] [&_p]:text-[#454545]"
                  key={dist.id + index}
                >
                  <h6 className="text-caju-heading-primary mb-1 text-base font-bold">
                    {dist.nome}
                  </h6>
                  <p>{dist.endereco}</p>
                  <p>{dist.telefone}</p>
                </div>
              ))}
            </div>

            <div className="[&_button]:font-inter! mt-auto flex gap-3 [&_button]:h-[45px] [&_button]:text-[12px] [&_button]:font-medium!">
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
