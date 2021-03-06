import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Alert
} from 'react-native';
import MapView from 'react-native-maps';
import { FloatingAction } from 'react-native-floating-action';
import RouteEditorButtons from '../Maps/RouteEditorButtons';
import { authenticateStravaUser } from '../../actions/strava';
import {
  toggleDrawMode,
  togglePositionMode,
  persistRoute,
  eraseRoute,
  cancelAllModes
} from '../../actions/route_editor';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { MaterialIndicator } from 'react-native-indicators';
import {
  setIsDrawing,
  drawLine,
  setupNextDraw,
  persistCoordinates,
  updateRegionCoordinates,
  defaultRouteEditor
} from '../../actions/route_editor';
import {
  checkForExpiredToken,
  setStravaLoadingTrue
} from '../../actions/strava_activity_import';
import LoadingScreen from '../shared/LoadingScreen';

const mapDispatchToProps = dispatch => ({
  setIsDrawing: payload => dispatch(setIsDrawing(payload)),
  toggleDrawMode: () => dispatch(toggleDrawMode()),
  checkForExpiredToken: () => dispatch(checkForExpiredToken()),
  setStravaLoadingTrue: () => dispatch(setStravaLoadingTrue()),
  togglePositionMode: () => dispatch(togglePositionMode()),
  drawLine: payload => dispatch(drawLine(payload)),
  setupNextDraw: () => dispatch(setupNextDraw()),
  persistRoute: () => dispatch(persistRoute()),
  eraseRoute: () => dispatch(eraseRoute()),
  authenticateStravaUser: payload => dispatch(authenticateStravaUser(payload)),
  persistCoordinates: () => dispatch(persistCoordinates()),
  cancelAllModes: () => dispatch(cancelAllModes()),
  defaultRouteEditor: () => dispatch(defaultRouteEditor()),
  updateRegionCoordinates: coordinates =>
    dispatch(updateRegionCoordinates(coordinates))
});

const mapStateToProps = state => ({
  polylineEditor: state.routeEditor.polylineEditor,
  width: state.common.width,
  drawMode: state.routeEditor.drawMode,
  shownIndex: state.routeEditor.shownIndex,
  stravaAccessToken: state.common.stravaAccessToken,
  positionMode: state.routeEditor.positionMode,
  polylines: state.routeEditor.polylines,
  previousPolylines: state.routeEditor.previousPolylines,
  initialRegion: state.routeEditor.initialRegion,
  isDrawing: state.routeEditor.isDrawing,
  isLoading: state.common.isLoading,
  isSaving: state.routeEditor.isSaving,
  changedRegion: state.routeEditor.changedRegion,
  startingPolylines: state.routeEditor.startingPolylines,
  canDraw: state.routeEditor.canDraw,
  currentUser: state.common.currentUser,
  stravaClientId: state.common.stravaClientId
});

class RouteEditor extends Component {
  constructor(props) {
    super(props);
  }

  static actions = [
    {
      text: 'Draw Route',
      icon: <MaterialIcons name={'edit'} color="white" size={20} />,
      name: 'draw_route',
      position: 0,
      color: '#FF5423'
    },
    {
      text: 'Position Map',
      icon: <MaterialIcons name={'crop-free'} color="white" size={20} />,
      name: 'position_map',
      position: 1,
      color: '#3F88C5'
    },
    {
      text: 'Upload Strava Routes',
      icon: <MaterialIcons name={'directions-bike'} color="white" size={20} />,
      name: 'upload_strava',
      position: 2,
      color: '#FF5423'
    },
    {
      text: 'Clear Route',
      icon: <MaterialIcons name="delete" color="white" size={20} />,
      name: 'erase_route',
      position: 3,
      color: '#FF5423'
    }
  ];

  onPanDrag = e => {
    const { drawMode, canDraw, isDrawing } = this.props;

    if (!drawMode || !canDraw) return;
    let coordinates = [
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude
    ];
    this.props.drawLine(coordinates);
  };

