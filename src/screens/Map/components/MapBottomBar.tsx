import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Pressable} from '../../../components/ApplicationUILib';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useMapContext} from '../MapContext';

const MapBottomBar = () => {
  const {
    allAreas,
    setOpenBottomSheet,
    setAreaToDisplay,
    setShowAllPolygons,
    setOpenLayerBottomSheet,
  } = useMapContext();
  return (
    <View style={styles.bottomBar}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemContainer}>
        <Pressable
          style={styles.bottomBarItem}
          onPress={() => {
            setOpenBottomSheet(true);
            setAreaToDisplay(allAreas);
            setShowAllPolygons(true);
          }}>
          <MaterialIcon
            name="vector-polygon-variant"
            size={30}
            color="#22963f"
          />
          <Text style={styles.bottomBarText}>Polygon</Text>
        </Pressable>
        <Pressable
          style={styles.bottomBarItem}
          onPress={() => setOpenLayerBottomSheet(true)}>
          <MaterialIcon name="layers" size={30} color="#22963f" />
          <Text style={styles.bottomBarText}>Layer</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default MapBottomBar;

const styles = StyleSheet.create({
  bottomBar: {
    // height: 90,
    backgroundColor: '#fff',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: Platform.OS == 'ios' ? 30 : 10,
  },
  bottomBarItem: {
    marginHorizontal: 22,
    alignItems: 'center',
  },
  bottomBarText: {
    paddingTop: 1,
    fontSize: 13,
    color: '#000',
    opacity: 0.8,
  },
});
