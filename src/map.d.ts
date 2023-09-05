// type RootStackParamList = {
//   AreaCard: {item: areaDetails};
// };

type onPressCoordinates = {
  latitude: number;
  longitude: number;
};

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
