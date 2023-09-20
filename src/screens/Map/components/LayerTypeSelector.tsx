import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useMapContext} from '../MapContext';
import {Dialog, Pressable, Text} from '../../../components/ApplicationUILib';
import Icon from 'react-native-vector-icons/FontAwesome';
import {capitalize} from 'lodash';
import {SCREEN_WIDTH} from '../../../utils/constants';

const LayerTypeSelector = () => {
  const layers: layerType[] = ['standard', 'satellite', 'hybrid', 'terrain'];

  const {setOpenLayerBottomSheet, openLayerBottomSheet, mapType, setMapType} =
    useMapContext();

  return (
    <Dialog
      visible={openLayerBottomSheet}
      onDismiss={() => setOpenLayerBottomSheet(false)}
      width={SCREEN_WIDTH}
      height="70%"
      bottom={true}
      overlayBackgroundColor="transparent"
      containerStyle={styles.dialogContainer}
      renderPannableHeader={() => (
        <View style={styles.dialogHeader}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Pressable
              style={styles.dialofCloseBotton}
              onPress={() => {
                setOpenLayerBottomSheet(false);
              }}>
              <Icon name="chevron-down" size={13} color="#696969" />
            </Pressable>
          </View>
          <View style={styles.dialogContent}>
            <Text style={styles.dialogContentHeaderText}>Layers</Text>
          </View>
        </View>
      )}>
      <View style={{alignItems: 'center'}}>
        {layers?.map((layer, index) => (
          <Pressable
            // onPress={() => handleOnPressCard(item)}
            style={{width: SCREEN_WIDTH, alignItems: 'center'}}
            key={index}
            onPress={() => {
              mapType != layer && setMapType(layer);
              setOpenLayerBottomSheet(false);
            }}>
            <View
              style={[
                styles.pressableSelectorsView,
                {
                  borderWidth: mapType == layer ? 1.5 : 1,
                  borderColor: mapType == layer ? 'green' : 'grey',
                  width: (SCREEN_WIDTH * 95) / 100,
                },
              ]}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  fontSize: 15,
                  color: mapType == layer ? 'green' : 'grey',
                }}>
                {capitalize(layer)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Dialog>
  );
};

export default LayerTypeSelector;

const styles = StyleSheet.create({
  dialogContainer: {
    zIndex: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dialofCloseBotton: {
    width: 80,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    borderRadius: 10,
    padding: 4,
    marginVertical: 10,
  },
  dialogHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  dialogContent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 14,
  },
  dialogContentHeaderText: {
    fontSize: 19,
    color: '#000',
  },
  pressableSelectorsView: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
