type onPressCoordinates = {
  latitude: number;
  longitude: number;
};

interface areaDetails {
  name: string; // Unique
  coordinates: onPressCoordinates[];
  totalArea: number;
}

type layerType = 'satellite' | 'hybrid' | 'standard' | 'terrain';
