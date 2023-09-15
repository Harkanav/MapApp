import {StyleSheet, View, SafeAreaView, Alert, Platform} from 'react-native';
import React from 'react';
import {useMapContext} from '../MapContext';
import {IconButton} from 'react-native-paper';
import {useAppPermissionscontext} from './../../../hooks/useAppPermissions';
import {useAppLocationContext} from './../../../hooks/useLocation';

const AllIcons = () => {
  const {
    showAllPolygons,
    setShowAllPolygons,
    setAreaToDisplay,
    drawPolygon,
    setOpenBottomSheet,
    setOnPressCoordinates,
    setDrawPolygon,
    onPressCoordinates,
    setEditName,
    setAreaName,
    allAreas,
    setAddArea,
    showLiveLocation,
    setShowLiveLocation,
    mapViewRef,
  } = useMapContext();

  const {requestLocationPermission, checkLocationPermissions} =
    useAppPermissionscontext();

  const {currentLocationCoord, getCurrentPosition, setCurrentLocationCoord} =
    useAppLocationContext();

  // useEffect(() => {
  //   if (permissions?.location) {
  //     handleEnableMyLocation();
  //   }
  // }, [permissions?.location]);

  const getLivePosition = () => {
    console.log('in getLivePosition');

    getCurrentPosition((region: coordinates) => {
      if (mapViewRef?.current) {
        const modifyRegion = {
          latitude: region?.latitude,
          longitude: region?.longitude,
          latitudeDelta: currentLocationCoord?.latitudeDelta,
          longitudeDelta: currentLocationCoord?.longitudeDelta,
        };
        setCurrentLocationCoord(modifyRegion);
        mapViewRef?.current?.animateToRegion(modifyRegion, 1000);
        setShowLiveLocation(true);
      }
    });
  };

  const handleEnableMyLocation = async () => {
    let locationPermissions = await checkLocationPermissions();
    console.log(locationPermissions, 64);

    if (locationPermissions.permissionLocation) {
      getLivePosition();
      // setShowLiveLocation(true);
    } else {
      if (Platform.OS === 'ios' && locationPermissions.permissionRequest) {
        locationPermissions = await requestLocationPermission();
        console.log(locationPermissions, 71);

        if (locationPermissions.permissionLocation) getLivePosition();
      } else {
        console.log('in else part of handleEnableMyLocation');
        setShowLiveLocation(false);
        Alert.alert(
          'Location is disable from the settings.',
          `Please change the application location permission from the mobile settings${
            Platform.OS === 'android' ? ' and restart the application' : ''
          }.`,
          [{text: 'OK'}],
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.buttonView}>
      <View>
        {!drawPolygon && (
          <>
            <IconButton
              icon="crosshairs-gps"
              mode="contained"
              style={[styles.styleButton]}
              size={22}
              iconColor={showLiveLocation ? '#22963f' : '#000000'}
              containerColor="#ffffff"
              onPress={() => {
                if (showLiveLocation) {
                  setShowLiveLocation(false);
                } else {
                  handleEnableMyLocation();
                }
              }}
            />
            <IconButton
              icon="vector-polygon"
              mode="contained"
              style={[styles.styleButton]}
              size={22}
              iconColor={showAllPolygons ? '#22963f' : '#000000'}
              containerColor="#ffffff"
              onPress={() => {
                if (showAllPolygons) {
                  setAreaToDisplay([]);
                } else {
                  setOpenBottomSheet(true);
                  setAreaToDisplay(allAreas);
                }
                setShowAllPolygons(!showAllPolygons);
              }}
            />
          </>
        )}

        {/* --------------------------------------- Icons for polygon */}
        {drawPolygon && (
          <IconButton
            size={20}
            containerColor="#ffffff"
            iconColor="#000000"
            icon="keyboard-backspace"
            mode="contained"
            style={[styles.styleButton]}
            onPress={() => {
              setOnPressCoordinates([]);
              setDrawPolygon(false);
            }}
          />
        )}
        {drawPolygon && onPressCoordinates?.length > 0 && (
          <>
            <IconButton
              icon="delete"
              containerColor="#ffffff"
              size={20}
              mode="contained"
              iconColor="#000000"
              style={styles.styleButton}
              onPress={() => {
                setOnPressCoordinates([]);
              }}
            />
            <IconButton
              icon="undo"
              containerColor="#ffffff"
              size={20}
              mode="contained"
              iconColor="#000000"
              style={styles.styleButton}
              onPress={() => {
                setOnPressCoordinates(onPressCoordinates.slice(0, -1));
              }}
            />
          </>
        )}
        {drawPolygon && onPressCoordinates?.length > 2 && (
          <IconButton
            icon="check"
            containerColor="#ffffff"
            size={20}
            mode="contained"
            iconColor="#000000"
            style={styles.styleButton}
            onPress={() => {
              setEditName(false);
              setAddArea(true);
              // setShowNameModal(true);
              setOpenBottomSheet(true);
              setAreaName('');
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AllIcons;

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
    right: 25,
    // paddingTop: 10,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  styleButton: {
    marginBottom: 10,
    zIndex: 1,
  },
  clearAllPolygons: {
    position: 'absolute',
    top: 0,
    right: 50,
    zIndex: 1,
  },
});
