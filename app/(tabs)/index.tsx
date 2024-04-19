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
  KeyboardAvoidingView, //キーボード配置のためのインポート
} from "react-native";
import MapView, { MapMarker } from "react-native-maps";
import MapViewDirections, { MapDirectionsResponse } from "react-native-maps-directions";
import {
  locationPermission,
  getCurrentLocation,
  checkSteps,
} from "../../helper/helperFunction";

import { Steps, State, MapDirectionsLegsStep, } from "../../helper/types";
import imagePath from "../../constants/imagePath";
import InputDestinationArea from "@/components/InputDestinationArea";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const Home: React.FC = () => {
  //皇居の座標
  const defaultLatitude = 35.6802117;
  const defaultLongitude = 139.7576692;

  /*********
   * Hooks *
   *********/

  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>(null);

  //曲がり角の座標を格納する配列
  const [corners, setCorners] = useState<Steps[]>([]);

  /**
   * やぎちゃんコメントかいて
   * @param data
   * @returns
   */
  const updateState = (data: Partial<State>) =>
    setState((state) => ({ ...state, ...data }));

  /**
   * やぎちゃんコメントかいて
   */
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

  /**
   * Test
   */
  let stepsPosition: Steps[] = [
    { latitude: 35.67880989290179, longitude: 139.6354711847531, check: false },
    { latitude: 37.7749, longitude: -140.4194, check: false },
  ];

  /**
   * 初回の現在位置取得
   */
  useEffect(() => {
    getLiveLocation();
  }, []);

  /**
   * 4秒ごとに現在位置取得
   */
  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  /**
   * 接近検知
   */
  useEffect(() => {
    const fetchSteps = async () => {
      stepsPosition = await checkSteps(state, stepsPosition);
      console.log(stepsPosition);
    };
    fetchSteps();
  }, [state, stepsPosition]);

  /**
   * InputDestinationAreaコンポーネントに引き渡す
   * 目的地の座標を設定する関数
   * @param latitude
   * @param longitude
   */
  const setCoordinate = (latitude: number, longitude: number) => {
    updateState({
      destinationCords: {
        latitude,
        longitude,
      },
    });
  };

  /**
   * 経路の曲がり角 steps 要素からStart及びEndの座標を取得
   * @param steps : Steps[]
   */
  const formingCorners = (steps: MapDirectionsLegsStep[]) => {
    console.log(steps);
    steps.map((step) => {
      const corner: Steps = {
        latitude: step.start_location.lat,
        longitude: step.start_location.lng,
        check: false,
      };
      setCorners([...corners, corner]);
    });
  };

  /**
   * やぎちゃんコメントかいて
   */
  const { curLoc, time, distance, destinationCords, coordinate, heading } =
    state;

  /**
   * 現在位置取得
   */
  const getLiveLocation = async () => {
    const locPermissionDenied: string = await locationPermission();
    if (locPermissionDenied === "granted") {
      try {
        const location = await getCurrentLocation();
        const { latitude, longitude, heading } = location.coords;
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

  /**
   * やぎちゃんコメントかいて
   * @param latitude
   * @param longitude
   */
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
      latitudeDelta: LATITUDE_DELTA / 8,    //現在地フォーカス時の画面の大きさ変更
      longitudeDelta: LONGITUDE_DELTA / 8,  //現在地フォーカス時の画面の大きさ変更
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
                console.log(result.legs[0].steps.length);
                formingCorners(result.legs[0].steps);
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
      <KeyboardAvoidingView  //キーボードの配置変更
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottomCard}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <InputDestinationArea setCoordinate={setCoordinate} />
      </KeyboardAvoidingView>
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
