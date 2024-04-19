import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Geocoder from "react-native-geocoding";

interface Coordinate { 
  latitude: number;
  longitude: number;
}

/**
 * 目的地の入力・検索を担うコンポーネント
 *
 */
export const InputDestinationArea = (props) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  Geocoder.init(apiKey, { language: "ja" });

  const [SearchAddress, onChangeSearchAddress] = React.useState("Input Here");
  const [destinationCords, setDestinationCords] = useState<Coordinate>({
    latitude: 0,
    longitude: 0,
  });

  /**
   * 緯度経度の検索
   *
   */
  const searchCoordinates = async () => {
    await Geocoder.from(SearchAddress)
      .then((json) => {
        var location = json.results[0].geometry.location;
        setDestinationCords({
          latitude: location.lat,
          longitude: location.lng,
        });
        props.setCoordinate(location.lat, location.lng);
      })
      .catch((error) => console.warn(error));
  };

  return (
    <KeyboardAvoidingView>
      <Text>Where are you going..?</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeSearchAddress}
        value={SearchAddress}
      />
      <TouchableOpacity onPress={searchCoordinates} style={styles.inputStyle}>
        <Text>Serch！</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputStyle: {
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    height: 25,
    justifyContent: "center",
    marginTop: 16,
  },
});

export default InputDestinationArea;
