import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import React from 'react';
import {useMapContext} from '../MapContext';
import {TextInput} from 'react-native-gesture-handler';
import {computeArea, LatLng} from 'spherical-geometry-js/src/index';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const AreaModal = () => {
  const {
    showNameModal,
    areaName,
    setAreaName,
    setShowNameModal,
    editName,
    allAreas,
    setAllAreas,
    onPressCoordinates,
    setOnPressCoordinates,
    setDrawPolygon,
    oldName,
    bottomSheetModalRef,
  } = useMapContext();

  // -------------------------------- return true or false if a name is found.
  // -------------------------------- handleNameCheck function is also used in handleSaveArea.
  const handleNameCheck = (name: string): boolean => {
    const nameExists = allAreas.findIndex(area => area.name === name.trim());

    if (nameExists < 0) {
      if (name.trim()?.length > 3) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
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
      Alert.alert(
        'Name!',
        "'" +
          areaName +
          "' name already exists. Please, choose another name to save the area.",
        [{text: 'OK'}],
      );
    } else {
      setAllAreas([
        {
          name: areaName,
          coordinates: onPressCoordinates,
          totalArea: parseFloat(getArea().toFixed(2)),
        },
        ...allAreas,
      ]);
      Alert.alert('Saved!', "'" + areaName + "' is suceessfully saved.", [
        {text: 'OK'},
      ]);

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

      setAreaName('');
      setOnPressCoordinates([]);
      setDrawPolygon(false);
      setShowNameModal(false);
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
    await AsyncStorage.setItem('allAreas', JSON.stringify(allAreasDetails));
    setShowNameModal(false);
    bottomSheetModalRef.current?.close();
    // setOpenBottomSheet(false);
    Alert.alert('Updated!', 'The name is suceessfully updated.', [
      {text: 'OK'},
    ]);
    // setClearAllPolygons(true);
    // setAllAreas();
  };

  return (
    <Modal visible={showNameModal} animationType="fade" transparent={true}>
      <SafeAreaView style={[styles.saveNameModal, {}]}>
        <View style={styles.saveNamePrompt}>
          <Text style={styles.saveNamePromptTitle}>Name</Text>
          <Text style={styles.saveNamePromptDesc}>
            How do you call it? (The name should be different from the existing
            one. And, it should contain atleast 4 character.)
          </Text>
          <TextInput
            maxLength={15}
            value={areaName}
            clearButtonMode="always" //only for iOS
            onChangeText={setAreaName}
            keyboardType="ascii-capable"
            placeholder="Name"
            style={styles.areaName}
          />
          <View style={styles.saveModalButtons}>
            <Button
              style={[
                styles.saveModalBtn,
                {
                  borderColor: '#c1c1c1',
                },
              ]}
              mode="outlined"
              textColor="#007ab8"
              onPress={() => setShowNameModal(false)}>
              Cancel
            </Button>
            <Button
              style={styles.saveModalBtn}
              mode="contained"
              buttonColor="#007ab8"
              disabled={handleNameCheck(areaName)}
              onPress={() => {
                editName ? handleUpdateName() : handleSaveArea();
              }}>
              {editName ? 'Update' : 'Save'}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AreaModal;

const styles = StyleSheet.create({
  saveNameModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.41)',
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  saveNamePrompt: {
    top: 100,
    width: (width * 90) / 100,
    backgroundColor: '#eaeaea',
    borderRadius: 15,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveNamePromptTitle: {
    fontSize: 20,
    marginBottom: 5,
  },
  saveNamePromptDesc: {
    fontSize: 16,
    marginBottom: 15,
  },
  areaName: {
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c1c1c1',
    width: (width * 70) / 100,
    borderRadius: 10,
    marginTop: 0,
    padding: 8,
  },
  saveModalButtons: {
    flexDirection: 'row',
    marginTop: 15,
    width: (width * 70) / 100,
    justifyContent: 'space-between',
  },
  saveModalBtn: {
    width: (width * 33) / 100,
  },
});
