import {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import constate from 'constate';
import {
  request,
  check,
  checkMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const {...PERMISSION_IOS} = PERMISSIONS.IOS;

const useAppPermissions = () => {
  const [permissions, setPermissions] = useState({
    location: false,
  });

  const [permissionRequestable, setPermissionRequestable] = useState({
    location: false,
  });

  const PLATFORM_PERMISSIONS = useMemo(() => {
    if (Platform.OS === 'ios') {
      return {
        locationPermission: PERMISSION_IOS.LOCATION_ALWAYS,
        locationWhilePermission: PERMISSION_IOS.LOCATION_WHEN_IN_USE,
      };
    }
    return {
      locationPermission: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      locationWhilePermission: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    };
  }, []);

  const checkLocationPermissions = useCallback(async () => {
    let permissionRequest = false;
    let permissionLocation = false;
    try {
      if (Platform.OS === 'ios') {
        const result = await checkMultiple([
          PLATFORM_PERMISSIONS.locationPermission,
          PLATFORM_PERMISSIONS.locationWhilePermission,
        ]);

        permissionRequest =
          result[PLATFORM_PERMISSIONS?.locationPermission] === RESULTS.DENIED ||
          result[PLATFORM_PERMISSIONS.locationWhilePermission] ===
            RESULTS.DENIED;

        setPermissionRequestable(prevPermissionRequestable => ({
          ...prevPermissionRequestable,
          location: permissionRequest,
        }));

        permissionLocation =
          result[PLATFORM_PERMISSIONS?.locationPermission] ===
            RESULTS.GRANTED ||
          result[PLATFORM_PERMISSIONS.locationWhilePermission] ===
            RESULTS.GRANTED;

        setPermissions(prevPermissions => ({
          ...prevPermissions,
          location: permissionLocation,
        }));
      } else {
        const result = await check(PLATFORM_PERMISSIONS?.locationPermission);
        permissionRequest = result === RESULTS.BLOCKED;
        setPermissionRequestable(prevPermissionsRequestable => ({
          ...prevPermissionsRequestable,
          location: permissionRequest,
        }));

        permissionLocation = result === RESULTS.GRANTED;
        setPermissions(prevPermissions => ({
          ...prevPermissions,
          location: permissionLocation,
        }));
      }

      return {permissionRequest, permissionLocation};
    } catch (error) {
      console.log('Error in check location permission', error);
      permissionRequest = false;
      permissionLocation = false;
      return {permissionRequest, permissionLocation};
    }
  }, [PLATFORM_PERMISSIONS]);

  const requestLocationPermission = useCallback(
    async (cb: any = () => {}) => {
      let permissionRequest = false;
      let permissionLocation = false;
      try {
        const result = await request(
          PLATFORM_PERMISSIONS.locationWhilePermission,
        );

        permissionRequest = result === RESULTS.DENIED;

        permissionLocation = result === RESULTS.GRANTED;
        setPermissionRequestable(prevPermissionRequestable => ({
          ...prevPermissionRequestable,
          location: permissionRequest,
        }));
        setPermissions(prevPermissions => ({
          ...prevPermissions,
          location: permissionLocation,
        }));

        cb({
          ...permissions,
          location: permissionLocation,
        });

        return {permissionRequest, permissionLocation};
      } catch (error) {
        console.log('Error in request location permission.', error);
        permissionRequest = false;
        permissionLocation = false;
        return {permissionRequest, permissionLocation};
      }
    },
    [PLATFORM_PERMISSIONS],
  );

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  return {
    permissions,
    permissionRequestable,
    setPermissions,
    checkLocationPermissions,
    requestLocationPermission,
  };
};

export const [AppPermissionsProvider, useAppPermissionscontext] =
  constate(useAppPermissions);
