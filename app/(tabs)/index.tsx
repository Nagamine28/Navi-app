import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import MapView, { MapMarker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getCurrentLocation } from '../../helper/helperFunction';
import imagePath from '../../constants/imagePath';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface State {
  curLoc: Coordinate;
  destinationCords: Coordinate;
  coordinate: AnimatedRegion;
  time: number;
  distance: number;
  heading: number;
}

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>(null);

  const [state, setState] = useState<State>({
    curLoc: {
      latitude: 30.7046,
      longitude: 77.1025,
    },
    destinationCords: { latitude: 0, longitude: 0 },
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  const { curLoc, time, distance, destinationCords, coordinate, heading } = state;

  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = async () => {
    try {
      const { latitude, longitude, heading } = await getCurrentLocation();
      console.log("get live location after 4 second", heading)
      animate(latitude, longitude)
      setState((prevState) => ({
        ...prevState,
        curLoc: { latitude, longitude },
        coordinate: new AnimatedRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }),
      }));
    } catch (error) {
      console.log('Error while getting current location: ', error);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const onPressLocation = async () => {
    navigation.navigate('chooseLocation', { getCordinates: fetchValue });
  };

  const fetchValue = (data: { destinationCords: Coordinate }) => {
    setState((prevState) => ({
      ...prevState,
      destinationCords: data.destinationCords,
    }));
  }

  const animate = (latitude: number, longitude: number) => {
    const newCoordinate = {
      latitude,
      longitude,
    };
    if (markerRef.current) {
      markerRef.current.animateMarkerToCoordinate(
        newCoordinate,
        7000,
      );
    }
  };

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: curLoc.latitude,
      longitude: curLoc.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const fetchTime = (d: number, t: number) => {
    setState((prevState) => ({
      ...prevState,
      time: t,
      distance: d,
    }));
  };

  return (
    <View style={styles.container}>
      {distance !== 0 && time !== 0 && (
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <Text>Time left: {time.toFixed(0)} </Text>
          <Text>Distance left: {distance.toFixed(0)}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            ...curLoc,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <MapMarker.Animated
            ref={markerRef}
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude
            }}>
            <Image
              source={imagePath.icBike}
              style={{
                width: 40,
                height: 40,
                transform: [{ rotate: `${heading}deg` }],
              }}
              resizeMode='contain'
            />
          </MapMarker.Animated>
          {Object.keys(destinationCords).length > 0 && (
            <MapMarker coordinate={destinationCords} image={imagePath.icGreenMarker} />>
          )}
          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={curLoc}
              destination={destinationCords}
              apikey='AIzaSyDNDqsqCHD2WMG9l-w58WIudhAu7w_0UCU'
              strokeWidth={6}
              strokeColor='red'
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`)
                console.log(`Duration: ${result.duration} min.`)
                fetchTime(result.distance, result.duration)
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (Dimensions.get('window').width) / 20,
                    bottom: (Dimensions.get('window').height) / 4,
                    left: (Dimensions.get('window').width) / 20,
                    top: (Dimensions.get('window').height) / 8,
                  }
                })
              }}
              onError={(errorMessage) => {
                console.log('GOT AN ERROR', errorMessage);
              }}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
          onPress={onCenter}
        >
          <Image source={imagePath.greenIndicator} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomCard}>
        <Text>Where are you going..?</Text>
        <TouchableOpacity onPress={onPressLocation} style={styles.inputStyle}>
          <Text>Choose Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inputStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default Home;