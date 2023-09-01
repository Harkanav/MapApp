type RootStackParamList = {
  MapScreen: undefined;
};

interface onPressCoordinates {
  latitude: number;
  longitude: number;
}

interface areaDetails {
  name: string; // Unique
  coordinates: onPressCoordinates[];
  totalArea: number;
}

// interface coordinateType {
//   lat: onPressCoordinates.latitude;
//   lon: onPressCoordinates.longitude;
//   totalArea: number;
// }
