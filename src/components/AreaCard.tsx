import React, {PropsWithChildren} from 'react';
import {StyleSheet, View, Text, Dimensions, Alert} from 'react-native';
import {IconButton, Card} from 'react-native-paper';
import {useMapContext} from '../MapContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// type AreaCardProps = NativeStackScreenProps<RootStackParamList, 'AreaCard'>;
const {width} = Dimensions.get('window');

type AreaCardProps = PropsWithChildren<{
  item: areaDetails;
}>;

const AreaCard = ({item}: AreaCardProps) => {
  const {
    setDrawPolygon,
    bottomSheetModalRef,
    setOpenBottomSheet,
    centerCoordOfPolygon,
    mapViewRef,
    setClearAllPolygons,
    areaToDisplay,
    setAreaToDisplay,
    setEditName,
    setOldName,
    setAreaName,
    setShowNameModal,
    allAreas,
    setAllAreas,
  } = useMapContext();

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
          if (areasToDisplay?.length < 1) {
            setClearAllPolygons(false);
          }
          Alert.alert('Deleted!', "'" + name + "' is suceessfuly deleted.", [
            {text: 'OK'},
          ]);
        },
      },
    ]);
  };

  return (
    <Card style={styles.areaCard} onPress={() => handleOnPressCard(item)}>
      <Card.Content>
        <View>
          <View style={styles.cardContentView}>
            <Text style={styles.areaNameText}>Name: {item.name}</Text>
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
  );
};

export default AreaCard;

const styles = StyleSheet.create({
  areaCard: {
    backgroundColor: 'whitesmoke',
    paddingHorizontal: 2,
    margin: 5,
    width: (width * 85) / 100,
    marginBottom: 15,
    borderRadius: 15,
  },
  cardContentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  areaNameText: {
    fontSize: 20,
  },
});
