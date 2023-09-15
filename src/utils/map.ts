// ----------------------------------------------- Center coordinates of the polygon
export const centerCoordOfPolygon = (
  coordinates: coordinates[],
): coordinates => {
  // console.log(coordinates[0]);
  const points = coordinates?.map((coordinate: any) => ({
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
  }));
  var first = points[0],
    last = points[points.length - 1];
  if (first.latitude !== last.latitude || first.longitude !== last.longitude) {
    points.push(first);
  }
  var twiceArea = 0,
    x = 0,
    y = 0,
    nPts = points.length,
    p1,
    p2,
    f;
  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = points[i];
    p2 = points[j];
    f =
      (p1.longitude - first.longitude) * (p2.latitude - first.latitude) -
      (p2.longitude - first.longitude) * (p1.latitude - first.latitude);
    twiceArea += f;
    x += (p1.latitude + p2.latitude - 2 * first.latitude) * f;
    y += (p1.longitude + p2.longitude - 2 * first.longitude) * f;
  }
  f = twiceArea * 3;
  return {
    latitude: x / f + first.latitude,
    longitude: y / f + first.longitude,
  };
};

// Display polygons which are on the screen. It checks center cooradinates of a polygon and display.
export const onRegionChange = (
  region: any,
  allAreas: areaDetails[],
): areaDetails[] => {
  let lat_min = region.latitude - region.latitudeDelta / 2;
  let lat_max = region.latitude + region.latitudeDelta / 2;

  let lng_min = region.longitude - region.longitudeDelta / 2;
  let lng_max = region.longitude + region.longitudeDelta / 2;

  let areaToDisplayTemporary = allAreas.slice();
  allAreas?.map(area => {
    const centerlatlong = centerCoordOfPolygon(area.coordinates);
    if (
      centerlatlong?.latitude >= lat_min &&
      centerlatlong?.latitude <= lat_max &&
      centerlatlong?.longitude >= lng_min &&
      centerlatlong?.longitude <= lng_max
    ) {
      if (areaToDisplayTemporary.findIndex(a => a.name == area.name) < 0) {
        areaToDisplayTemporary.push(area);
      }
    } else {
      if (areaToDisplayTemporary.findIndex(a => a.name == area.name) > -1) {
        areaToDisplayTemporary = areaToDisplayTemporary.filter(
          a => a.name != area.name,
        );
      }
    }
  });
  return areaToDisplayTemporary;
  // setAreaToDisplay(areaToDisplayTemporary);
  // console.log('93');
};
