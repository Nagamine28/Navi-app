import Geolocation from 'react-native-geolocation-service';

interface Coordinate {
  latitude: number;
  longitude: number;
  heading: number;
}

export const getCurrentLocation = async (): Promise<Coordinate> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const cords: Coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        };
        resolve(cords);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};