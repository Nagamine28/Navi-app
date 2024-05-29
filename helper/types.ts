import { Animated } from "react-native";

export type Steps ={
    latitude: number,
    longitude: number,
    check: boolean,
};

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface State {
  customMarker: any;
  curLoc: Coordinate;
  destinationCords: Coordinate;
  coordinate: Animated.ValueXY;
  time: number;
  distance: number;
  heading: number;
}

export interface MapDirectionsLegsStep {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  end_location: {
    lat: number;
    lng: number;
  };
  start_location: {
    lat: number;
    lng: number;
  };
  html_instructions: string;
  polyline: {
    points: string;
  };
  travel_mode: string;
  maneuver: string | undefined;
}
