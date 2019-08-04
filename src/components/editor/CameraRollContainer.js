import React, { Component } from "react"
import { connect } from "react-redux"
import { addImagesToEntries, setSelectedImages } from "../../actions/editor"
import CameraRollPicker from "react-native-camera-roll-picker"
import { Header } from "./header"

const mapStateToProps = state => ({
  selectedImages: state.editor.selectedImages,
  uploadIsImage: state.editor.uploadIsimage
})

const mapDispatchToProps = dispatch => ({
  setSelectedImages: payload => dispatch(setSelectedImages(payload)),
  addImagesToEntries: payload => dispatch(addImagesToEntries(payload))
})
class CameraRollContainer extends Component {
  constructor(props) {
    super(props)
    this.compileSelectedImages = this.compileSelectedImages.bind(this)
    this.index = this.props.navigation.getParam("index", "NO-ID")
    this.selectSingleItem = this.props.navigation.getParam("selectSingleItem", false)
    this.singleItemCallback = this.props.navigation.getParam("singleItemCallback", null)

    this.state = {
      selectedImages: [],
      imageSelected: false
    }
  }

  addImagesToEntries = () => {
    if (this.state.imageSelected) return

    this.setState({ 
      imageSelected: true
    })

    const selectedImages = this.state.selectedImages.map((img, idx) => {
      return img
    })

    if (this.singleItemCallback) {
      console.log("is single item callback")
      this.singleItemCallback(selectedImages[0])
      this.props.navigation.goBack()
    } else {
      this.props.addImagesToEntries({ images: selectedImages, index: this.index, goBack: this.props.navigation.goBack })
    }
    // this.props.navigation.goBack()
  }

  compileSelectedImages = images => {
    this.setState({
      selectedImages: images
    })
  }

  handleGoBack = () => {
    this.props.navigation.goBack()
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
        selectSingleItem={this.selectSingleItem}
        key="cameraRollPicker"
        selected={this.state.selectedImages}
        callback={this.compileSelectedImages}
      />
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderHeader()}
        {this.renderCameraRollPicker()}
      </React.Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraRollContainer)
