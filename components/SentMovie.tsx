import { Text } from "@/components/Themed";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";


export default function SentMovie() {
  return (
    <>
      <Text>動画はありません</Text>
      <Text>今なら動画を提供してくれれば有料プランが使えるよ</Text>
      <TouchableOpacity style={[styles.inputStyle, styles.searchButton]}>
        <Text style={{ color: "white" }}>動画を送信する</Text>
      </TouchableOpacity>
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
