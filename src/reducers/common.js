import { TOGGLE_TAB_BAR } from "../actions/action_types";
import { Dimensions } from "react-native";
import {
  SET_CURRENT_USER,
  UPDATE_CURRENT_BOTTOM_TAB,
  INITIAL_APP_LOADED,
  SET_WINDOW_DIMENSIONS,
  UPDATE_CONNECTION_TYPE,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  ADD_API_CREDENTIALS
} from "../actions/common";
import { ADD_STRAVA_TO_CURRENT_USER } from "../actions/strava";

const defaultAppState = {
  currentUser: null,
  stravaAccessToken: null,
  hideTabBar: false,
  initialAppLoaded: false,
  currentBottomTab: "Explore",
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
  awsAccessKey: null,
  awsSecretKey: null,
  stravaClientId: null,
  stravaClientSecret: null,
  isOffline: false,
  isLoading: false
};

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    case TOGGLE_TAB_BAR:
      return {
        ...state,
        hideTabBar: action.payload
      };

    case ADD_API_CREDENTIALS:
      return {
        ...state,
        awsAccessKey: action.payload.awsAccessKey,
        awsSecretKey: action.payload.awsSecretKey,
        stravaClientId: action.payload.stravaClientId,
        stravaClientSecret: action.payload.stravaClientSecret
      };
    case ADD_STRAVA_TO_CURRENT_USER:
      return Object.assign({}, state, action.payload);
    case UPDATE_CURRENT_BOTTOM_TAB:
      return {
        ...state,
        currentBottomTab: action.payload
      };
    case SET_WINDOW_DIMENSIONS:
      return Object.assign({}, state, action.payload);
    case INITIAL_APP_LOADED:
      return {
        ...state,
        initialAppLoaded: true
      };
    case UPDATE_CONNECTION_TYPE:
      return {
        ...state,
        isOffline: action.payload
      };
    case SET_LOADING_TRUE:
      return {
        ...state,
        isLoading: true
      };
    case SET_LOADING_FALSE:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};
