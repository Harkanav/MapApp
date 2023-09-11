import constate from 'constate';
import {useRef, useState} from 'react';
// import React from 'react'

const useMap = () => {
  // console.log('in usemap context');
  const [onPressCoordinates, setOnPressCoordinates] = useState<
    onPressCoordinates[] | []
  >([]);

  const [drawPolygon, setDrawPolygon] = useState<boolean>(false);
  const [openBottomSheet, setOpenBottomSheet] = useState<boolean>(false); // For area list bottomsheet
  const [openLayerBottomSheet, setOpenLayerBottomSheet] =
    useState<boolean>(false); //  For layer bottomsheet

  const [allAreas, setAllAreas] = useState<areaDetails[] | []>([]);

  const [areaToDisplay, setAreaToDisplay] = useState<areaDetails[] | []>([]);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [areaName, setAreaName] = useState<string>('');
  const [showAllPolygons, setShowAllPolygons] = useState<Boolean>(false);

  // editName usestate variable is created for a model. With this variable the same modal can be used to create or edit the name of the areas.
  const [editName, setEditName] = useState<boolean>(false);
  const [oldName, setOldName] = useState<string>('');
  const mapViewRef = useRef<any>(null);
  const [mapType, setMapType] = useState<layerType>('standard');

  // ----------------------------------------------- Center coordinates of the polygon

  const centerCoordOfPolygon = (
    coordinates: onPressCoordinates[],
  ): onPressCoordinates => {
    // console.log(coordinates[0]);
    const points = coordinates?.map((coordinate: any) => ({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    }));
    var first = points[0],
      last = points[points.length - 1];
    if (
      first.latitude !== last.latitude ||
      first.longitude !== last.longitude
    ) {
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

  const wordToUppercase = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return {
    onPressCoordinates,
    setOnPressCoordinates,
    drawPolygon,
    setDrawPolygon,
    openBottomSheet,
    setOpenBottomSheet,
    allAreas,
    setAllAreas,
    areaToDisplay,
    setAreaToDisplay,
    showNameModal,
    setShowNameModal,
    areaName,
    setAreaName,
    showAllPolygons,
    setShowAllPolygons,
    editName,
    setEditName,
    oldName,
    setOldName,
    mapViewRef,
    centerCoordOfPolygon,
    openLayerBottomSheet,
    setOpenLayerBottomSheet,
    mapType,
    setMapType,
    wordToUppercase,
  };
};

export const [MapContextProvider, useMapContext] = constate(useMap);
