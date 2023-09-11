import {
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import React, {useMemo, useEffect} from 'react';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMapContext} from './MapContext';
import AreaList from './components/AreaList';
import AreaModal from './components/AreaModal';
import AllIcons from './components/AllIcons';
import PolygonsToDisplay from './components/PolygonsToDisplay';
import MapBottomBar from './components/MapBottomBar';
import LayerTypeSelector from './components/LayerTypeSelector';

// type MapScreenProps = NativeStackScreenProps<RootStackParamList, 'MapScreen'>;
const {width} = Dimensions.get('window');
// const {height} = Dimensions.get('window');
// const {width} = Dimensions.get('window');

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
    setAreaToDisplay,
    allAreas,
    showAllPolygons,
    mapType,
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

  const onRegionChange = (region: any) => {
    let lat_min = region.latitude - region.latitudeDelta / 2;
    let lat_max = region.latitude + region.latitudeDelta / 2;

    let lng_min = region.longitude - region.longitudeDelta / 2;
    let lng_max = region.longitude + region.longitudeDelta / 2;

    let areaToDisplayTemporary = allAreas.slice();
    allAreas?.map(area => {
      if (
        centerCoordOfPolygon(area.coordinates)?.latitude >= lat_min &&
        centerCoordOfPolygon(area.coordinates)?.latitude <= lat_max &&
        centerCoordOfPolygon(area.coordinates)?.longitude >= lng_min &&
        centerCoordOfPolygon(area.coordinates)?.longitude <= lng_max
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
    setAreaToDisplay(areaToDisplayTemporary);
    // console.log('93');
  };

  // console.log(onPressCoordinates);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
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
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={showAllPolygons && onRegionChange}
          mapType={mapType}
          // getMapBoundaries={async ()=> await console.log(boundaries)}
          // onRegionChange={onRegionChange}
          // onRegionChangeComplete={async val => {
          //   console.log(await mapViewRef.current.getMapBoundaries());
          // }}
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
              {onPressCoordinates?.length > 1 &&
              onPressCoordinates?.length < 3 ? (
                <Polyline
                  coordinates={onPressCoordinates}
                  strokeWidth={2}></Polyline>
              ) : (
                <>
                  <Polygon
                    coordinates={onPressCoordinates}
                    fillColor={'#7db3c76b'}
                    strokeWidth={2}></Polygon>
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
        {/* ----------------------------------------------- Bottom Sheets */}
        <AreaList />
        <LayerTypeSelector />

        {/* ----------------------------------------------- Bottom Bar */}
        <MapBottomBar />
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  mapWindows: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    // width: width,
    // height: height,
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
