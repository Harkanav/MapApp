import {StyleSheet, Text, View, Image, Platform, Animated} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {SCREEN_WIDTH} from '../../../utils/constants';
import {IconButton} from 'react-native-paper';
import {Pressable, Button} from '../../../components/ApplicationUILib';
import {useMapContext} from '../MapContext';
import {
  getAddresFromLatlong,
  getMelissaData,
  getStreetViewURL,
} from '../../../utils/map';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const animationHomeowner = new Animated.Value(0);

const HomeOwnerCard = () => {
  const {
    setShowHomeOwnerCard,
    customMarker,
    setSelectedMark,
    isMapMove,
    setIsMapMove,
    selectedMark,
    showJobDetailsCard,
    setShowJobDetailsCard,
    setcustomerInfo,
    customerInfo,
    showLiveLocation,
  } = useMapContext();

  const fetchPropertyInfo = useCallback(async (blockInfo: any) => {
    try {
      const blockDetails = await getMelissaData(blockInfo);
      setcustomerInfo(blockDetails);
      // console.log(blockDetails, 25);
    } catch (error) {
      console.log('Error in fetchPropertyInfo', error);
    }
  }, []);

  const fetchAddresFromLatlong = useCallback(async () => {
    try {
      const addressDetails = await getAddresFromLatlong({
        latitude: customMarker?.latitude,
        longitude: customMarker?.longitude,
      });
      // console.log(addressDetails);
      setSelectedMark({...addressDetails});
      fetchPropertyInfo(
        addressDetails?.formattedAddress + ', ' + addressDetails?.zipcode,
      );
    } catch (error) {
      console.log('Error in fetching address from latlong', error);
    }
  }, [customMarker, setSelectedMark, fetchPropertyInfo]);

  const getValue = () => {
    const value = showJobDetailsCard
      ? Platform.OS === 'ios'
        ? 72
        : 78
      : Platform.OS === 'ios'
      ? 128
      : 126;

    return value;
  };

  const onTapCard = (value: number) => {
    Animated.timing(animationHomeowner, {
      toValue: value,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsMapMove(false);
  };

  useEffect(() => {
    if (isMapMove || showLiveLocation) {
      onTapCard(getValue());
    }
  }, [isMapMove, showLiveLocation]);

  useEffect(() => {
    onTapCard(0);
  }, [customMarker]);

  useEffect(() => {
    fetchAddresFromLatlong();
  }, [fetchAddresFromLatlong]);

  const CloseButton = (onPress: any) => {
    return (
      <IconButton
        icon="window-close"
        mode="contained"
        style={[styles.styleIconButton]}
        size={16}
        iconColor="#ffffff"
        containerColor={Platform.OS === 'ios' ? '#0000005c' : '#0000009c'}
        {...onPress}
      />
    );
  };

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        transform: [{translateY: animationHomeowner}],
      }}>
      {showJobDetailsCard ? (
        <Pressable onPress={() => onTapCard(0)}>
          <View style={styles.PropertyDetailsCardContainer}>
            <View style={[styles.dialogHeader]}>
              {
                // ----------------------------------- Back button
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Pressable
                    onPress={() => {
                      onTapCard(0);
                      setShowJobDetailsCard(false);
                      // setShowHomeOwnerCard(true);
                    }}
                    style={{paddingRight: 15}}>
                    <MaterialIcon name="arrow-left" size={28} color="#333" />
                  </Pressable>
                  <Text style={styles.dialogHeaderText}>Property Details</Text>
                </View>
              }

              <>
                <CloseButton
                  onPress={() => {
                    onTapCard(200);
                    setTimeout(() => {
                      setShowHomeOwnerCard(false);
                      setShowJobDetailsCard(false);
                    }, 200);
                  }}
                />
              </>
            </View>
            <View style={styles.PropertyDetailsView}>
              <Text style={{color: '#000000'}}>
                Owner Name: {customerInfo?.first_name ?? 'NA'}{' '}
                {customerInfo?.first_name}
              </Text>
              <Text style={{color: '#000000'}}>
                Area sqft: {customerInfo?.area_sqft ?? 'NA'}
              </Text>
              <Text style={{color: '#000000'}}>
                Living Since: {customerInfo?.owned_or_rented ?? 'NA'}
              </Text>
              <Text style={{color: '#000000'}}>
                Year Built: {customerInfo?.year_built ?? 'NA'}
              </Text>
              {/* <Text>Sale Date: {customerInfo?.year_built ?? 'NA'}</Text> */}
              <Text style={{color: '#000000'}}>
                Market Value: {customerInfo?.market_value ?? 'NA'}
              </Text>
              {/* <Text>Date Data Collected: {customerInfo?.year_built ?? 'NA'}</Text> */}
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.HomeOwnerCardContainer}>
          <Pressable onPress={() => onTapCard(0)}>
            <Image
              source={{
                uri: customMarker && getStreetViewURL(customMarker),
              }}
              style={styles.HomeOwnerCardImage}
              alt="Gadgets"
            />
            <CloseButton
              onPress={() => {
                onTapCard(400);
                setTimeout(() => {
                  setShowHomeOwnerCard(false);
                }, 200);
              }}
            />
            <View style={styles.HomeOwnerCardBody}>
              <Text style={styles.HomeOwnerCardAddress}>
                {selectedMark?.formattedAddress ?? 'Address is not available'}
              </Text>
            </View>
          </Pressable>
          <Button
            style={styles.PropertyInforButton}
            backgroundColor="#22963f"
            onPress={() => {
              // setShowHomeOwnerCard(false);
              setShowJobDetailsCard(true);
            }}
            label="Details"
          />
        </View>
      )}
    </Animated.View>
  );
};

