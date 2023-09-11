import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Modal,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import React, {useRef} from 'react';
import {useMapContext} from '../MapContext';
import {TextInput} from 'react-native-gesture-handler';
import {computeArea, LatLng} from 'spherical-geometry-js/src/index';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const {width} = Dimensions.get('window');

const AreaModal = () => {
  const {
    showNameModal,
    areaName,
    setAreaName,
    setShowNameModal,
    allAreas,
    setAllAreas,
    onPressCoordinates,
    setOnPressCoordinates,
    setDrawPolygon,
    setAreaToDisplay,
    areaToDisplay,
  } = useMapContext();

  const kbRef = useRef<any>();
  // const scrollToInput = (reactNode: any) => {
  //   // Add a 'scroll' ref to your ScrollView
  //   kbRef.current.scrollToFocusedInput(reactNode);
  // };

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
      setDrawPolygon(false);
      setShowNameModal(false);

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
    }
  };

  // console.log('show modal');

  return (
    <Modal visible={showNameModal} animationType="fade" transparent={true}>
      <SafeAreaView style={[styles.saveNameModal, {}]}>
        <KeyboardAwareScrollView
          // innerRef={ref => console.log(ref)}
          ref={kbRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableAutomaticScroll
          contentContainerStyle={{
            position: 'relative',
            flex: 1,
            justifyContent: 'center',
          }}
          // onKeyboardWillShow={(frames: Object) => {
          //   // console.log('Keyboard event', frames);
          // }}
        >
          <View style={styles.saveNamePrompt}>
            <Text style={styles.saveNamePromptTitle}>Name</Text>
            <Text style={styles.saveNamePromptDesc}>
              How do you call it? (The name should be different from the
              existing one. And, it should contain atleast 4 character.)
            </Text>
            <TextInput
              maxLength={15}
              value={areaName}
              clearButtonMode="always" //only for iOS
              onChangeText={setAreaName}
              keyboardType="ascii-capable"
              placeholder="Name"
              style={styles.areaName}
              // onFocus={event => {
              //   // kbRef.current.scrollToFocusedInput(event.target);
              //   kbRef.current.scrollToPosition(0, 100);
              //   console.log(kbRef.current.scrollToPosition(0, 100));
              // }}
              // onFocus={() => console.log(kbRef)}
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
                  handleSaveArea();
                }}>
                Save
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AreaModal;

const styles = StyleSheet.create({
  saveNameModal: {
    zIndex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.41)',
    height: '100%',
    width: '100%',
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  saveNamePrompt: {
    // top: 100,
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
