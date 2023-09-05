import {StyleSheet, View, Dimensions, Text} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useMapContext} from '../MapContext';
import AreaCard from './AreaCard';

const {width} = Dimensions.get('window');

const AreaList = () => {
  const {bottomSheetModalRef, setOpenBottomSheet, allAreas} = useMapContext();

  const snapPoints = useMemo(() => ['25%', '48%', '80%'], []);

  // ----------------------------------------------------------- Bottomsheet

  // -------------------------------- close bootom sheet
  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      setOpenBottomSheet(false);
    }
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{borderRadius: 20}}
      onChange={index => handleSheetChanges(index)}>
      <View style={styles.areaContainer}>
        <View>
          <Text style={styles.areaTitle}>Areas</Text>
          <View style={styles.horizontalLine} />
        </View>
        <BottomSheetFlatList
          data={allAreas}
          keyExtractor={item => item.name}
          ListEmptyComponent={() => (
            <View>
              <Text>No Saved Area</Text>
            </View>
          )}
          renderItem={({item}) => <AreaCard item={item} />}
        />
      </View>
    </BottomSheetModal>
  );
};

export default AreaList;

const styles = StyleSheet.create({
  areaContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 5,
  },
  areaTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  horizontalLine: {
    alignSelf: 'center',
    borderBottomColor: 'gainsboro',
    borderBottomWidth: 1,
    width: (width * 65) / 100,
    marginBottom: 15,
  },
});
