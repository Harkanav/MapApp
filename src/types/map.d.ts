type coordinates = {
  latitude: number;
  longitude: number;
};

interface areaDetails {
  name: string; // Unique
  coordinates: coordinates[];
  totalArea: number;
}

type latLongMaxMin = {
  lat_min: number;
  lat_max: number;
  lng_min: number;
  lng_max: number;
};

type layerType = 'satellite' | 'hybrid' | 'standard' | 'terrain';
