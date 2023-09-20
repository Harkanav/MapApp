import {StyleSheet, View, useWindowDimensions, FlatList} from 'react-native';
import React from 'react';
import {useMapContext} from '../MapContext';
import AreaCard from './AreaCard';
import {Dialog, Pressable, Text} from '../../../components/ApplicationUILib';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import AreaCreateAndEditModal from './AreaCreateAndEditModal';

const AreaList = () => {
  const {
    setOpenBottomSheet,
    allAreas,
    openBottomSheet,
    setDrawPolygon,
    editName,
    oldName,
    addArea,
    setAddArea,
    setEditName,
    setAreaName,
    setOldName,
    showHomeOwnerCard,
    showJobDetailsCard,
    setShowHomeOwnerCard,
    setShowJobDetailsCard,
    drawPolygon,
    setCustomMarker,
  } = useMapContext();
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  return (
    <Dialog
      visible={openBottomSheet}
      onDismiss={() => {
        addArea && setAddArea(false);
        editName && setEditName(false);
        setAreaName('');
        setOldName('');
        setOpenBottomSheet(false);
      }}
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
              onPress={() => {
                setOpenBottomSheet(false);
                addArea && setAddArea(false);
                editName && setEditName(false);
                // setAreaName('');
                // setOldName('');
              }}>
              <Icon name="chevron-down" size={13} color="gray" />
            </Pressable>
          </View>

          {/* ---------------------- Heading and close button */}

          <View style={[styles.dialogHeader, {width: windowWidth}]}>
            <Text style={styles.dialogHeaderText}>
              {addArea ? (
                'Add Area'
              ) : editName ? (
                // ----------------------------------- Back button
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Pressable
                    onPress={() => {
                      setAreaName('');
                      setEditName(false);
                      setOldName('');
                    }}
                    style={{paddingRight: 15}}>
                    <MaterialIcon name="arrow-left" size={28} color="#333" />
                  </Pressable>
                  <Text style={styles.dialogHeaderText}>Edit Area Name</Text>
                </View>
              ) : (
                'Area List'
              )}
            </Text>
            {addArea || editName ? (
              <>
                <Pressable
                  onPress={() => {
                    setAreaName('');
                    addArea && setAddArea(false);
                    editName && setEditName(false);
                    setOpenBottomSheet(false);
                  }}>
                  <MaterialIcon
                    style={{paddingHorizontal: 10}}
                    name="close"
                    size={28}
                    color="#333"
                  />
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  style={styles.dialogAddButton}
                  onPress={() => {
                    showHomeOwnerCard && setShowHomeOwnerCard(false);
                    showJobDetailsCard && setShowJobDetailsCard(false);
                    setOpenBottomSheet(false);
                    setDrawPolygon(true);
                  }}>
                  <Icon name="plus" size={20} color="#fff" />
                  <Text style={styles.dialogAddButtonText}> Draw</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      )}>
      {/* ----------------------------------- Bottom list content */}
      {!addArea && !editName && (
        <FlatList
          data={allAreas}
          keyExtractor={item => item.name + item.coordinates[0].latitude}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 30,
            width: windowWidth,
          }}
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
              <View>
                {editName ? (
                  oldName == item.name && <AreaCard item={item} />
                ) : (
                  <AreaCard item={item} />
                )}
              </View>
            </>
          )}
        />
      )}
      {/* ---------------------- Add new area name and edit name button */}
      {(addArea || editName) && <AreaCreateAndEditModal />}
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
    paddingBottom: 23,
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
    // fontFamily: 'Montserrat-ExtraBold',
    fontSize: 20,
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

    paddingHorizontal: 4,
  },
  noSavedAreaText: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
