import {Dimensions, StyleSheet, View, StatusBar} from 'react-native';
import React, {useMemo, useEffect} from 'react';
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps';
import {Text} from 'react-native-paper';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMapContext} from '../MapContext';
import AreaList from '../components/AreaList';
import AreaModal from '../components/AreaModal';
import AllIcons from '../components/AllIcons';
import PolygonsToDisplay from '../components/PolygonsToDisplay';

// type MapScreenProps = NativeStackScreenProps<RootStackParamList, 'MapScreen'>;

const {height} = Dimensions.get('window');

const MapScreen = () => {
  // ------------------------------------ Variables Declared

  const {
    onPressCoordinates,
    setOnPressCoordinates,
    drawPolygon,
    setAllAreas,
    areaToDisplay,
    mapViewRef,
    centerCoordOfPolygon,
  } = useMapContext();

  // ----------------------------------------^ Variables declated

  // console.log(onPressCoordinates);

  useEffect(() => {
    const retreiveData = async () => {
      const allData = await AsyncStorage.getItem('allAreas');
      const allDataArray = allData && JSON.parse(allData);
      if (Array.isArray(allDataArray)) {
        setAllAreas(allDataArray);
      } else {
        setAllAreas([]);
      }
    };
    retreiveData();
  }, []);

  // console.log(getArea());

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar animated={true} />
      <BottomSheetModalProvider>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {/* // ---------------------------------------------------- Modal */}
          <AreaModal />
          {/* ---------------------------------------------------- Icons over map */}
          <AllIcons />
          {/* ---------------------------------------------------- MapView */}
          <MapView
            loadingEnabled={true}
            ref={mapViewRef}
            showsCompass={false}
            style={styles.mapWindows}
            region={{
              latitude: 30.728383092394722,
              longitude: 76.77813406804023,
              latitudeDelta: 0.09,
              longitudeDelta: 0.09,
            }}
            onPress={data => {
              drawPolygon &&
                setOnPressCoordinates([
                  ...onPressCoordinates,
                  data.nativeEvent.coordinate,
                ]);
            }}>
            <PolygonsToDisplay />
            {onPressCoordinates?.length > 0 && (
              <>
                {onPressCoordinates?.length < 3 ? (
                  <Polyline
                    coordinates={onPressCoordinates}
                    fillColor={'#7db3c76b'}
                    strokeWidth={2}></Polyline>
                ) : (
                  <>
                    <Polygon
                      coordinates={onPressCoordinates}
                      fillColor={'#7db3c76b'}
                      strokeWidth={2}></Polygon>
                    <Marker
                      key={
                        onPressCoordinates[0].latitude +
                        onPressCoordinates[0].longitude
                      }
                      coordinate={centerCoordOfPolygon(onPressCoordinates)}>
                      <Text> </Text>
                    </Marker>
                  </>
                )}
              </>
            )}
            {onPressCoordinates?.map((latlon, index) => (
              <Marker key={index} coordinate={latlon} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.markerCircle} />
              </Marker>
            ))}
          </MapView>
          {/* ---------------------------------------------------- Bottomsheet */}
          <AreaList />
        </View>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  mapWindows: {
    width: '100%',
    height: height,
  },

  totalAreaText: {
    position: 'absolute',
    fontSize: 22,
    width: '100%',
    textAlign: 'left',
    zIndex: 1,
    textShadowColor: '#fec14f',
  },
  markerCircle: {
    backgroundColor: 'rgba(54, 134, 214, 0.5)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
});
