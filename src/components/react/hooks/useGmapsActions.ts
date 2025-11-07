import type { Distribuidor } from '@/types';
import { useState, useRef } from 'react';

// Raio de busca em graus (aproximadamente km)
const SEARCH_RADIUS = 0.5; // ~55km

interface hookProps {
  distribuidores: Distribuidor[];
  map: google.maps.Map | null;
  setSortedDistribuidores: (dists: Distribuidor[]) => void;
  setSelectedMarker: (id: number | null) => void;
}

export default function useGmapsActions({
  map,
  distribuidores,
  setSortedDistribuidores,
  setSelectedMarker,
}: hookProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState<google.maps.LatLngLiteral | null>(null);
  // Rastreia a referência atual (localização ou busca)
  const currentReferencePoint = useRef<{ lat: number; lng: number } | null>(null);

  const handleCardClick = (dist: Distribuidor) => {
    if (map) {
      map.panTo({ lat: dist.lat, lng: dist.lng });
      map.setZoom(18);
      setSelectedMarker(dist.id);
    }
  };

  const handleRadiusFilterAndSort = (searchLat: number, searchLng: number) => {
  currentReferencePoint.current = { lat: searchLat, lng: searchLng };
  setSearchLocation({ lat: searchLat, lng: searchLng });

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

    if (!map) {
      return;
    }

    if (nearby.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      nearby.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });

      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 18) {
          map.setZoom(18);
        }
      });
      return;
    }

    if (nearby.length === 1) {
      const only = nearby[0];
      map.setCenter({ lat: only.lat, lng: only.lng });
      map.setZoom(16);
      return;
    }

    map.setCenter({ lat: searchLat, lng: searchLng });
    map.setZoom(12);
  };

  const resetFilters = () => {
  currentReferencePoint.current = null;
  setSearchLocation(null);
  setSortedDistribuidores([]);
  setSelectedMarker(null);
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    // Verifica permissão primeiro
      try {
        const permission = await navigator.permissions.query({
          name: 'geolocation',
        });

        if (permission.state === 'denied') {
          alert(
            'Você negou o acesso à localização. Por favor, habilite nas configurações do navegador.'
          );
          return;
        }
      } catch (error) {
        console.log(
          'Permissions API não disponível, tentando obter localização diretamente'
        );
      }

    setIsLoading(true);

    const randomDelay = Math.random() * 2000 + 1500;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          const { latitude, longitude } = position.coords;

          handleRadiusFilterAndSort(latitude, longitude);
          setIsLoading(false);
        }, randomDelay);
      },
      (error) => {
        setIsLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(
              'Você negou o acesso à localização. Por favor, habilite nas configurações do navegador.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Localização indisponível no momento.');
            break;
          case error.TIMEOUT:
            alert('Tempo esgotado ao obter localização.');
            break;
          default:
            alert('Não foi possível obter sua localização: ' + error.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  return {
    handleCardClick,
    handleUseCurrentLocation,
    handleRadiusFilterAndSort,
    resetFilters,
    searchLocation,
    isLoading,
  };
}
