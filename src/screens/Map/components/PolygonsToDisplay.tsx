import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {useMapContext} from '../MapContext';
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps';

const PolygonsToDisplay = () => {
  const {areaToDisplay, centerCoordOfPolygon} = useMapContext();

  return areaToDisplay?.map((area, index) => {
    const center = centerCoordOfPolygon(area.coordinates);

    return (
      <View key={index + area.name}>
        <Polygon
          coordinates={area.coordinates}
          // Setting random color of the polygon.
          fillColor={'#2f95fe5b'}
          strokeWidth={0.5}
        />
        <Marker coordinate={center} anchor={{x: 0.5, y: 0.5}}>
          <View
            style={{
              backgroundColor: '#22963f8b',
              // backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: 10,
              padding: 4,
            }}>
            <Text
              style={{
                color: 'white',

                fontSize: 18,
              }}>
              {' ' + area.name + ' '}
            </Text>
          </View>
        </Marker>
      </View>
    );
  });
};

export default PolygonsToDisplay;
