import React from 'react';
import {MapContextProvider} from './MapContext';
import MapScreen from './MapScreen';

const MapCompleteScreen = () => {
  return (
    <MapContextProvider>
      <MapScreen />
    </MapContextProvider>
  );
};

export default MapCompleteScreen;