  checkForSaveAndNavigateBack = () => {
    if (this.isSaved()) {
      this.navigateBack();
    } else {
      Alert.alert(
        'Are you sure?',
        'You have unsaved changes',
        [
          { text: 'Continue Unsaved', onPress: () => this.navigateBack() },
          { text: 'Cancel', style: 'cancel' }
        ],
        { cancelable: true }
      );
    }
  };

  navigateBack = () => {
    this.props.defaultRouteEditor();
    this.props.navigation.goBack();
  };

  handleOnMoveResponder = () => {
    if (!this.props.canDraw) return;

    if (!this.props.isDrawing) {
      this.props.setIsDrawing(true);
    }

    return true;
  };

  isSaved() {
    let { polylines, startingPolylines } = this.props;

    return JSON.stringify(polylines) === JSON.stringify(startingPolylines);
  }

  routeNeedsSaving() {
    const { polylines, startingPolylines } = this.props;

    if (polylines.length !== startingPolylines.length) {
      return true;
    }

    return !this.isSaved();
  }

  handleOnReleaseResponder = () => {
    if (!this.props.canDraw) return;

    this.props.setupNextDraw();
  };

  async handleRegionChange(coordinates) {
    this.props.updateRegionCoordinates(coordinates);
  }

  isChangedRegionDifferent() {
    return (
      JSON.stringify(this.props.initialRegion) !==
      JSON.stringify(this.props.changedRegion)
    );
  }

  alertAboutStrava() {
    Alert.alert(
      'Strava Not Connected',
      'To upload strava routes go to the profile page',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
  }

  loadStravaAndNavigate = () => {
    this.props.setStravaLoadingTrue();
    this.props.navigation.navigate('StravaRouteSelector');
    this.props.checkForExpiredToken();
  };

  async handleStravaPress() {
    if (!this.props.stravaAccessToken) {
      this.alertAboutStrava();
    } else {
      this.loadStravaAndNavigate();
    }
  }

  async handlePressItem(name) {
    switch (name) {
      case 'draw_route':
        return this.props.toggleDrawMode();
      case 'position_map':
        return this.props.togglePositionMode();
      case 'erase_route':
        return this.props.eraseRoute();
      case 'upload_strava':
        return await this.handleStravaPress();
      default:
        console.log('wat in tarnation');
    }
  }

  getSaveButtonProps(drawMode, positionMode) {
    if (drawMode) {
      return Object.assign(
        {},
        {
          onPress: this.props.persistRoute,
          saved: 'SAVED',
          needsSaving: 'SAVE ROUTE',
          color: '#FF5423'
        }
      );
    } else if (positionMode) {
      return Object.assign(
        {},
        {
          onPress: this.props.persistCoordinates,
          saved: 'SAVED',
          needsSaving: 'SAVE POSITION',
          color: '#3F88C5'
        }
      );
    } else {
      return Object.assign({}, {});
    }
  }

  needsSaving(drawMode, positionMode) {
    if (!drawMode && !positionMode) return;

    if (positionMode) {
      return this.isChangedRegionDifferent();
    } else if (drawMode) {
      return this.routeNeedsSaving();
    }

    return false;
  }

  cancelAllModes = () => {
    this.props.cancelAllModes();
  };

  renderSavingButton() {
    const { drawMode, positionMode } = this.props;
    if (!drawMode && !positionMode) return;
    const { onPress, saved, needsSaving, color } = this.getSaveButtonProps(
      drawMode,
      positionMode
    );
    let buttonContent;

    if (this.props.isSaving) {
      buttonContent = <MaterialIndicator size={20} color={color} />;
    } else if (this.needsSaving(drawMode, positionMode)) {
      buttonContent = <Text style={{ color }}>{needsSaving}</Text>;
    } else {
      buttonContent = <Text style={{ color }}>{saved}</Text>;
    }
    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.7}
        shadowRadius={2}
        style={styles.savingButton}
      >
        <TouchableWithoutFeedback onPress={onPress}>
          <View
            style={[
              styles.savingButtonContainer,
              { width: this.props.width / 2 }
            ]}
          >
            {buttonContent}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderFloatingActionButton() {
    if (this.props.drawMode || this.props.positionMode) return;

    return (
      <FloatingAction
        color={'#FF5423'}
        actions={RouteEditor.actions}
        onPressItem={name => {
          this.handlePressItem(name);
        }}
      />
    );
  }

  renderFloatingBackButton() {
    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.floatingButtonContainer}
      >
        <TouchableWithoutFeedback onPress={this.checkForSaveAndNavigateBack}>
          <View style={styles.floatingInner}>
            <Ionicons name="ios-arrow-back" size={30} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderExitButton() {
    if (!this.props.drawMode && !this.props.positionMode) return;

    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.exitButtonContainer}
      >
        <TouchableWithoutFeedback onPress={this.cancelAllModes}>
          <View style={styles.exitButtonInner}>
            <MaterialIcons name="close" size={20} color={'white'} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderPolylines() {
    let coordinates;
    return this.props.polylines.map((coordinateArrays, index) => {
      if (index > this.props.shownIndex) return;

      coordinates = coordinateArrays.map(coordinate => {
        return Object.assign(
          {},
          { latitude: coordinate[0], longitude: coordinate[1] }
        );
      });

      return (
        <MapView.Polyline
          style={styles.zIndex10}
          coordinates={coordinates}
          strokeWidth={2}
          strokeColor="#FF5423"
        />
      );
    });
  }

  renderPreviousPolylines() {
    return this.props.previousPolylines.map((coordinates, index) => {
      return (
        <MapView.Polyline
          style={styles.zIndex9}
          coordinates={coordinates}
          strokeWidth={2}
          strokeColor="#3F88C5"
        />
      );
    });
  }

  renderPositionCoordinates() {
    if (!this.props.positionMode) return;

    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    } = this.props.changedRegion;
    return (
      <View style={styles.positionCoordinates}>
        <View>
          <Text style={styles.colorBlack}>Latitude: {latitude}</Text>
        </View>
        <View>
          <Text style={styles.colorBlack}>Longitude: {longitude}</Text>
        </View>
        <View>
          <Text style={styles.colorBlack}>Lat Delta: {latitudeDelta}</Text>
        </View>
        <View>
          <Text style={styles.colorBlack}>Long Delta: {longitudeDelta}</Text>
        </View>
      </View>
    );
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />;
    }

