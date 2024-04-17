import * as Location from 'expo-location';

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