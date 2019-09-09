import React, { Component } from "react"
import { View, Modal, SafeAreaView, Image, Text, TouchableWithoutFeedback } from "react-native"
import { toggleImageSliderModal, resetImages } from "../../actions/image_slider"
import Swiper from "react-native-swiper"
import { Feather } from "@expo/vector-icons"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  height: state.common.height,
  visible: state.imageSlider.visible,
  images: state.imageSlider.images,
  width: state.common.width,
  activeIndex: state.imageSlider.activeIndex
})

const mapDispatchToProps = dispatch => ({
  toggleImageSliderModal: payload => dispatch(toggleImageSliderModal(payload)),
  resetImages: () => dispatch(resetImages()),
})

class ImageSlider extends Component {
  constructor(props) {
    super(props)
  }

  exitImageSlider = () => {
    this.props.toggleImageSliderModal(false)
    this.props.resetImages()
  }

  renderExit() {
    return (
      <TouchableWithoutFeedback onPress={this.exitImageSlider}>
        <View style={{ height: 50, padding: 10, marginBottom: 10 }}>
          <Feather name="x" color="white" size={32} />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderImages() {
    return this.props.images.map(image => {
      return (
        <View>
          <Image style={{ width: this.props.width, height: image.height }} source={{ uri: image.uri }} />
          <View style={{ padding: 20 }}>
            <Text style={{ color: "white", fontFamily: "open-sans-regular" }}>{image.caption}</Text>
          </View>
        </View>
      )
    })
  }

  render() {
    return (
      <Modal animationType="fade" visible={this.props.visible}>
        <SafeAreaView
          style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "black" }}>
          <View>
            {this.renderExit()}
            <Swiper showsPagination={false} index={this.props.activeIndex}>{this.renderImages()}</Swiper>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageSlider)
