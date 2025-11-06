import '@googlemaps/extended-component-library/react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  onReset?: () => void;
}

export const AutocompleteWebComponent = ({ onPlaceSelect, onReset }: Props) => {
  useMapsLibrary('places');
  const ref = useRef<google.maps.places.PlaceAutocompleteElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (ev: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;

      // margem clicável do lado direito (ex: 40px)
      const clickableWidth = 40;

      // se o clique for no último pedacinho do input → "clear"
      if (x >= rect.width - clickableWidth && y >= 0 && y <= rect.height) {
        console.log('🧹 Clique detectado na área do botão de limpar');
        onPlaceSelect(null);
        onReset?.();
      }
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [onReset, onPlaceSelect]);

  async function handlePlaceSelect(place: google.maps.places.Place) {
    await place.fetchFields({
      fields: ['displayName', 'formattedAddress', 'location', 'viewport'],
    });
    onPlaceSelect(place);
  }

  return (
    <div className="relative w-full">
      <gmp-place-autocomplete
        ref={ref}
        includedRegionCodes={['br']}
        className="w-full rounded-lg border border-black bg-white text-black scheme-light shadow-sm focus:ring-2 focus:ring-blue-500"
        ongmp-select={(ev: any) => {
          void handlePlaceSelect(ev.placePrediction.toPlace());
        }}
        ongmp-placeselect={(ev: any) => {
          void handlePlaceSelect(ev.place);
        }}
      />
    </div>
  );
};
