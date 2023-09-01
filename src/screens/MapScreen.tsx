import {
  Alert,
  Dimensions,
  StyleSheet,
  View,
  Modal,
  StatusBar,
} from 'react-native';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps';
import {computeArea, LatLng} from 'spherical-geometry-js/src/index';
import {Button, IconButton, Card, Text} from 'react-native-paper';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MapScreenProps = NativeStackScreenProps<RootStackParamList, 'MapScreen'>;

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const MapScreen = ({navigation}: MapScreenProps) => {
  // ------------------------------------ Variables Declared
  const [onPressCoordinates, setOnPressCoordinates] = useState<
    onPressCoordinates[] | []
  >([]);

  const [drawPolygon, setDrawPolygon] = useState<boolean>(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const [allAreas, setAllAreas] = useState<areaDetails[] | []>([]);

  useEffect(() => {
    const retreiveData = async () => {
      const allData = await AsyncStorage.getItem('allAreas');
      const allDataArray = allData && JSON.parse(allData);
      if (Array.isArray(allDataArray)) {
        setAllAreas(allDataArray);
      } else {
        setAllAreas([]);
      }
    };
    retreiveData();
  }, []);

  const [areaToDisplay, setAreaToDisplay] = useState<areaDetails[] | []>([]);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [areaName, setAreaName] = useState<string>('');

  // console.log(onPressCoordinates);

  const [clearAllPolygons, setClearAllPolygons] = useState<Boolean>(false);

  // editName usestate variable is created for a model. With this variable the same modal can be used to create or edit the name of the areas.
  const [editName, setEditName] = useState<boolean>(false);
  const [oldName, setOldName] = useState<string>('');

  // ----------------------------------------^ Variables declated

  const centerCoordOfPolygon = (
    coordinates: onPressCoordinates[],
  ): onPressCoordinates => {
    let x = coordinates.map(c => c.latitude);
    let y = coordinates.map(c => c.longitude);

    let minX = Math.min.apply(null, x);
    let maxX = Math.max.apply(null, x);

    let minY = Math.min.apply(null, y);
    let maxY = Math.max.apply(null, y);

    return {
      latitude: (minX + maxX) / 2,
      longitude: (minY + maxY) / 2,
    };
  };

  // ----------------------------------------------------------- Function calculates area
  const getArea = (): number | any => {
    if (onPressCoordinates.length > 2) {
      let latLngs = onPressCoordinates.map(
        coord => new LatLng(coord.latitude, coord.longitude),
      );

      if (computeArea(latLngs)) {
        return computeArea(latLngs) * 10.67; //ft. sq.
      }
      return 0;
    }
  };

  // console.log(getArea());

  // ----------------------------------------------------------- Bottomsheet
  const bottomSheetModalRef = useRef<any>(null);
  const mapViewRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['25%', '48%', '80%'], []);

  // -------------------------------- close bootom sheet
  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      setOpenBottomSheet(false);
    }
  }, []);

  // --------------------------------- Delete Area
  const handleDeleteArea = (name: string | any) => {
    Alert.alert('Delete!', "Do you want to delete the Area '" + name + "'?", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.setItem(
            'allAreas',
            JSON.stringify(allAreas.filter(area => area.name !== name)),
          );
          setAllAreas(allAreas.filter(area => area.name !== name));
          const areasToDisplay = areaToDisplay.filter(
            area => area.name !== name,
          );
          setAreaToDisplay(areasToDisplay);
          if (areasToDisplay.length < 1) {
            setClearAllPolygons(false);
          }
          Alert.alert('Deleted!', "'" + name + "' is suceessfuly deleted.", [
            {text: 'OK'},
          ]);
        },
      },
    ]);
  };

  // -------------------------------- return true or false if a name is found.
  // -------------------------------- handleNameCheck function is also used in handleSaveArea.
  const handleNameCheck = (name: string): boolean => {
    const nameExists = allAreas.findIndex(area => area.name === name);

    if (nameExists < 0) {
      if (name.trim().length > 3) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
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
    for (let i = 0; i < allAreasDetails.length; i++) {
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

  // ----------------------------------------------------------- On selecting card from bottom sheet
  const handleOnPressCard = (item: areaDetails | any) => {
    setDrawPolygon(false);
    // setOnPressCoordinates(item.coordinates);
    bottomSheetModalRef.current?.close();
    setOpenBottomSheet(false);
    // console.log(centerCoordOfPolygon(item.coordinates));
    const coordinates = centerCoordOfPolygon(item.coordinates);

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
    setClearAllPolygons(true);
    if (areaToDisplay.findIndex(area => area.name === item.name) === -1) {
      setAreaToDisplay([...areaToDisplay, item]);
    }
    // console.log(areaToDisplay);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar animated={true} />
      <BottomSheetModalProvider>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {
            // ---------------------------------------------------- Modal
            <Modal
              visible={showNameModal}
              animationType="fade"
              transparent={true}>
              <SafeAreaView style={[styles.saveNameModal, {}]}>
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
          }
          {/* ---------------------------------------------------- Icons over map */}
          <View style={styles.buttonView}>
            {/* ---------------------------- Clear Button to clear all polygons */}
            {clearAllPolygons && (
              <IconButton
                icon="vector-square-remove"
                mode="contained"
                size={20}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 50,
                  zIndex: 1,
                }}
                iconColor="#000000"
                containerColor="#ffffff"
                onPress={() => {
                  setClearAllPolygons(false);
                  setAreaToDisplay([]);
                }}
              />
            )}
            {!drawPolygon && (
              <>
                {openBottomSheet ? (
                  <IconButton
                    icon="window-close"
                    mode="contained"
                    size={20}
                    style={[styles.styleButton]}
                    iconColor="#000000"
                    containerColor="#ffffff"
                    onPress={() => {
                      bottomSheetModalRef.current?.close();
                      setOpenBottomSheet(false);
                      setOnPressCoordinates([]);
                    }}
                  />
                ) : (
                  <IconButton
                    icon="menu"
                    mode="contained"
                    size={20}
                    style={[styles.styleButton]}
                    iconColor="#000000"
                    containerColor="#ffffff"
                    onPress={() => {
                      bottomSheetModalRef.current?.present();
                      setOpenBottomSheet(true);
                    }}
                  />
                )}

                <IconButton
                  icon="shape-polygon-plus"
                  mode="contained"
                  style={[styles.styleButton]}
                  size={20}
                  iconColor="#000000"
                  containerColor="#ffffff"
                  onPress={() => {
                    setDrawPolygon(true);
                    bottomSheetModalRef.current?.close();
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
            {drawPolygon && onPressCoordinates.length > 0 && (
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
            {drawPolygon && onPressCoordinates.length > 2 && (
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
          {/* ---------------------------------------------------- MapView */}
          <MapView
            loadingEnabled={true}
            ref={mapViewRef}
            showsCompass={false}
            style={styles.mapWindows}
            region={{
              latitude: 30.728383092394722,
              longitude: 76.77813406804023,
              latitudeDelta: 0.09,
              longitudeDelta: 0.09,
            }}
            onPress={data => {
              drawPolygon &&
                setOnPressCoordinates([
                  ...onPressCoordinates,
                  data.nativeEvent.coordinate,
                ]);
            }}>
            {useMemo(
              () =>
                areaToDisplay?.map((area, index) => (
                  <View key={index}>
                    <Polygon
                      coordinates={area.coordinates}
                      // Setting random color of the polygon.
                      fillColor={'#2f95fe5b'}
                      strokeWidth={2}></Polygon>
                    <Marker coordinate={centerCoordOfPolygon(area.coordinates)}>
                      <View
                        style={{
                          shadowOffset: {width: 0, height: 0},
                          shadowOpacity: 1,
                          shadowRadius: 5,
                          backgroundColor: '#333333',
                          borderRadius: 10,
                          padding: 4,
                        }}>
                        <Text
                          style={{
                            color: '#ffffff',
                            fontSize: 20,
                          }}>
                          {' ' + area.name + ' '}
                        </Text>
                      </View>
                    </Marker>
                  </View>
                )),
              [areaToDisplay],
            )}
            {onPressCoordinates.length > 0 && (
              <>
                {onPressCoordinates.length < 3 ? (
                  <Polyline
                    coordinates={onPressCoordinates}
                    fillColor={'#7db3c76b'}
                    strokeWidth={2}></Polyline>
                ) : (
                  <>
                    <Polygon
                      coordinates={onPressCoordinates}
                      fillColor={'#7db3c76b'}
                      strokeWidth={2}></Polygon>
                    <Marker
                      key={
                        onPressCoordinates[0].latitude +
                        onPressCoordinates[0].longitude
                      }
                      coordinate={centerCoordOfPolygon(onPressCoordinates)}>
                      <Text> </Text>
                    </Marker>
                  </>
                )}
              </>
            )}
            {onPressCoordinates?.map((latlon, index) => (
              <Marker key={index} coordinate={latlon} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.markerCircle} />
              </Marker>
            ))}
          </MapView>

          {/* ---------------------------------------------------- Bottomsheet */}
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
                renderItem={({item}) => (
                  <Card
                    style={styles.areaCard}
                    onPress={() => handleOnPressCard(item)}>
                    <Card.Content>
                      <View>
                        <View style={styles.cardContentView}>
                          <Text style={styles.areaNameText}>
                            Name: {item.name}
                          </Text>
                          <IconButton
                            icon="square-edit-outline"
                            mode="outlined"
                            iconColor="#000000"
                            size={18}
                            onPress={() => {
                              setEditName(true);
                              setOldName(item.name);
                              setAreaName(item.name);
                              setShowNameModal(true);
                            }}
                          />
                        </View>
                        <View style={styles.cardContentView}>
                          <Text style={styles.areaNameText}>
                            Area: {item.totalArea.toLocaleString('hi')} sq. ft.
                          </Text>
                          <IconButton
                            icon="delete"
                            iconColor="#000000"
                            mode="outlined"
                            size={18}
                            onPress={() => handleDeleteArea(item.name)}
                          />
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                )}
              />
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  mapWindows: {
    width: '100%',
    height: height,
  },
  buttonView: {
    position: 'absolute',
    zIndex: 1,
    top: 20,
    right: 25,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  styleButton: {
    marginBottom: 10,
    zIndex: 1,
  },
  totalAreaText: {
    position: 'absolute',
    fontSize: 22,
    width: '100%',
    textAlign: 'left',
    zIndex: 1,
    textShadowColor: '#fec14f',
  },
  markerCircle: {
    backgroundColor: 'rgba(54, 134, 214, 0.5)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
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
  areaCard: {
    backgroundColor: 'whitesmoke',
    paddingHorizontal: 2,
    margin: 5,
    width: (width * 85) / 100,
    marginBottom: 15,
    borderRadius: 15,
  },

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
  areaNameText: {
    fontSize: 20,
  },
  horizontalLine: {
    alignSelf: 'center',
    borderBottomColor: 'gainsboro',
    borderBottomWidth: 1,
    width: (width * 65) / 100,
    marginBottom: 15,
  },
  cardContentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
});
