import { showMessage } from 'react-native-flash-message';
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

const showError = (message: string) => {
  showMessage({
    message,
    type: 'danger',
    icon: 'danger'
  })
}

const showSuccess = (message: string) => {
  showMessage({
    message,
    type: 'success',
    icon: 'success'
  })
}

export {
  showError,
  showSuccess
}
