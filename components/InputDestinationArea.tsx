import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Geocoder from "react-native-geocoding";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Props {
  setCoordinate: (lat: number, lng: number) => void;
  updateCurLoc: () => void;
}

/**
 * 目的地の入力・検索を担うコンポーネント
 *
 */
export const InputDestinationArea = (props : Props) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  Geocoder.init(apiKey, { language: "ja" });

  const [SearchAddress, onChangeSearchAddress] = React.useState("");
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
        props.updateCurLoc();
        props.setCoordinate(location.lat, location.lng);
      })
      .catch((error) => console.warn(error));
  };

  return (
    <KeyboardAvoidingView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeSearchAddress}
        value={SearchAddress}
        placeholder="目的地を入力してください"  // ヒントテキストの設定
        placeholderTextColor="lightgray"  // ヒントテキストの色の設定
      />
      <TouchableOpacity onPress={searchCoordinates} style={[styles.inputStyle, styles.searchButton]}>
        <Text style={styles.InputTxt}>検索</Text>
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
    backgroundColor: "black",
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    height: 25,
    justifyContent: "center",
    marginTop: 0,
  },
  searchButton: {
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: "#6C9BD2", // 青色に設定
    borderRadius: 20, // 角を丸める
    height: 40, // ボタンの高さを設定
    width: '100%',
    marginTop: 5, // 上部マージンをリセット
  },
  InputTxt:{
    color:"white",
    fontSize: 20,
  }

});

export default InputDestinationArea;
