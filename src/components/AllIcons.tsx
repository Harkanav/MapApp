import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useMapContext} from '../MapContext';
import {IconButton} from 'react-native-paper';

const AllIcons = () => {
  const {
    clearAllPolygons,
    setClearAllPolygons,
    setAreaToDisplay,
    drawPolygon,
    openBottomSheet,
    bottomSheetModalRef,
    setOpenBottomSheet,
    setOnPressCoordinates,
    setDrawPolygon,
    onPressCoordinates,
    setEditName,
    setShowNameModal,
    setAreaName,
  } = useMapContext();

  return (
    <View style={styles.buttonView}>
      {/* ---------------------------- Clear Button to clear all polygons */}
      {clearAllPolygons && (
        <IconButton
          icon="vector-square-remove"
          mode="contained"
          size={20}
          style={{
            position: 'absolute',
            top: 0,
            right: 50,
            zIndex: 1,
          }}
          iconColor="#000000"
          containerColor="#ffffff"
          onPress={() => {
            setClearAllPolygons(false);
            setAreaToDisplay([]);
          }}
        />
      )}
      {!drawPolygon && (
        <>
          {openBottomSheet ? (
            <IconButton
              icon="window-close"
              mode="contained"
              size={20}
              style={[styles.styleButton]}
              iconColor="#000000"
              containerColor="#ffffff"
              onPress={() => {
                bottomSheetModalRef.current?.close();
                setOpenBottomSheet(false);
                setOnPressCoordinates([]);
              }}
            />
          ) : (
            <IconButton
              icon="menu"
              mode="contained"
              size={20}
              style={[styles.styleButton]}
              iconColor="#000000"
              containerColor="#ffffff"
              onPress={() => {
                bottomSheetModalRef.current?.present();
                setOpenBottomSheet(true);
              }}
            />
          )}

          <IconButton
            icon="shape-polygon-plus"
            mode="contained"
            style={[styles.styleButton]}
            size={20}
            iconColor="#000000"
            containerColor="#ffffff"
            onPress={() => {
              setDrawPolygon(true);
              bottomSheetModalRef.current?.close();
              // setClearAllPolygons(false);
              // setAreaToDisplay([]);
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
            setShowNameModal(true);
            setAreaName('');
          }}
        />
      )}
    </View>
  );
};

export default AllIcons;

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    zIndex: 1,
    top: 20,
    right: 25,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  styleButton: {
    marginBottom: 10,
    zIndex: 1,
  },
});
