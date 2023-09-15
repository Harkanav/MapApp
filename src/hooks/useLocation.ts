import React, {useCallback, useState} from 'react';
import constate from 'constate';
import {LATITUDE_DELTA, LONGITUDE_DELTA} from '../utils/constants';
import Geolocation from 'react-native-geolocation-service';
import {useAppPermissionscontext} from './useAppPermissions';

const useLocation = () => {
  const {permissions, requestLocationPermission} = useAppPermissionscontext();

  const initialCoordinates = {
    latitude: 30.728383092394722,
    longitude: 76.77813406804023,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const [currentLocationCoord, setCurrentLocationCoord] =
    useState(initialCoordinates);

  const getCurrentPosition = useCallback(
    (cb: any = () => {}, cb2 = () => {}) => {
      // console.log('in getCurrentPosition', 23);
      // console.log(permissions.location);
      if (permissions.location) {
        // console.log(Geolocation, 25);
        Geolocation.getCurrentPosition(
          position => {
            // ------------------ All information of live location.
            // console.log(position);
            const region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            // console.log('getCurrentPosition');
            cb(region);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        requestLocationPermission(cb2);
      }
    },
    [permissions],
  );

  // const watchCurrentPosition = useCallback(
  //   (cb: any = () => {}) => {
  //     if (permissions?.location) {
  //       Geolocation.watchPosition(
  //         position => {
  //           // ------------------ All information of live location.
  //           // console.log(position);
  //           const region = {
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //           };

  //           cb(region);
  //         },
  //         error => {
  //           // See error code charts below.
  //           console.log(45, error.code, error.message);
  //         },
  //         {enableHighAccuracy: true, distanceFilter: 1},
  //       );
  //     } else {
  //       requestLocationPermission();
  //     }
  //   },
  //   [permissions],
  // );

  return {
    initialCoordinates,
    currentLocationCoord,
    setCurrentLocationCoord,
    // watchCurrentPosition,
    getCurrentPosition,
  };
};

export const [AppLocationProvider, useAppLocationContext] =
  constate(useLocation);