export default HomeOwnerCard;

const styles = StyleSheet.create({
  HomeOwnerCardContainer: {
    width: SCREEN_WIDTH * 0.93,
    marginBottom: Platform.OS === 'ios' ? 100 : 80,
    margin: 3,
    borderRadius: 10,
    elevation: 8,
    backgroundColor: 'white',
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bcbcbc',
    paddingHorizontal: 8,
  },
  HomeOwnerCardImage: {
    height: 180,
    marginBottom: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  HomeOwnerCardBody: {
    // flex: 1,
    // flexGrow: 1,
    paddingHorizontal: 12,
  },
  HomeOwnerCardAddress: {
    color: '#0D0D0D',
    fontSize: 15,
    // fontWeight: 'bold',
    marginBottom: 12,
  },
  HomeOwnerCardLabel: {color: '#0D0D0D', fontSize: 18, marginBottom: 6},
  HomeOwnerCardDescription: {
    color: '#242B2E',
    fontSize: 14,
    marginBottom: 12,
    marginTop: 6,
  },
  HomeOwnerCardFooter: {
    color: '#0D0D0D',
    textAlign: 'right',
    paddingBottom: 12,
  },
  whiteText: {
    color: '#bcbcbc',
  },
  darkText: {
    color: '#333',
  },
  styleIconButton: {
    position: 'absolute',
    top: 11,
    right: 5,
    marginBottom: 10,
    zIndex: 1,
  },
  PropertyInforButton: {
    width: SCREEN_WIDTH * 0.35,
    // borderWidth: 0.5,
    borderRadius: 5,
    padding: 15,
    margin: 10,
  },

  // Job Details
  PropertyDetailsCardContainer: {
    width: SCREEN_WIDTH * 0.93,
    marginBottom: Platform.OS === 'ios' ? 100 : 80,
    margin: 3,
    borderRadius: 10,
    elevation: 8,
    backgroundColor: 'white',
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  dialogHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    width: SCREEN_WIDTH * 0.9,
  },
  dialogHeaderText: {
    // fontFamily: 'Montserrat-ExtraBold',
    fontSize: 20,
    color: '#000',
  },
  PropertyDetailsView: {
    padding: 10,
  },
});
