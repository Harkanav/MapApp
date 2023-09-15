import {
  StyleSheet,
  View,
  useWindowDimensions,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import {Pressable, Text} from '../../../components/ApplicationUILib';
import {useMapContext} from '../MapContext';
import {computeArea, LatLng} from 'spherical-geometry-js/src/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AreaCreateAndEditModal = () => {
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const {
    addArea,
    editName,
    areaName,
    setAreaName,
    allAreas,
    onPressCoordinates,
    setAllAreas,
    setAreaToDisplay,
    areaToDisplay,
    setOnPressCoordinates,
    setOpenBottomSheet,
    oldName,
    setAddArea,
    setEditName,
    setOldName,
  } = useMapContext();

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
  // insets is for detecting the iOS devices with button below screen.
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        style={{
          paddingTop: 10,
          paddingBottom:
            Platform.OS === 'ios' ? (insets.bottom > 0 ? 18 : 4) : 4,
          width: windowWidth,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextInput
          maxLength={15}
          // clearButtonMode="always" //only for iOS
          placeholder="Area Name"
          keyboardType="ascii-capable"
          style={[styles.cardTextInput, {width: (windowWidth * 90) / 100}]}
          value={areaName}
          onChangeText={setAreaName}
        />
        <View
          style={{
            width: windowWidth,
            alignItems: 'center',
          }}>
          <Pressable
            style={[
              styles.areaNameButtonPressable,
              {
                width: (windowWidth * 90) / 100,
                backgroundColor: handleNameCheck(areaName) ? '#22963f' : 'grey',
              },
            ]}
            onPress={() => {
              if (addArea) {
                handleSaveArea();
                setAddArea(false);
              } else if (editName) {
                handleUpdateName();
                setEditName(false);
                setOldName('');
              }
              setAreaName('');
            }}
            disabled={!handleNameCheck(areaName)}>
            {
              <Text style={styles.areaNameButtonText}>
                {addArea ? 'Add Area' : editName && 'Update Name'}
              </Text>
            }
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default AreaCreateAndEditModal;

const styles = StyleSheet.create({
  areaNameButtonPressable: {
    borderRadius: 10,
    alignItems: 'center',
  },
  areaNameButtonText: {
    color: '#ffffff',
    padding: 10,
    paddingVertical: 14,
    fontSize: 18,
  },
  cardTextInput: {
    // width: '100%',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 2,
  },
});
