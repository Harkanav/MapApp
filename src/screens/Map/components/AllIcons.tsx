import {StyleSheet, View, SafeAreaView} from 'react-native';
import React from 'react';
import {useMapContext} from '../MapContext';
import {IconButton} from 'react-native-paper';

const AllIcons = () => {
  const {
    showAllPolygons,
    setShowAllPolygons,
    setAreaToDisplay,
    drawPolygon,
    openBottomSheet,
    setOpenBottomSheet,
    setOnPressCoordinates,
    setDrawPolygon,
    onPressCoordinates,
    setEditName,
    setShowNameModal,
    setAreaName,
    allAreas,
  } = useMapContext();

  return (
    <SafeAreaView style={styles.buttonView}>
      <View>
        {!drawPolygon && (
          <>
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
                // bottomSheetModalRef.current?.close();
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
