import React from 'react';
import {MapContextProvider} from './MapContext';
import MapScreen from './screens/MapScreen';

const MapCompleteScreen = () => {
  return (
    <MapContextProvider>
      <MapScreen />
    </MapContextProvider>
  );
};

export default MapCompleteScreen;
