import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { getBackgroundColorAsync } from 'expo-system-ui';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}> 
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, false), //ヘッダーの白い所消した
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarShowLabel:false,
            title: '地図',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            tabBarStyle:{height:0.1},
            //FIXME: 無理やり消しただけ
          }}
        />
      </Tabs>
    </View>
  );
}
