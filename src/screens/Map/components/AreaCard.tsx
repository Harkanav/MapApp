import React, {PropsWithChildren, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Alert,
  Pressable,
  Platform,
} from 'react-native';
import {IconButton, Card} from 'react-native-paper';
import {useMapContext} from '../MapContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {computeArea, LatLng} from 'spherical-geometry-js/src/index';

// type AreaCardProps = NativeStackScreenProps<RootStackParamList, 'AreaCard'>;
const {width} = Dimensions.get('window');

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
    setShowNameModal,
    allAreas,
    setAllAreas,
    editName,
    oldName,
    areaName,
    addArea,
    setAddArea,
    onPressCoordinates,
    setOnPressCoordinates,
  } = useMapContext();

  // ----------------------------------------------------------- On selecting card from bottom sheet
  const handleOnPressCard = (item: areaDetails | any) => {
    setDrawPolygon(false);
    // setOnPressCoordinates(item?.coordinates);
    // bottomSheetModalRef.current?.close();
    setOpenBottomSheet(false);
    // console.log(centerCoordOfPolygon(item?.coordinates));
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

  // -------------------------------- return true or false if a name is found.
  // -------------------------------- handleNameCheck function is also used in handleSaveArea.

  const handleNameCheck = (name: string): boolean => {
    const nameExists = allAreas.findIndex(area => area.name === name.trim());
    if (nameExists < 0) {
      if (name.trim()?.length > 3) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // ----------------------------------------------------------- Function calculates area
  const getArea = (): number | any => {
    if (onPressCoordinates?.length > 2) {
      let latLngs = onPressCoordinates.map(
        coord => new LatLng(coord.latitude, coord.longitude),
      );

      if (computeArea(latLngs)) {
        return computeArea(latLngs) * 10.67; //ft. sq.
      }
      return 0;
    }
  };

  // -------------------------------- Save name of the area that also checks the name.
  // -------------------------------- it uses handleNameCheck function to check the name.
  const handleSaveArea = async () => {
    if (handleNameCheck(areaName)) {
      setAllAreas([
        {
          name: areaName,
          coordinates: onPressCoordinates,
          totalArea: parseFloat(getArea().toFixed(2)),
        },
        ...allAreas,
      ]);

      setAreaToDisplay([
        {
          name: areaName,
          coordinates: onPressCoordinates,
          totalArea: parseFloat(getArea().toFixed(2)),
        },
        ...areaToDisplay,
      ]);

      Alert.alert('Saved!', "'" + areaName + "' is suceessfully saved.", [
        {text: 'OK'},
      ]);

      setOnPressCoordinates([]);
      setAreaName('');
      setOpenBottomSheet(false);
      // setDrawPolygon(false);
      // setShowNameModal(false);

      await AsyncStorage.setItem(
        'allAreas',
        JSON.stringify([
          {
            name: areaName,
            coordinates: onPressCoordinates,
            totalArea: parseFloat(getArea().toFixed(2)),
          },
          ...allAreas,
        ]),
      );
    } else {
      Alert.alert(
        'Name!',
        "'" +
          areaName +
          "' name already exists. Please, choose another name to save the area.",
        [{text: 'OK'}],
      );
    }
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

  // --------------------------------------------------- Edit Name
  const handleUpdateName = async () => {
    let allAreasDetails = allAreas.splice(0);
    let index = 0;
    for (let i = 0; i < allAreasDetails?.length; i++) {
      const obj = allAreasDetails[i];
      console.log(obj.name + ' ' + oldName, 223);
      if (obj.name == oldName) {
        index = i;
        break;
      }
    }
    // console.log(index, 228);
    allAreasDetails[index].name = areaName;
    setAllAreas(allAreasDetails);
    setAreaToDisplay(allAreasDetails);
    await AsyncStorage.setItem('allAreas', JSON.stringify(allAreasDetails));
    // setOpenBottomSheet(false);
    Alert.alert('Updated!', 'The name is suceessfully updated.', [
      {text: 'OK'},
    ]);
    // setClearAllPolygons(true);
    // setAllAreas();
  };

  return (
    <Pressable
      onPress={() => !addArea && handleOnPressCard(item)}
      style={styles.areaPressable}>
      <View style={styles.areaCardView}>
        <View
          style={{
            paddingBottom: 4,
          }}>
          {addArea ? (
            <TextInput
              maxLength={15}
              // clearButtonMode="always" //only for iOS
              keyboardType="ascii-capable"
              style={styles.cardTextInput}
              value={areaName}
              placeholder="Name"
              onChangeText={setAreaName}
            />
          ) : editName && oldName == item?.name ? (
            <TextInput
              maxLength={15}
              // clearButtonMode="always" //only for iOS
              keyboardType="ascii-capable"
              style={styles.cardTextInput}
              value={areaName}
              onChangeText={setAreaName}
            />
          ) : (
            <>
              <Text style={styles.areaNameText}>{item?.name}</Text>
              <Text style={styles.areaTotal}>
                <Text style={{color: '#7c8080'}}>Total: </Text>
                {item?.totalArea.toLocaleString('hi')} sq. ft.
              </Text>
            </>
          )}
        </View>

        <View style={{justifyContent: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            {addArea ? (
              <>
                {/* ----------------- Add Area Buttons */}
                {handleNameCheck(areaName) && (
                  <Pressable
                    onPress={() => {
                      handleSaveArea();
                      setAddArea(false);
                    }}>
                    <Icon
                      style={{paddingHorizontal: 10}}
                      name="check"
                      size={22}
                      color="green"
                    />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    setAreaName('');
                    setAddArea(false);
                    setOpenBottomSheet(false);
                  }}>
                  <MaterialIcon
                    style={{paddingHorizontal: 10}}
                    name="close"
                    size={22}
                    color="red"
                  />
                </Pressable>
              </>
            ) : editName && oldName == item?.name ? (
              <>
                {/* ----------------- Edit Area Name Buttons */}
                {handleNameCheck(areaName) && (
                  <Pressable
                    onPress={() => {
                      handleUpdateName();
                      setEditName(false);
                      setAreaName('');
                      setOldName('');
                      // setShowNameModal(true);
                      // setOpenBottomSheet(false);
                    }}>
                    <Icon
                      style={{paddingHorizontal: 10}}
                      name="check"
                      size={22}
                      color="green"
                    />
                  </Pressable>
                )}
                <Pressable onPress={() => setEditName(false)}>
                  <MaterialIcon
                    style={{paddingHorizontal: 10}}
                    name="close"
                    size={22}
                    color="red"
                  />
                </Pressable>
              </>
            ) : (
              <>
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
              </>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AreaCard;

const styles = StyleSheet.create({
  areaPressable: {
    width: '100%',
    alignItems: 'center',
  },
  areaCardView: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: '95%',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTextInput: {
    // width: '100%',
    width: (width * 55) / 100,
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 2,
  },
  areaNameText: {
    fontSize: 18,
    fontWeight: '700',
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
