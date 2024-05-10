import React from "react";
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
  curLoc: Coordinate;
  setCoordinate: (lat: number, lng: number) => void;
  setCurLoc: React.Dispatch<React.SetStateAction<Coordinate>>;
  // updateCurLoc: () => void;
}

/**
 * 目的地の入力・検索を担うコンポーネント
 *
 */
export const InputDestinationArea = (props : Props) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  Geocoder.init(apiKey, { language: "ja" });

  const [SearchAddress, onChangeSearchAddress] = React.useState("");

  /**
   * 緯度経度の検索
   *
   */
  const searchCoordinates = async () => {
    const curLoc = props.curLoc
    props.setCurLoc(curLoc)
    await Geocoder.from(SearchAddress)
    .then((json) => {
      var location = json.results[0].geometry.location;
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
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    height: 25,
    justifyContent: "center",
    marginTop: 16,
  },
  searchButton: {
    textShadowColor: "white",
    backgroundColor: "#6C9BD2", // 青色に設定
    height: 40, // ボタンの高さを設定
    marginTop: 0, // 上部マージンをリセット
  },
  InputTxt:{
    color:"white",
    fontSize: 20,
  }

});

export default InputDestinationArea;
