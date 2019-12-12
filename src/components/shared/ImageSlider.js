import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  Image,
  Text,
  TouchableWithoutFeedback
} from "react-native";
import {
  toggleImageSliderModal,
  resetImages
} from "../../actions/image_slider";
import Swiper from "react-native-swiper";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  height: state.common.height,
  visible: state.imageSlider.visible,
  images: state.imageSlider.images,
  width: state.common.width,
  activeIndex: state.imageSlider.activeIndex
});

const mapDispatchToProps = dispatch => ({
  toggleImageSliderModal: payload => dispatch(toggleImageSliderModal(payload)),
  resetImages: () => dispatch(resetImages())
});

class ImageSlider extends Component {
  constructor(props) {
    super(props);
  }

  exitImageSlider = () => {
    this.props.toggleImageSliderModal(false);
    this.props.resetImages();
  };

  renderExit() {
    return (
      <TouchableWithoutFeedback onPress={this.exitImageSlider}>
        <View style={styles.exit}>
          <Feather name="x" color="white" size={32} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderImages() {
    return this.props.images.map(image => {
      return (
        <View>
          <Image
            style={{ width: this.props.width, height: image.height }}
            source={{ uri: image.uri }}
          />
          <View style={styles.padding20}>
            <Text style={styles.imageCaption}>{image.caption}</Text>
          </View>
        </View>
      );
    });
  }

  render() {
    return (
      <Modal animationType="fade" visible={this.props.visible}>
        <SafeAreaView style={styles.safeAreaView}>
          <View>
            {this.renderExit()}
            <Swiper showsPagination={false} index={this.props.activeIndex}>
              {this.renderImages()}
            </Swiper>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  exit: {
    height: 50,
    padding: 10,
    marginBottom: 10
  },
  safeAreaView: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black"
  },
  imageCaption: {
    color: "white",
    fontFamily: "open-sans-regular"
  },
  padding20: {
    padding: 20
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageSlider);
