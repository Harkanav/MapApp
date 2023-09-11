import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {useMapContext} from '../MapContext';
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps';

const PolygonsToDisplay = () => {
  const {areaToDisplay, centerCoordOfPolygon} = useMapContext();
  return useMemo(
    () =>
      areaToDisplay?.map((area, index) => (
        <View key={index}>
          <Polygon
            coordinates={area.coordinates}
            // Setting random color of the polygon.
            fillColor={'#2f95fe5b'}
            strokeWidth={0.5}></Polygon>
          <Marker
            coordinate={centerCoordOfPolygon(area.coordinates)}
            anchor={{x: 0.5, y: 0.5}}>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: 10,
                padding: 4,
              }}>
              <Text
                style={{
                  color: '#333',
                  fontSize: 20,
                }}>
                {' ' + area.name + ' '}
              </Text>
            </View>
          </Marker>
        </View>
      )),
    [areaToDisplay],
  );
};

export default PolygonsToDisplay;

const styles = StyleSheet.create({});
