import {
  StyleSheet,
  View,
  Dimensions,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {useMapContext} from '../MapContext';
import AreaCard from './AreaCard';
import {Dialog, Pressable, Text} from '../../../components/ApplicationUILib';
// import {IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const AreaList = () => {
  const {
    setOpenBottomSheet,
    allAreas,
    openBottomSheet,
    setDrawPolygon,
    editName,
    oldName,
  } = useMapContext();
  const {width: windowWidth} = useWindowDimensions();

  return (
    <Dialog
      visible={openBottomSheet}
      onDismiss={() => setOpenBottomSheet(false)}
      width={windowWidth}
      height="70%"
      bottom={true}
      overlayBackgroundColor="transparent"
      containerStyle={styles.dialogContainer}
      renderPannableHeader={() => (
        <View style={styles.dialogContentView}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Pressable
              style={styles.dialofCloseBotton}
              onPress={() => setOpenBottomSheet(false)}>
              <Icon name="chevron-down" size={13} color="#696969" />
            </Pressable>
          </View>
          <View style={[styles.dialogHeader, {width: windowWidth}]}>
            <Text style={styles.dialogHeaderText}>Area List</Text>
            <Pressable
              style={styles.dialogAddButton}
              onPress={() => {
                setDrawPolygon(true);
                setOpenBottomSheet(false);
              }}>
              <Icon name="plus" size={20} color="#fff" />
              <Text style={styles.dialogAddButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      )}>
      <FlatList
        data={allAreas}
        keyExtractor={item => item.name}
        ListEmptyComponent={
          <View
            style={{
              padding: 10,
            }}>
            <Text style={styles.noSavedAreaText}>No Saved Area</Text>
          </View>
        }
        renderItem={({item}) => (
          <>
            {editName ? (
              oldName == item.name && (
                <View style={{paddingVertical: 10, width: windowWidth}}>
                  <AreaCard item={item} />
                </View>
              )
            ) : (
              <View style={{paddingVertical: 10, width: windowWidth}}>
                <AreaCard item={item} />
              </View>
            )}
          </>
        )}
      />
    </Dialog>
  );
};

export default AreaList;

const styles = StyleSheet.create({
  dialogContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    // width: '100%',
  },
  dialofCloseBotton: {
    width: 80,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    borderRadius: 10,
    padding: 4,
    marginVertical: 10,
  },
  dialogContentView: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  dialogHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 14,
  },
  dialogHeaderText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000',
  },
  dialogAddButton: {
    backgroundColor: '#22963f',
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
  },
  dialogAddButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  noSavedAreaText: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
