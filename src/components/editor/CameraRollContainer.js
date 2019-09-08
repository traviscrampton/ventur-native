import React, { Component } from "react"
import { connect } from "react-redux"
import { Modal, SafeAreaView } from "react-native"
import { addImagesToEntries, setSelectedImages } from "../../actions/editor"
import { toggleCameraRollModal } from "../../actions/camera_roll"
import CameraRollPicker from "react-native-camera-roll-picker"
import { Header } from "./header"

const mapStateToProps = state => ({
  selectedImages: state.editor.selectedImages,
  uploadIsImage: state.editor.uploadIsimage,
  index: state.editor.activeIndex,
  visible: state.cameraRoll.visible
})

const mapDispatchToProps = dispatch => ({
  setSelectedImages: payload => dispatch(setSelectedImages(payload)),
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  addImagesToEntries: payload => dispatch(addImagesToEntries(payload))
})

class CameraRollContainer extends Component {
  constructor(props) {
    super(props)
    // this.selectSingleItem = this.props.navigation.getParam("selectSingleItem", false) // change to passed in props
    // this.singleItemCallback = this.props.navigation.getParam("singleItemCallback", null) // change to passed in props

    this.state = {
      selectedImages: [],
      imageSelected: false
    }

    console.log("is in journal", props.selectSingleItem)
  }

  addImagesToEntries = () => {
    if (this.state.imageSelected) return

    this.setState({
      imageSelected: true
    })

    const selectedImages = this.state.selectedImages.map((img, idx) => {
      return img
    })

    if (this.props.selectSingleItem) {
      this.props.imageCallback(selectedImages[0])
      this.props.toggleCameraRollModal(false)
    } else {
      this.props.imageCallback(selectedImages)
    }

    this.setState({ selectedImages: [], imageSelected: false })
  }

  compileSelectedImages = images => {
    this.setState({
      selectedImages: images
    })
  }

  handleGoBack = () => {
    this.props.toggleCameraRollModal(false)
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.handleGoBack,
      centerCta: `${this.state.selectedImages.length} selected`,
      handleConfirm: this.addImagesToEntries,
      confirmCta: "Add"
    }
    return <Header key="header" {...headerProps} />
  }

  renderCameraRollPicker() {
    return (
      <CameraRollPicker
        selectSingleItem={this.props.selectSingleItem}
        key="cameraRollPicker"
        selected={this.state.selectedImages}
        callback={this.compileSelectedImages}
      />
    )
  }

  render() {
    return (
      <Modal visible={this.props.visible} animationType="slide">
        <SafeAreaView>
          {this.renderHeader()}
          {this.renderCameraRollPicker()}
        </SafeAreaView>
      </Modal>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraRollContainer)
