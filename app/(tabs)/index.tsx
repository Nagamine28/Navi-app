import * as React from 'react';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default function App() {
  const origin = {latitude: 37.7749, longitude: -122.4194}; // 例としてサンフランシスコ
  const destination = {latitude: 34.0522, longitude: -118.2437}; // 例としてロサンゼルス

  return (
    <View style={styles.container}>
      <MapView style={styles.map} >
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});