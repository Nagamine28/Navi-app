import React from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Notifications from "expo-notifications";


export default function useNotification() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  React.useEffect(() => {
    requestPermissionsAsync();
  });
}

export const scheduleNotificationAsync = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      body: "test",
    },
    trigger: {
      seconds: 3,
    },
  });
};

export const requestPermissionsAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync();
  if (granted) {
    return;
  }

  await Notifications.requestPermissionsAsync();
};