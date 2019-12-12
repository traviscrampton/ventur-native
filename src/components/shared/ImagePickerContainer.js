import React, { Component } from "react";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { addImagesToEntries, setSelectedImages } from "../../actions/editor";
import { toggleCameraRollModal } from "../../actions/camera_roll";

const mapStateToProps = state => ({
  selectedImages: state.editor.selectedImages,
  uploadIsImage: state.editor.uploadIsimage,
  index: state.editor.activeIndex,
  visible: state.cameraRoll.visible,
  activeView: state.cameraRoll.activeView
});

const mapDispatchToProps = dispatch => ({
  setSelectedImages: payload => dispatch(setSelectedImages(payload)),
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  addImagesToEntries: payload => dispatch(addImagesToEntries(payload))
});

class ImagePickerContainer extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (!prevProps.visible && this.props.visible) {
      await this.checkCameraRollPermissions();
    }
  }

  async checkCameraRollPermissions() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      await this.initialCameraRollPicker();
    } else {
      await this.askForCameraRollPermission();
    }
  }

  async askForCameraRollPermission() {
    const { status, permission } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
  }

  getFileName(result) {
    const { uri } = result;
    const splitUri = uri.split("/");

    return splitUri[splitUri.length - 1];
  }

  addImagesToEntries = result => {
    const imgObject = Object.assign({}, result, {
      filename: this.getFileName(result)
    });

    if (this.props.selectSingleItem) {
      this.props.imageCallback(imgObject);
      this.props.toggleCameraRollModal(false);
    } else {
      this.props.imageCallback([imgObject]);
    }
  };

  handleGoBack = () => {
    this.props.toggleCameraRollModal(false);
  };

  async initialCameraRollPicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: this.props.aspect
    });

    if (!result.cancelled) {
      this.addImagesToEntries(result);
    } else {
      this.props.toggleCameraRollModal(false);
    }
  }

  render() {
    return <React.Fragment />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagePickerContainer);
