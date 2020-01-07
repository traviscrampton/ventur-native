import React, { Component } from 'react';
import {
  initialAppLoaded,
  setCurrentUser,
  setWindowDimensions,
  updateConnectionType,
  addApiCredentials
} from '../actions/common';
import { addStravaToCurrentUser } from '../actions/strava';
import { connect } from 'react-redux';
import * as Font from 'expo-font';
import { AsyncStorage, Dimensions, NetInfo } from 'react-native';
import { RootNavigator } from '../navigation';
import { getCredentials } from '../agent';

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  appLoaded: state.common.initialAppLoaded,
  isOffline: state.common.isOffline,
  awsAccessKey: state.common.awsAccessKey,
  awsSecretKey: state.common.awsSecretKey
});

const mapDispatchToProps = dispatch => ({
  initialAppLoaded: () => dispatch(initialAppLoaded()),
  setCurrentUser: payload => dispatch(setCurrentUser(payload)),
  setWindowDimensions: payload => dispatch(setWindowDimensions(payload)),
  updateConnectionType: payload => dispatch(updateConnectionType(payload)),
  addStravaToCurrentUser: payload => dispatch(addStravaToCurrentUser(payload)),
  addApiCredentials: payload => dispatch(addApiCredentials(payload))
});

class Ventur extends Component {
  async componentWillMount() {
    await this.setUpFonts();
    await this.getAWSCredentials();
    this.setupDimensionsListener();
    this.setCurrentUser();
    this.setUpConnectionListener();
  }

  setupDimensionsListener() {
    Dimensions.addEventListener('change', this.handleDimensionChange);
  }

  setUpConnectionListener() {
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  async getAWSCredentials() {
    const response = await getCredentials();
    this.props.addApiCredentials(response);
  }

  handleConnectionChange = connectionInfo => {
    let isOffline = connectionInfo.type === 'none';

    this.props.updateConnectionType(isOffline);
  };

  handleDimensionChange = dim => {
    let heightAndWidth = { width: dim.window.width, height: dim.window.height };
    this.props.setWindowDimensions(heightAndWidth);
  };

  async setCurrentUser() {
    try {
      let user = await AsyncStorage.getItem('currentUser');
      let stravaCredentials = await AsyncStorage.getItem('stravaCredentials');
      user = JSON.parse(user);
      stravaCredentials = JSON.parse(stravaCredentials);
      this.props.setCurrentUser(user);
      this.props.addStravaToCurrentUser(stravaCredentials);
      this.props.initialAppLoaded();
    } catch (err) {
      this.props.setCurrentUser(null);
    }
  }

  async setUpFonts() {
    await Font.loadAsync({
      'open-sans-regular': require('../assets/fonts/Lato/Lato-Regular.ttf'),
      playfair: require('../assets/fonts/Lato/Lato-Bold.ttf'),
      overpass: require('../assets/fonts/Overpass_Mono/OverpassMono-Light.ttf'),
      'open-sans-bold': require('../assets/fonts/Lato/Lato-Black.ttf'),
      'open-sans-semi': require('../assets/fonts/Lato/Lato-Light.ttf')
    });
  }

  render() {
    let isCurrentUser = this.props.currentUser !== null;
    const VNTR = RootNavigator(isCurrentUser);

    if (!this.props.appLoaded) {
      return null;
    }

    return <VNTR />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ventur);
