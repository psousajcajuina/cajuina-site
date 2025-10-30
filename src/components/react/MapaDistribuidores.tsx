'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Virtual } from 'swiper/modules';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import type { Distribuidor } from '@/types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
    }).addTo(map.current!).bindPopup(`
      <strong>São Geraldo</strong>
    `);

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
    <section className="h-[521px] w-full">
      <div className="mt-8 mb-4">
        <h4 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
          NOS ENCONTRE PERTO DE VOCÊ
        </h4>
      </div>

      <div ref={mapRef} className="z-0 h-[237px] w-full md:h-[500px]" />

      <div className="my-2 flex justify-center p-2">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearch}
              placeholder="Digite sua localização"
              className="text-md focus:caret-caju-success-hover w-full rounded-full bg-[#ECE6F0] px-12 py-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:outline-none"
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

      <Swiper
        modules={[Virtual, Navigation, Pagination, Autoplay]}
        slidesPerView={2}
        // centeredSlides={true}
        spaceBetween={2}
        autoplay
        virtual
        className="h-[107px]"
      >
        {distribuidores.map((dist) => (
          <SwiperSlide
            className="font-inter w-[225px] rounded-lg border-2 border-gray-200 bg-[#D9D9D9] px-4 py-3 font-medium [&_p]:text-[#454545]"
            key={dist.id}
          >
            <h6 className="text-caju-heading-primary mb-1 text-base font-bold">
              {dist.nome}
            </h6>
            <p>{dist.endereco}</p>
            <p>{dist.telefone}</p>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="[&_button]:font-inter! relative mx-auto flex max-w-7xl justify-center gap-3 [&_button]:h-[45px] [&_button]:text-[12px] [&_button]:font-medium!">
        <button className="btn-green w-[117px]">Ver Mais</button>
        <button className="btn-yellow w-[239px]">Seja um Distribuidor</button>
      </div>
    </section>
  );
}
