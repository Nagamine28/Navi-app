import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { StyleSheet, Dimensions } from "react-native";

import {
  locationPermission,
  getCurrentLocation,
} from "../../helper/helperFunction";

// smooth tracking
export default function TabOneScreen() {
  const [state, setState] = useState({
    curLoc: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);

  const mapRef = useRef<MapView>(null);

  const getLiveLocation = async () => {
    const locPermissionDenied: string = await locationPermission();
    // ここに位置情報の取得と処理のコードを追加します
    console.log(locPermissionDenied);
    if (locPermissionDenied === "granted") {
      try {
        let location = await getCurrentLocation();
        console.log(location);
        setPermissionStatus(locPermissionDenied);
        setAltitude(location.coords.altitude);
        setState({
          curLoc: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.00461,
          longitudeDelta: 0.0021,
        });
      } catch (error) {
        setPermissionStatus("err");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(getLiveLocation, 6000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text>Location Permission Status: {permissionStatus}</Text>
      <Text>Altitude: {altitude}</Text>
      <MapView ref={mapRef} style={styles.map}>
        <Marker coordinate={state.curLoc} />
      </MapView>
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height *0.8,
  },
});
