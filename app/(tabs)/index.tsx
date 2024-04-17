import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import React, { useState, useEffect } from 'react';
import MapView ,{Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StyleSheet, Dimensions } from 'react-native';

import { locationPermission, getCurrentLocation } from '../../helper/helperFunction';

// smooth tracking
export default function TabOneScreen() {

  const origin = {latitude: 37.7749, longitude: -122.4194}; // 例としてサンフランシスコ
  const destination = {latitude: 34.0522, longitude: -118.2437}; // 例としてロサンゼルス

  const [state, setState] = useState({
    curLoc: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  })

  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);

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
      } catch (error) {
        setPermissionStatus("err");
        console.error(error);
      }
    }
  }

  useEffect(() => {
      getLiveLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Text>Location Permission Status: {permissionStatus}</Text>
      <Text>Altitude: {altitude}</Text>
      <MapView style={styles.map} >
        <Marker coordinate={state.curLoc} />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={'YOUR_API_KEY'}
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
    height: Dimensions.get('window').height,
  },
});