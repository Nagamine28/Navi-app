import { showMessage } from 'react-native-flash-message';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

import { Steps } from './types';

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
        // console.log(JSON.stringify(location));
        resolve(location);
    } catch (error) {
        reject(error);
    }
});

// ハヴァサイン公式に基づく2点間の距離の算出する関数
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // km
    return d;
}
  
function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
  


export const checkSteps = async (state: { curLoc: { latitude: number, longitude: number } }, 
    stepsPosition: Steps[]): Promise<Steps[]> => {
    
    const { curLoc } = state;
  
    for (let step of stepsPosition) {
        if (!step.check) {
            const distance = getDistanceFromLatLonInKm(curLoc.latitude, curLoc.longitude, step.latitude, step.longitude);
            if (distance <= 6) {
                step.check = true;
                console.log('near')
            } else {
                console.log('too far')
            }
            console.log('現在地点 : ', curLoc.latitude, ', ', curLoc.longitude)
            console.log('比較座標 : ', step.latitude, ', ', step.longitude)
            // console.log('距離 : ', distance)
            return stepsPosition;
        }
    }

    return stepsPosition;
};


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

