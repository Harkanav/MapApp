import Config from 'react-native-config';
import axios from 'axios';
import {get, capitalize} from 'lodash';

export const googleMapApiKey = Config.GOOGLE_MAPS_API_KEY;
export const melissaApiKey = Config.MELISSA_API_KEY;

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

// Return value of maximum and minimum latitude and longitude of the current screen.
export const regionOnScreen = (region: any): latLongMaxMin => {
  let lat_min = region.latitude - region.latitudeDelta / 2;
  let lat_max = region.latitude + region.latitudeDelta / 2;

  let lng_min = region.longitude - region.longitudeDelta / 2;
  let lng_max = region.longitude + region.longitudeDelta / 2;
  return {lat_min, lat_max, lng_min, lng_max};
};

// Check whether the latlong is on the screen or not.
export const coordinatesOnScreen = (
  centerlatlong: coordinates,
  latLongMaxMin: latLongMaxMin,
): boolean => {
  if (
    centerlatlong?.latitude >= latLongMaxMin.lat_min &&
    centerlatlong?.latitude <= latLongMaxMin.lat_max &&
    centerlatlong?.longitude >= latLongMaxMin.lng_min &&
    centerlatlong?.longitude <= latLongMaxMin.lng_max
  ) {
    return true;
  } else {
    return false;
  }
};

// Display polygons which are on the screen. It checks center cooradinates of a polygon and display.
export const onRegionChange = (
  region: any,
  allAreas: areaDetails[],
): areaDetails[] => {
  const {lat_min, lat_max, lng_min, lng_max} = regionOnScreen(region);

  let areaToDisplayTemporary = allAreas.slice();
  allAreas?.map(area => {
    const centerlatlong = centerCoordOfPolygon(area.coordinates);
    if (
      coordinatesOnScreen(centerlatlong, {lat_min, lat_max, lng_min, lng_max})
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

export const getStreetViewURL = (coordinates: coordinates) => {
  // console.log(
  //   `https://maps.googleapis.com/maps/api/streetview?size=400x400&fov=80&heading=70&pitch=0&key=${googleMapApiKey}&location=${coordinates.latitude},${coordinates.longitude}`,
  // );
  return `https://maps.googleapis.com/maps/api/streetview?size=400x400&fov=80&heading=70&pitch=0&key=${googleMapApiKey}&location=${coordinates.latitude},${coordinates.longitude}`;
};

export const formatAddressDetail = (details: any) => {
  let county = '';
  let city = '';
  let country = '';
  let state = '';
  let postal = '';
  if (details) {
    const address_comp = details?.address_components;
    if (address_comp) {
      for (const c of address_comp) {
        const types: Array<string> = c.types;
        if (
          !city &&
          (types.includes('locality') ||
            types.includes('sublocality') ||
            types.includes('sublocality_level_1') ||
            types.includes('postal_town') ||
            types.includes('administrative_area_level_3'))
        ) {
          city = c.short_name;
        }

        if (types.includes('administrative_area_level_1')) {
          state = c.short_name;
        } else if (types.includes('administrative_area_level_2')) {
          county = c.short_name;
        } else if (types.includes('country')) {
          country = c.short_name;
        } else if (types.includes('postal_code')) {
          postal = c.short_name;
        }
      }
      const address_arr = details?.formatted_address?.split(', ');
      const address = address_arr.slice(0, address_arr.length - 3).join(', ');
      const formattedAddress =
        (address ? address + ', ' : '') +
        (city ? city + ', ' : '') +
        (state ? state + ', ' : '') +
        country;

      return {
        placeId: details?.place_id,
        address,
        formattedAddress: formattedAddress,
        city,
        county,
        country,
        state,
        zipcode: postal,
        latitude: parseFloat(details?.geometry?.location?.lat?.toFixed(8)),
        longitude: parseFloat(details?.geometry?.location?.lng?.toFixed(8)),
      };
    }
  }
};

export const getAddresFromLatlong = async (coordinates: coordinates) => {
  // console.log(coordinates);
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json' +
        '?sensor=false' +
        `&key=${googleMapApiKey}` +
        `&latlng=${coordinates.latitude},${coordinates.longitude}`,
    );
    // console.log(response);

    const result = get(response, 'data.results')[0];
    if (result) {
      // console.log(result);
      return formatAddressDetail(result);
    }
    return null;
  } catch (error) {
    console.log('Error in getting address from coordinates. ', error);
    return null;
  }
};

export const parseMelissaData = (data: any) => {
  let marketValue = get(data, 'EstimatedValue.EstimatedValue', '');
  if (!marketValue) {
    marketValue = get(data, 'Tax.MarketValueTotal', '');
  }

  return {
    first_name: capitalize(get(data, 'PrimaryOwner.Name1First', '')),
    last_name: capitalize(get(data, 'PrimaryOwner.Name1Last', '')),
    year_built: get(data, 'PropertyUseInfo.YearBuilt', ''),
    area_sqft: get(data, 'PropertySize.AreaBuilding', ''),
    market_value: marketValue,
    // sale_date: salesDate,
    // years_of_living: yearsOfLiving,
    owned_or_rented: 'Unknown',
    // date_data_collected: now('YYYY-MM-DD HH:mm:ss.SSSSSSZ'),
  };
};

export const getMelissaData = async (address: string) => {
  const baseUrl = 'https://property.melissadata.net/v4/WEB/LookupProperty/';
  // eslint-disable-next-line no-useless-escape
  // console.log(address);
  const melissa_address = address.replace(/\,US, USA|\, United States/gi, '');
  // console.log(melissa_address);

  const params = {
    id: melissaApiKey,
    format: 'json',
    ff: melissa_address,
    cols: 'GrpPrimaryOwner',
  };
  // console.log(params, 229);

  try {
    const {data} = await axios.get(baseUrl, {params});
    // console.log(data);
    let record = data.Records ? data.Records[0] : null;
    if (!record || !record.PrimaryOwner) {
      record = null;
    }
    return record ? parseMelissaData(record) : record;
  } catch (e) {
    console.log(e);
    return null;
  }
};
