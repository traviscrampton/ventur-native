import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { createNewTextEntry, updateActiveCreator } from "../../actions/editor";
import {
  toggleCameraRollModal,
  updateActiveView
} from "../../actions/camera_roll";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

const mapStateToProps = state => ({
  activeContentCreator: state.editor.activeContentCreator,
  uploadIsImage: state.editor.uploadIsImage,
  width: state.common.width
});

const mapDispatchToProps = dispatch => ({
  createNewTextEntry: payload => dispatch(createNewTextEntry(payload)),
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  updateActiveCreator: payload => dispatch(updateActiveCreator(payload)),
  updateActiveView: payload => dispatch(updateActiveView(payload))
});
class ContentCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialState: true
    };
  }

  createNewTextEntry() {
    let entry = {
      content: "",
      styles: "",
      type: "text"
    };

    let payload = { newEntry: entry, newIndex: this.props.index };
    this.props.createNewTextEntry(payload);
    this.props.updateActiveCreator(null);
  }

  openCameraRoll = e => {
    this.props.updateActiveView("editor");
    this.props.toggleCameraRollModal(true);
  };

  updateActiveCreator = () => {
    if (this.props.uploadIsImage) return;

    this.props.updateActiveCreator(this.props.index);
  };

  renderOptionState() {
    return (
      <View style={styles.optionState}>
        <TouchableWithoutFeedback onPress={() => this.createNewTextEntry()}>
          <View style={styles.optionContainer}>
            <Text style={styles.grayText}>+ ADD CONTENT</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderInitialState() {
    return (
      <TouchableWithoutFeedback
        style={{ width: this.props.width }}
        onPress={this.updateActiveCreator}
      >
        <View style={[styles.initialState, styles.isInitial]}>
          <MaterialIcons
            style={styles.marginRight7}
            color="#d3d3d3"
            name="add-circle-outline"
            size={20}
          />
          <Text style={styles.addContentCta}>ADD CONTENT</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderTextOrImage() {
    const buttonStyles = [
      styles.flexRowCenter,
      { width: this.props.width / 2 }
    ];
    return (
      <View style={[styles.initialStateTextOrImage]}>
        <TouchableWithoutFeedback onPress={() => this.createNewTextEntry()}>
          <View style={buttonStyles}>
            <MaterialIcons
              style={styles.marginRight4}
              color="darkgray"
              name="text-fields"
              size={20}
            />
            <Text style={styles.darkGray}>TEXT</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.openCameraRoll}>
          <View style={buttonStyles}>
            <Entypo
              style={styles.marginRight4}
              name="image"
              size={20}
              color={"darkgray"}
            />
            <Text style={styles.darkGray}>IMAGES</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    if (this.props.activeContentCreator === this.props.index) {
      return this.renderTextOrImage();
    } else {
      return this.renderInitialState();
    }
  }
}

const styles = StyleSheet.create({
  initialState: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: "white",
    height: 50
  },
  darkGray: {
    color: "darkgray"
  },
  marginRight4: {
    marginRight: 4
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50
  },
  initialStateTextOrImage: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  marginRight7: {
    marginRight: 7
  },
  isInitial: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  optionState: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    height: 50
  },
  addContentCta: {
    color: "#d3d3d3",
    fontFamily: "overpass",
    paddingTop: 2
  },
  optionContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white"
  },
  grayText: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    fontFamily: "overpass"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentCreator);
