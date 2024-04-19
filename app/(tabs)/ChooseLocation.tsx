import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AddressPickup from '@/components/AddressPickup';
import CustomBtn from '@/components/CustomBtn';
import { showError } from '@/helper/helperFunction';

interface Coordinates {
  latitude?: number;
  longitude?: number;
}

interface ChooseLocationProps {
  route: {
    params: {
      getCordinates: (coordinates: Coordinates) => void;
    };
  };
}

const ChooseLocation: React.FC<ChooseLocationProps> = (props) => {
  const navigation = useNavigation();

  const [state, setState] = useState({
    destinationCords: {} as Coordinates,
  });

  const { destinationCords } = state;

  const checkValid = (): boolean => {
    if (Object.keys(destinationCords).length === 0) {
      showError('Please enter your destination location');
      return false;
    }
    return true;
  };

  const onDone = () => {
    const isValid = checkValid();
    if (isValid) {
      props.route.params.getCordinates(destinationCords);
      navigation.goBack();
    }
  };

  const fetchDestinationCords = (lat: number, lng: number, zipCode: string, cityText: string) => {
    console.log("zip code==>>>", zipCode);
    console.log('city texts', cityText);
    setState({
      ...state,
      destinationCords: {
          latitude: lat,
          longitude: lng,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: 'white', flex: 1, padding: 24 }}
      >
        <View style={{ marginBottom: 16 }} />
        <AddressPickup
          placheholderText="Enter Destination Location"
          fetchAddress={fetchDestinationCords}
        />
        <CustomBtn
          btnText="Done"
          onPress={onDone}
          btnStyle={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChooseLocation;