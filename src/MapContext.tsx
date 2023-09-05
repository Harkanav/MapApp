import constate from 'constate';
import {useRef, useState} from 'react';
// import React from 'react'

const useMap = () => {
  // console.log('in usemap context');
  const [onPressCoordinates, setOnPressCoordinates] = useState<
    onPressCoordinates[] | []
  >([]);

  const [drawPolygon, setDrawPolygon] = useState<boolean>(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const [allAreas, setAllAreas] = useState<areaDetails[] | []>([]);

  const [areaToDisplay, setAreaToDisplay] = useState<areaDetails[] | []>([]);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [areaName, setAreaName] = useState<string>('');
  const [clearAllPolygons, setClearAllPolygons] = useState<Boolean>(false);

  // editName usestate variable is created for a model. With this variable the same modal can be used to create or edit the name of the areas.
  const [editName, setEditName] = useState<boolean>(false);
  const [oldName, setOldName] = useState<string>('');
  const bottomSheetModalRef = useRef<any>(null);
  const mapViewRef = useRef<any>(null);

  // ----------------------------------------------- Center coordinates of the polygon
  const centerCoordOfPolygon = (
    coordinates: onPressCoordinates[],
  ): onPressCoordinates => {
    let x = coordinates.map(c => c.latitude);
    let y = coordinates.map(c => c.longitude);

    let minX = Math.min.apply(null, x);
    let maxX = Math.max.apply(null, x);

    let minY = Math.min.apply(null, y);
    let maxY = Math.max.apply(null, y);

    return {
      latitude: (minX + maxX) / 2,
      longitude: (minY + maxY) / 2,
    };
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
    clearAllPolygons,
    setClearAllPolygons,
    editName,
    setEditName,
    oldName,
    setOldName,
    bottomSheetModalRef,
    mapViewRef,
    centerCoordOfPolygon,
  };
};

export const [MapContextProvider, useMapContext] = constate(useMap);
