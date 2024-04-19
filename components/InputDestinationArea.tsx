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
} from "react-native";
import { Loader } from "@googlemaps/js-api-loader";

export const InputDestinationArea= () => {
  
  const loader = new Loader({
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const searchCoordinates = async () => {
    console.log("TEst");
    loader.load().then(() => {
      console.log("Loaded");
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: "東京都千代田区" }, (results, status) => {
        if (status == "OK" && results![0].geometry?.location !== undefined) {
          console.log(results![0].geometry?.location);
        }
      });
    })
    console.log("Fin");
  }

  return (
    <>
      <Text>Where are you going..?</Text>
      <TouchableOpacity onPress={searchCoordinates} style={styles.inputStyle}>
        <Text>Choose Location</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    marginTop: 16,
  },
});


export default InputDestinationArea;