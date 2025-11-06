import React from 'react';
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import { AutocompleteWebComponent } from './WebComponent';

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
};

const AutocompleteControl = ({
  controlPosition,
  onPlaceSelect,
}: CustomAutocompleteControlProps) => {

  return (
    <MapControl position={controlPosition}>
        <AutocompleteWebComponent onPlaceSelect={onPlaceSelect} />
    </MapControl>
  );
};

export default React.memo(AutocompleteControl);
