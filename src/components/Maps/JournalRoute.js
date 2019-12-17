import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { MaterialIndicator } from 'react-native-indicators';
import {
  updateRegionCoordinates,
  togglePositionMode,
  persistCoordinates,
  defaultRouteEditor
} from '../../actions/route_editor';
import { defaultJournalRoute } from '../../actions/journal_route';
import LoadingScreen from '../shared/LoadingScreen';

const mapDispatchToProps = dispatch => ({
  defaultJournalRoute: () => dispatch(defaultJournalRoute()),
  updateRegionCoordinates: payload =>
    dispatch(updateRegionCoordinates(payload)),
  togglePositionMode: () => dispatch(togglePositionMode()),
  persistCoordinates: () => dispatch(persistCoordinates()),
  defaultRouteEditor: () => dispatch(defaultRouteEditor())
});

const mapStateToProps = state => ({
  polylines: state.journalRoute.polylines,
  initialRegion: state.journalRoute.initialRegion,
  editorInitialRegion: state.routeEditor.initialRegion,
  isLoading: state.common.isLoading,
  positionMode: state.routeEditor.positionMode,
  changedRegion: state.routeEditor.changedRegion,
  isSaving: state.routeEditor.isSaving,
  currentUser: state.common.currentUser,
  journalUser: state.journal.journal.user,
  height: state.common.height,
  width: state.common.width
});

class JournalRoute extends Component {
  constructor(props) {
    super(props);
  }

  navigateBack = () => {
    this.props.defaultJournalRoute();
    this.props.defaultRouteEditor();
    this.props.navigation.goBack();
  };

  isCurrentUser() {
    return this.props.currentUser.id == this.props.journalUser.id;
  }

  renderFloatingBackButton() {
    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.floatingBackButton}
      >
        <TouchableWithoutFeedback onPress={this.navigateBack}>
          <View style={styles.iconPositionBackButton}>
            <Ionicons name="ios-arrow-back" color={'#323941'} size={30} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderCropButton() {
    if (!this.isCurrentUser()) return;

    const { positionMode } = this.props;
    const backgroundColor = positionMode ? '#3F88C5' : 'white';
    const iconColor = positionMode ? 'white' : '#3F88C5';

    return (
      <View style={styles.cropButtonContainer}>
        <TouchableWithoutFeedback onPress={this.props.togglePositionMode}>
          <View
            shadowColor="#323941"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={[
              styles.cropButtonPosition,
              { backgroundColor: backgroundColor }
            ]}
          >
            <MaterialIcons name="crop-free" size={25} color={iconColor} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  async handleRegionChange(coordinates) {
    if (!this.props.positionMode || !this.isCurrentUser()) return;

    this.props.updateRegionCoordinates(coordinates);
  }

  isChangedRegionDifferent() {
    return (
      JSON.stringify(this.props.editorInitialRegion) ===
      JSON.stringify(this.props.changedRegion)
    );
  }

  renderSavingButton() {
    if (!this.props.positionMode || !this.isCurrentUser()) return;
    let buttonContent;

    if (this.props.isSaving) {
      buttonContent = <MaterialIndicator size={20} color="#FF5423" />;
    } else if (this.isChangedRegionDifferent()) {
      buttonContent = <Text style={styles.savedColor}>SAVED</Text>;
    } else {
      buttonContent = <Text style={styles.savedColor}>SAVE POSITION</Text>;
    }

    return (
      <View style={[styles.savingButtonContainer, { width: this.props.width }]}>
        <TouchableWithoutFeedback onPress={this.props.persistCoordinates}>
          <View
            style={[
              styles.savingButtonContent,
              { width: this.props.width / 2 }
            ]}
          >
            {buttonContent}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderPolylines() {
    let coordinates;
    return this.props.polylines.map((polylines, index) => {
      return polylines.map((coordinateArrays, index) => {
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
    });
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />;
    }

    return (
      <View style={styles.relativeFlex}>
        <View style={styles.flex1}>
          <MapView
            style={styles.flexAndZ}
            onRegionChangeComplete={e => this.handleRegionChange(e)}
            initialRegion={this.props.initialRegion}
          >
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderFloatingBackButton()}
        {this.renderCropButton()}
        {this.renderSavingButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  floatingBackButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 20
  },
  iconPositionBackButton: {
    height: 40,
    width: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
    paddingTop: 1
  },
  cropButtonPosition: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    borderRadius: 17.5,
    marginBottom: 10
  },
  savingButtonContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 30
  },
  savedColor: {
    color: '#FF5423'
  },
  relativeFlex: {
    position: 'relative',
    flex: 1
  },
  savingButtonContent: {
    borderRadius: 30,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  flex1: {
    flex: 1
  },
  flexAndZ: {
    flex: 1,
    zIndex: -1
  },
  zIndex10: {
    zIndex: 10
  },
  cropButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 30
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(JournalRoute);
