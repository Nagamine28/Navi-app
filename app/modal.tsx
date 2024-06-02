import { StatusBar } from "expo-status-bar";
import { Button, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Text, View } from "@/components/Themed";
import React from "react";
import SentMovie from "@/components/SentMovie";

export default function ModalScreen() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isMovie, setIsMovie] = React.useState(false);
  // Test
  // const background = require("../assets/videos/test.mp4");
  return (
    <View style={styles.container}>
      {isMovie ? (
        <Video
          ref={video}
          style={styles.video}
          // Test
          // source={background}
          source={{
            uri: "http://18.176.53.200/big_buck_bunny.mp4",
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      ) : (
        <>
          <SentMovie/>
        </>
      )}
    </View>
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
  }
});
