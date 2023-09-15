import constate from 'constate';
import {useRef, useState} from 'react';
// import React from 'react'

const useMap = () => {
  // console.log('in usemap context');
  const [onPressCoordinates, setOnPressCoordinates] = useState<
    coordinates[] | []
  >([]);

  const [drawPolygon, setDrawPolygon] = useState<boolean>(false);
  const [openBottomSheet, setOpenBottomSheet] = useState<boolean>(false); // For area list bottomsheet
  const [openLayerBottomSheet, setOpenLayerBottomSheet] =
    useState<boolean>(false); //  For layer bottomsheet

  const [allAreas, setAllAreas] = useState<areaDetails[] | []>([]);
  const [areaToDisplay, setAreaToDisplay] = useState<areaDetails[] | []>([]);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [addArea, setAddArea] = useState<boolean>(false);
  const [areaName, setAreaName] = useState<string>('');
  const [showAllPolygons, setShowAllPolygons] = useState<Boolean>(false);

  // editName usestate variable is created for a model. With this variable the same modal can be used to create or edit the name of the areas.
  const [editName, setEditName] = useState<boolean>(false);
  const [oldName, setOldName] = useState<string>('');
  const mapViewRef = useRef<any>(null);
  const [mapType, setMapType] = useState<layerType>('standard');
  const [showLiveLocation, setShowLiveLocation] = useState<boolean>(false);

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
    openLayerBottomSheet,
    setOpenLayerBottomSheet,
    mapType,
    setMapType,
    wordToUppercase,
    addArea,
    setAddArea,
    showLiveLocation,
    setShowLiveLocation,
  };
};

export const [MapContextProvider, useMapContext] = constate(useMap);
