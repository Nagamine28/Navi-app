import { Text } from "@/components/Themed";
import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function SentMovie() {
	const [image, setImage] = useState(null);

	const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <>
      <Text>動画はありません</Text>
      <Text>今なら動画を提供してくれれば有料プランが使えるよ</Text>
      <TouchableOpacity
        style={[styles.inputStyle, styles.searchButton]}
        onPress={pickImage}
      >
        <Text style={{ color: "white" }}>動画を送信する</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 500,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
		width: 200,
		height: 200,
		borderRadius: 100,
		marginTop: 10,
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
    marginTop: 10, // 上部マージンをリセット
  },
  textColor: {
    color: "white",
  },
});
