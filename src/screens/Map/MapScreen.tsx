import {Dimensions, StyleSheet, View, Image, AppState} from 'react-native';
import React, {useEffect, useRef} from 'react';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMapContext} from './MapContext';
import AreaList from './components/AreaList';
import AllIcons from './components/AllIcons';
import PolygonsToDisplay from './components/PolygonsToDisplay';
import MapBottomBar from './components/MapBottomBar';
import LayerTypeSelector from './components/LayerTypeSelector';
import {useAppLocationContext} from './../../hooks/useLocation';
import {useAppPermissionscontext} from './../../hooks/useAppPermissions';
import {onRegionChange} from '../../utils/map';

// import LiveLocation from './components/LiveLocation';
// import DeviceInfo from 'react-native-device-info';

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
    mapViewRef,
    setAreaToDisplay,
    allAreas,
    showAllPolygons,
    mapType,
    showLiveLocation,
  } = useMapContext();

  const {permissions, checkLocationPermissions, requestLocationPermission} =
    useAppPermissionscontext();

  const {getCurrentPosition, currentLocationCoord, setCurrentLocationCoord} =
    useAppLocationContext();

  const appState = useRef(AppState.currentState);

  // ----------------------------------------^ Variables declated

  // console.log(onPressCoordinates);

  useEffect(() => {
    checkLocationPermissions().then(() => {
      if (!permissions.location) {
        requestLocationPermission();
      }
    });

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        {/* ---------------------------------------------------- Icons over map */}
        <AllIcons />
        {/* ---------------------------------------------------- MapView */}
        <MapView
          loadingEnabled={true}
          ref={mapViewRef}
          showsCompass={false}
          style={styles.mapWindows}
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={region =>
            showAllPolygons &&
            setAreaToDisplay(onRegionChange(region, allAreas))
          }
          mapType={mapType}
          // getMapBoundaries={async ()=> await console.log(boundaries)}
          // onRegionChange={onRegionChange}
          // onRegionChangeComplete={async val => {
          //   console.log(await mapViewRef.current.getMapBoundaries());
          // }}
          region={currentLocationCoord}
          onPress={data => {
            console.log(data.nativeEvent);
            drawPolygon &&
              setOnPressCoordinates([
                ...onPressCoordinates,
                data.nativeEvent.coordinate,
              ]);
          }}>
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

          {showLiveLocation && currentLocationCoord && (
            <Marker
              key={
                'currentLocationCoord' +
                currentLocationCoord?.latitude +
                currentLocationCoord?.longitude
              }
              coordinate={currentLocationCoord}
              anchor={{x: 0.5, y: 0.5}}>
              {/* <View style={styles.markerCircle} /> */}
              <Image
                source={require('../../../assets/images/dot.gif')}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: 'center',
                }}
              />
            </Marker>
          )}

          {/* -------------- Display all polygons */}
          <PolygonsToDisplay />
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
    zIndex: 10,
  },
});
