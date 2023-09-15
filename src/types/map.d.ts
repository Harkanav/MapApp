type coordinates = {
  latitude: number;
  longitude: number;
};

interface areaDetails {
  name: string; // Unique
  coordinates: coordinates[];
  totalArea: number;
}

type layerType = 'satellite' | 'hybrid' | 'standard' | 'terrain';
