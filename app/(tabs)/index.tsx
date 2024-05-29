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
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,//モーダル用
} from "react-native";
import { Magnetometer } from 'expo-sensors';
import { Link, Tabs } from 'expo-router';//モーダル用
import MapView, { MapMarker } from "react-native-maps";
import MapViewDirections, {
  MapDirectionsResponse,
} from "react-native-maps-directions";
import Colors from '@/constants/Colors';
import{
  useColorScheme,
} from '@/components/useColorScheme';
import {
  locationPermission,
  getCurrentLocation,
  checkSteps,
} from "../../helper/helperFunction";
import * as SplashScreen from "expo-splash-screen";

import { Steps, State, MapDirectionsLegsStep } from "../../helper/types";
import imagePath from "../../constants/imagePath";
import InputDestinationArea from "@/components/InputDestinationArea";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

SplashScreen.preventAutoHideAsync();

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const Home: React.FC = () => {
  //皇居の座標
  const defaultLatitude = 35.6802117;
  const defaultLongitude = 139.7576692;
  // 経路探索後結果を固定するためのFlag
  const [flag, setFlag] = useState<boolean>(true);
  const [initialFocusDone, setInitialFocusDone] = useState<boolean>(false);

  /*
  ====================
        Hooks
  ====================
*/

  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>(null);

  // 曲がり角の座標を格納するHooks
  const [corners, setCorners] = useState<Steps[]>([]);
  // 経路検索結果を格納するHooks
  const [directions, setDirections] = useState<MapDirectionsResponse | null>(
    null
  );

  /**
   * Stateを更新する関数
   * @param data
   * @returns
   */
  const updateState = (data: Partial<State>) =>
    setState((state) => ({ ...state, ...data }));

  /**
   * 現在地と目的地の座標を格納するHooks
   */
  const [state, setState] = useState<State>({
    curLoc: {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
    },
    destinationCords: { latitude: defaultLatitude, longitude: defaultLongitude},
    coordinate: new Animated.ValueXY({
      x: defaultLatitude,
      y: defaultLongitude,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  /**
   * Stateから必要な情報を取得
   */
  const { time, distance, destinationCords, coordinate } = state;

  /**
   * 初回の現在位置取得
  */
  useEffect(() => {
    getLiveLocation();
    
  }, []);

  /**
   * 6秒ごとに現在位置取得
   */
  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!initialFocusDone) {
      onCenter();
      setInitialFocusDone(true);
    }
  }, [state.curLoc]);
  

  /**
   * 接近検知
   */
  useEffect(() => {
    fetchSteps();
  }, [state.curLoc]);

  /**
   * 検索入力欄の文字列が変更されたときに曲がり角情報をリセット
   */
  useEffect(() => {
    setCorners([]);
    setFlag(true);
  }, [state.destinationCords]);

  /**
   * 経路検索時に曲がり角情報をセット
   */
  useEffect(() => {
    if (directions && flag) {
      setFlag(false);
      formingCorners(directions.legs[0].steps);
    }
  }, [directions]);

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

  const fetchSteps = async () => {
    const updatedStepsPosition = await checkSteps(state.curLoc, corners);
    setCorners([]);
    setCorners(updatedStepsPosition);
  };

  /**
   * 経路の曲がり角 steps 要素からStart及びEndの座標を取得
   * @param steps : Steps[]
   */
  const formingCorners = (steps: MapDirectionsLegsStep[]) => {
    setCorners((prevCorners) =>
      steps
        .map((step) => ({
          latitude: step.start_location.lat,
          longitude: step.start_location.lng,
          check: false,
        }))
        .concat(prevCorners)
    );
  };


  const [heading, setHeading] = useState(0);

  useEffect(() => {
    // console.log("Heading:", heading);
    let magnetometerSubscription: any;
    const subscribeToMagnetometer = async () => {
      try {
        await Magnetometer.setUpdateInterval(1000);
        magnetometerSubscription = Magnetometer.addListener((data) => {
          const { x, y, } = data;
          const newHeading = calculateHeading(x, y);
          setHeading(newHeading);
        });
      } catch (error) {
        console.log("Error subscribing to magnetometer:", error);
      }
    };
  
    subscribeToMagnetometer();
  
    return () => {
      if (magnetometerSubscription) {
        magnetometerSubscription.remove();
      }
    };
  }, [heading]);
  

const calculateHeading = (x: number, y: number) => {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  if (angle < 0) {
    angle = 360 + angle;
  }
  return Math.round(angle);
};

  /**
   * 現在位置取得
   */
  const getLiveLocation = async () => {
    const locPermissionDenied: string = await locationPermission();
    if (locPermissionDenied === "granted") {
      try {
        const location = await getCurrentLocation();
        const { latitude, longitude, } = location.coords;
        animate(latitude, longitude);
        updateState({
          curLoc: {
            latitude: latitude,
            longitude: longitude
          },
          coordinate: new Animated.ValueXY({
            x: latitude,
            y: longitude,
          }),
        });
        SplashScreen.hideAsync();
      } catch (error) {
        console.log("Error while getting current location: ", error);
      }
    }
  };

  /**
   * マーカーのアニメーション
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
        Animated.timing(coordinate, {
          toValue: { x: newCoordinate.latitude, y: newCoordinate.longitude },
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const onCenter = () => {
    mapRef.current?.animateToRegion({
      latitude: state.curLoc.latitude,
      longitude: state.curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA / 8, //現在地フォーカス時の画面の大きさ変更
      longitudeDelta: LONGITUDE_DELTA / 8, //現在地フォーカス時の画面の大きさ変更
    });
  };

  const fetchTime = (d: number, t: number) => {
    updateState({
      time: t,
      distance: d,
    });
  };

  /**
   * 経路探索時に使用する現在地情報
   */
  const [curLoc, setCurLoc] = useState({
    latitude: 0,
    longitude: 0
  })

  const updateCurLoc = async () => {
    try {
      const location = await getCurrentLocation();
      const { latitude, longitude, } = location.coords;
      animate(latitude, longitude);
      setCurLoc({
        latitude: latitude,
        longitude: longitude
      })
    } catch (error) {
      console.log("Error while getting current location: ", error);
    }
  }
  const colorScheme = useColorScheme(); //モーダル用
  // カスタムマーカーを設定
  const [customMarker, setCustomMarker] = useState<{latitude: number, longitude: number} | null>(null);
  // 「ここへ行く」ボタンを表示するかどうかの状態管理
  const [showGoButton, setShowGoButton] = useState<boolean>(false);
  
  // 地図上でタップした位置にカスタムマーカーを設定
  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setCustomMarker(coordinate);
    console.log('Pinned coordinate:', coordinate);
    setShowGoButton(true);
  };
  // 「ここへ行く」ボタンをタップした時の処理
  const handleGoToLocation = () => {
    if (customMarker) {
      // 1. 目的地の座標を設定
      setCoordinate(customMarker.latitude, customMarker.longitude);
      // 2. 現在位置を更新
      updateCurLoc();
      // 3. ボタンを非表示にする
      setShowGoButton(false);
      // 4. カスタムマーカーをリセットする
      setCustomMarker(null);
    }
  };
  // 初回の位置情報が取得されたかどうかの状態管理
  const [initialLocationFetched, setInitialLocationFetched] = useState(false);
  // 初回の位置情報の取得
  useEffect(() => {
    async function fetchInitialLocation() {
      const locPermissionDenied: string = await locationPermission();
      if (locPermissionDenied === "granted") {
        try {
          const location = await getCurrentLocation();
          const { latitude, longitude } = location.coords;
          setState((prevState) => ({
            ...prevState,
            curLoc: {
              latitude: latitude,
              longitude: longitude,
            },
          }));
          setInitialLocationFetched(true); // Location is fetched
        } catch (error) {
          console.log("Error while getting current location: ", error);
        }
      }
    }

    fetchInitialLocation();
  }, []);

  return (
    <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.overlay} />
        {distance !== 0 && time !== 0 && (
          <View style={{ alignItems: "center", marginVertical: 16 }}>
            <Text>Time left: {time.toFixed(0)} </Text>
            <Text>Distance left: {distance.toFixed(0)}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
        {initialLocationFetched ? (
          <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              initialRegion={{
                latitude: state.curLoc.latitude,
                longitude: state.curLoc.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              onPress={handleMapPress}
            >
              <MapMarker.Animated
                ref={markerRef}
                coordinate={{
                  latitude: state.coordinate.x,
                  longitude: state.coordinate.y,
                }}
              >
                <Image
                  source={imagePath.icLocation}
                  style={{
                    width: 30,
                    height: 30,
                    transform: [{ rotate: `${state.heading}deg` }],
                  }}
                  resizeMode="contain"
                />
              </MapMarker.Animated>

              {customMarker && (
              <MapMarker
              coordinate={customMarker}
              title="Pinned Location"
              description={`Latitude: ${customMarker.latitude}, Longitude: ${customMarker.longitude}`}
            />
            )}

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
                mode="WALKING"
                precision="high"
                onReady={(result) => {
                  setDirections(result);
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
        ) : (
          <Text>Loading...</Text>
        )}
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
          {/**モーダル用 */}
        <TouchableOpacity
            style = {{
              position : "absolute",
              bottom : 25,
              left : 10,
              backgroundColor : "white",
            }}>
            <Link href="/modal" style={styles.modal} asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialIcons name="play-circle" size={35} color="black" />
                )}
              </Pressable>
            </Link>
          </TouchableOpacity>
          {showGoButton && (
            <TouchableOpacity
              style={[styles.goButton, { left: (Dimensions.get('window').width - 200) / 2 }]}
              onPress={handleGoToLocation}
            >
              <Text style={styles.goButtonText}>ここへ行く</Text>
            </TouchableOpacity>
          )}
        </View>
        <KeyboardAvoidingView //キーボードの配置変更
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.bottomCard}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <InputDestinationArea
            setCoordinate={setCoordinate}
            updateCurLoc={updateCurLoc}
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5%', // 画面の上部を覆う
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 半透明の白
    zIndex: 1, // 他のビューより前面に表示
  },
  bottomCard: {
    backgroundColor: "white",
    width: "100%",
    height: '10%',
    padding: 30,

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
  modal:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  },
  goButton: {
    position: "absolute",
    bottom: 0,
    width: 200,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  goButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;
