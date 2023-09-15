import React, {PropsWithChildren, useRef} from 'react';
import {StyleSheet, View, Dimensions, Alert} from 'react-native';
import {Pressable, Text} from '../../../components/ApplicationUILib';

import {IconButton, Card} from 'react-native-paper';
import {useMapContext} from '../MapContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// type AreaCardProps = NativeStackScreenProps<RootStackParamList, 'AreaCard'>;
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

interface AreaCardProps {
  item: areaDetails | undefined;
}

const AreaCard = ({item}: AreaCardProps) => {
  const {
    setDrawPolygon,
    setOpenBottomSheet,
    centerCoordOfPolygon,
    mapViewRef,
    setShowAllPolygons,
    areaToDisplay,
    setAreaToDisplay,
    setEditName,
    setOldName,
    setAreaName,
    allAreas,
    setAllAreas,
    addArea,
  } = useMapContext();

  // ----------------------------------------------------------- On selecting card from bottom sheet
  const handleOnPressCard = (item: areaDetails | any) => {
    setDrawPolygon(false);
    setOpenBottomSheet(false);
    const coordinates = centerCoordOfPolygon(item?.coordinates);

    const newCoord = {...coordinates};

    // Take camera to the polygon
    mapViewRef.current?.animateToRegion(
      {
        ...newCoord,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      1000,
    );
    // Push polygon into array to display on screan.
    setShowAllPolygons(true);
    if (areaToDisplay.findIndex(area => area.name === item?.name) === -1) {
      setAreaToDisplay([...areaToDisplay, item]);
    }
    // console.log(areaToDisplay);
  };

  // --------------------------------- Delete Area
  const handleDeleteArea = (name: string | any) => {
    const newAllAreas = allAreas.filter(area => area.name != name);
    Alert.alert('Delete!', "Do you want to delete the Area '" + name + "'?", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.setItem('allAreas', JSON.stringify(newAllAreas));
          setAllAreas(newAllAreas);
          const areasToDisplay = areaToDisplay.filter(
            area => area.name != name,
          );

          setAreaToDisplay(areasToDisplay);
          // if (areasToDisplay?.length < 1) {
          //   setClearAllPolygons(false);
          // }
          Alert.alert('Deleted!', "'" + name + "' is suceessfuly deleted.", [
            {text: 'OK'},
          ]);
        },
      },
    ]);
  };

  return (
    <View style={[styles.areaView]}>
      <Pressable onPress={() => !addArea && handleOnPressCard(item)}>
        <View style={styles.areaCardView}>
          <View
            style={{
              paddingBottom: 4,
            }}>
            <Text style={styles.areaNameText}>{item?.name}</Text>
            <Text style={styles.areaTotal}>
              <Text style={{color: '#7c8080'}}>Total: </Text>
              {item?.totalArea.toLocaleString('hi')} sq. ft.
            </Text>
          </View>

          <View style={{justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => {
                  setEditName(true);
                  if (item) {
                    setAreaName(item.name);
                    setOldName(item.name);
                  }
                  // setShowNameModal(true);
                  // setOpenBottomSheet(false);
                }}>
                <Icon
                  style={{paddingHorizontal: 10}}
                  name="pencil"
                  size={20}
                  color="#696969"
                />
              </Pressable>
              <Pressable onPress={() => handleDeleteArea(item?.name)}>
                <MaterialIcon
                  style={{paddingHorizontal: 10}}
                  name="delete"
                  size={20}
                  color="red"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default AreaCard;

const styles = StyleSheet.create({
  areaView: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    flex: 1,
    // backgroundColor: 'grey',
  },
  areaCardView: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: (width * 95) / 100,
    paddingVertical: 14,
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaNameText: {
    fontSize: 18,
    color: '#000',
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  areaTotal: {
    color: '#000',
    fontSize: 15,
    paddingLeft: 5,
  },
});
