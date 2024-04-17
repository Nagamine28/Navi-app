import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MapView, { Marker } from "react-native-maps";

import MapViewDirections from 'react-native-maps-directions';
import { StyleSheet, Dimensions, Platform } from "react-native";

import { locationPermission, getCurrentLocation } from '../../helper/helperFunction';

// smooth tracking
export default function TabOneScreen() {
  const [state, setState] = useState({
    curLoc: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  })

  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);

  const mapRef = useRef<MapView>(null);

  const getLiveLocation = async () => {
    const locPermissionDenied: string = await locationPermission();
    // ここに位置情報の取得と処理のコードを追加します
    console.log(locPermissionDenied)
    if (locPermissionDenied === 'granted') {
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
        })
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.00461,
          longitudeDelta: 0.00210,
        });
      } catch (error) {
        setPermissionStatus("err");
        console.error(error);
      }
    }
  }

  const ref = useRef<MapView>(null);
  // effects
    const onMapReadyHandler = useCallback(() => {
      if (Platform.OS === 'ios') {
        ref?.current?.fitToElements(false);
      } else {
        ref?.current?.fitToCoordinates([origin, destination], {
          animated: true,
          edgePadding: {
            top: 150,
            right: 50,
            bottom: 50,
            left: 50,
          },
        });
      }
    }, [ref]);

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
      <View>
        <Text>Location Permission Status: {permissionStatus}</Text>
        <Text>Altitude: {altitude}</Text>
      </View>

      <MapView style={styles.map} onMapReady={onMapReadyHandler} ref={ref}>
        <Marker coordinate={state.curLoc} identifier={"mk1"} />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={"YOUR_API_KEY"}
        />
      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.85,
  },
});