    return (
      <View style={styles.relativeFlex}>
        <MapView
          onRegionChangeComplete={e => this.handleRegionChange(e)}
          style={styles.positiveFlex}
          scrollEnabled={!this.props.canDraw}
          onPanDrag={e => this.onPanDrag(e)}
          onTouchStart={this.handleOnReleaseResponder}
          initialRegion={this.props.initialRegion}
        >
          {this.renderPreviousPolylines()}
          {this.renderPolylines()}
        </MapView>
        {this.renderFloatingBackButton()}
        {this.renderFloatingActionButton()}
        {this.renderExitButton()}
        {this.renderSavingButton()}
        {this.renderPositionCoordinates()}
        <RouteEditorButtons navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingBottom: 50
  },
  savingButton: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 35,
    left: 60
  },
  savingButtonContainer: {
    borderRadius: 30,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  floatingInner: {
    height: 40,
    width: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
    paddingTop: 1
  },
  exitButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FF5423',
    borderRadius: 57 / 2,
    overflow: 'hidden'
  },
  exitButtonInner: {
    height: 57,
    width: 57,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  zindex10: {
    zIndex: 10
  },
  positionCoordinates: {
    position: 'absolute',
    backgroundColor: 'rgba(111, 111, 111, 0.3)',
    padding: 5,
    borderRadius: 5,
    top: 60,
    right: 30
  },
  relativeFlex: {
    position: 'relative',
    flex: 1
  },
  positiveFlex: {
    flex: 1,
    zIndex: -1
  },
  colorBlack: {
    color: 'black'
  },
  zIndex9: {
    zIndex: 9
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RouteEditor);
