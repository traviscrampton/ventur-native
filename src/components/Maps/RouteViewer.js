import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { defaultRouteViewer } from '../../actions/route_viewer';
import LoadingScreen from '../shared/LoadingScreen';

const mapDispatchToProps = dispatch => ({
  defaultRouteViewer: () => dispatch(defaultRouteViewer())
});

const mapStateToProps = state => ({
  polylines: state.routeViewer.polylines,
  initialRegion: state.routeViewer.initialRegion,
  isLoading: state.common.isLoading
});

class RouteViewer extends Component {
  constructor(props) {
    super(props);
  }

  navigateBack = () => {
    this.props.defaultRouteViewer();
    this.props.navigation.goBack();
  };

  renderFloatingBackButton() {
    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.floatingButtonContainer}
      >
        <TouchableWithoutFeedback onPress={this.navigateBack}>
          <View style={styles.floatingButtonInner}>
            <Ionicons name="ios-arrow-back" size={30} />
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

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />;
    }

    return (
      <View style={styles.relativeFlex}>
        <View style={styles.flex}>
          <MapView
            style={styles.flexZindex}
            initialRegion={this.props.initialRegion}
          >
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderFloatingBackButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  flexZindex: {
    flex: 1,
    zIndex: -1
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingBottom: 50
  },
  zIndex10: {
    zIndex: 10
  },
  floatingButtonInner: {
    height: 40,
    width: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
    paddingTop: 1
  },
  relativeFlex: {
    position: 'relative',
    flex: 1
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RouteViewer);
