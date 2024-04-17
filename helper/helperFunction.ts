// import Geolocation from 'react-native-geolocation-service';

// interface Coordinate {
//   latitude: number;
//   longitude: number;
//   heading: number;
// }

//   return new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const cords: Coordinate = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           heading: position.coords.heading,
//         };
//         resolve(cords);

import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export const locationPermission = async (): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return Promise.reject('Permission not granted');
    }
    return Promise.resolve("granted");
  } catch (error) {
      return Promise.reject(error);
  }
};

export const getCurrentLocation = (): Promise<LocationObject> => new Promise(async (resolve, reject) => {
  try {
    let location: LocationObject = await Location.getCurrentPositionAsync({});
      console.log(JSON.stringify(location));
      resolve(location);
  } catch (error) {
    reject(error);
  }
});
