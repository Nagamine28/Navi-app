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
import MapView, { MapMarker, AnimatedRegion } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {
  locationPermission,
  getCurrentLocation,
} from "../../helper/helperFunction";
import imagePath from "../../constants/imagePath";
import InputDestinationArea from "@/components/InputDestinationArea";

const screen = Dimensions.get("window");
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
  coordinate: Animated.ValueXY;
  time: number;
  distance: number;
  heading: number;
}

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>(null);
  //皇居の座標
  const defaultLatitude = 35.6802117;
  const defaultLongitude = 139.7576692;

  const [state, setState] = useState<State>({
    curLoc: {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
    },
    destinationCords: { latitude: 0, longitude: 0 },
    coordinate: new Animated.ValueXY({
      x: defaultLatitude,
      y: defaultLongitude,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  const setCoordinate = (latitude: number, longitude: number) => {
    setState((state) => ({
      ...state,
      coordinate: new Animated.ValueXY({
        x: latitude,
        y: longitude,
      }),
      curLoc: {
        latitude: latitude,
        longitude: longitude,
      },
    }));
  }

  const { curLoc, time, distance, destinationCords, coordinate, heading } =
    state;
  const updateState = (data: Partial<State>) =>
    setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = async () => {
    const locPermissionDenied: string = await locationPermission();
    if (locPermissionDenied === "granted") {
      try {
        const location = await getCurrentLocation();
        const { latitude, longitude, heading } = location.coords;
        console.log("get live location after 4 second", heading);
        animate(latitude, longitude);
        updateState({
          // heading: heading,
          curLoc: { latitude, longitude },
          coordinate: new Animated.ValueXY({
            x: latitude,
            y: longitude,
          }),
        });
      } catch (error) {
        console.log("Error while getting current location: ", error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const onPressLocation = async () => {
    navigation.navigate("chooseLocation", { getCordinates: fetchValue });
  };

  const fetchValue = (data: { destinationCords: Coordinate }) => {
    updateState({
      destinationCords: data.destinationCords,
    });
  };

  const animate = (latitude: number, longitude: number) => {
    const newCoordinate = {
      latitude,
      longitude,
    };
    if (Platform.OS === "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      } else {
        // coordinate.timing(newCoordinate).start();
        Animated.timing(coordinate, {
          toValue: { x: newCoordinate.latitude, y: newCoordinate.longitude },
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const onCenter = () => {
    mapRef.current?.animateToRegion({
      latitude: curLoc.latitude,
      longitude: curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const fetchTime = (d: number, t: number) => {
    updateState({
      time: t,
      distance: d,
    });
  };

  return (
    <View style={styles.container}>
      {distance !== 0 && time !== 0 && (
        <View style={{ alignItems: "center", marginVertical: 16 }}>
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
              latitude: coordinate.x,
              longitude: coordinate.y,
            }}
          >
            <Image
              source={imagePath.icBike}
              style={{
                width: 40,
                height: 40,
                transform: [{ rotate: `${heading}deg` }],
              }}
              resizeMode="contain"
            />
          </MapMarker.Animated>

          {Object.keys(destinationCords).length > 0 && (
            <MapMarker
              coordinate={destinationCords}
              image={imagePath.icGreenMarker}
            />
          )}

          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={curLoc}
              destination={destinationCords}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
              strokeWidth={6}
              strokeColor="red"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`
                );
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                fetchTime(result.distance, result.duration);
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: Dimensions.get("window").width / 20,
                    bottom: Dimensions.get("window").height / 4,
                    left: Dimensions.get("window").width / 20,
                    top: Dimensions.get("window").height / 8,
                  },
                });
              }}
              onError={(errorMessage) => {
                console.log("GOT AN ERROR", errorMessage);
              }}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          onPress={onCenter}
        >
          <Image source={imagePath.greenIndicator} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomCard}>
        <InputDestinationArea setCoordinate={setCoordinate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: "white",
    width: "100%",
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
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

export default Home;
