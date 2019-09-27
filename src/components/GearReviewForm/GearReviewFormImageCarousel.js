import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Alert, Text, FlatList, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"
import ProgressiveImage from "../shared/ProgressiveImage"
import { uploadImageToCarousel, updateActiveImageIndex, removeImage } from "../../actions/gear_review_form"
import { MaterialIndicator } from "react-native-indicators"
import CameraRollContainer from "../editor/CameraRollContainer"
import { toggleCameraRollModal, updateActiveView } from "../../actions/camera_roll"

const mapStateToProps = state => ({
  width: state.common.width,
  images: state.gearReviewForm.images,
  activeView: state.cameraRoll.activeView,
  imageUploading: state.gearReviewForm.imageUploading,
  activeImageIndex: state.gearReviewForm.activeImageIndex
})

const mapDispatchToProps = dispatch => ({
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  uploadImageToCarousel: payload => dispatch(uploadImageToCarousel(payload)),
  updateActiveImageIndex: payload => dispatch(updateActiveImageIndex(payload)),
  removeImage: payload => dispatch(removeImage(payload)),
  updateActiveView: payload => dispatch(updateActiveView(payload))
})

class GearReviewFormImageCarousel extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.updateActiveView("gear_review_form")
  }

  uploadImage = selectedImage => {
    this.props.uploadImageToCarousel(selectedImage)
  }

  removeImage = () => {
    const uri = this.props.images[this.props.activeImageIndex].originalUri
    const payload = Object.assign({}, { index: this.props.activeImageIndex, uri: uri })
    this.props.removeImage(payload)
  }

  handleImageRemove = () => {
    Alert.alert(
      "Are you sure?",
      "Deleting this image will remove it from this gear review",
      [{ text: "Delete Image", onPress: () => this.removeImage() }, { text: "Cancel", style: "cancel" }],
      { cancelable: true }
    )
  }

  openCameraRollContainer() {
    this.props.toggleCameraRollModal(true)
  }

  renderCameraRollContainer() {
    if (this.props.activeView !== "gear_review_form") return

    return <CameraRollContainer imageCallback={this.uploadImage} selectSingleItem />
  }

  setActiveImageIndexNull = () => {
    this.props.updateActiveImageIndex(null)
  }

  renderDeleteCover() {
    return (
      <View
        style={{
          width: 120,
          padding: 20,
          position: "absolute",
          zIndex: 11,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: 120,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <TouchableWithoutFeedback onPress={this.handleImageRemove}>
          <View style={{ display: "flex", height: 60, flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="delete" size={20} color="white" />
            <Text style={{ color: "white" }}>DELETE</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.setActiveImageIndexNull}>
          <View style={{ display: "flex", height: 60, flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="cancel" style={{ marginRight: 2 }} size={20} color="white" />
            <Text style={{ color: "white" }}>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderLoadingCover() {
    return (
      <View
        style={{
          width: 120,
          padding: 20,
          position: "absolute",
          zIndex: 11,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: 120,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <MaterialIndicator size={40} color="#FF5423" />
      </View>
    )
  }

  renderImageCover(imageIsLoading, isActiveImage) {
    if (imageIsLoading) {
      return this.renderLoadingCover()
    } else if (isActiveImage) {
      return this.renderDeleteCover()
    }
  }

  imageIsLoading(item) {
    return item.localUri && this.props.imageUploading
  }

  selectSourceUri(imageIsLoading, item) {
    return imageIsLoading ? item.localUri : item.thumbnailUri
  }

  updateActiveImageIndex = index => {
    this.props.updateActiveImageIndex(index)
  }

  renderItem = (item, index) => {
    let imageIsLoading = this.imageIsLoading(item)
    let sourceUri = this.selectSourceUri(imageIsLoading, item)
    let isActiveImage = this.props.activeImageIndex === index

    return (
      <TouchableWithoutFeedback onPress={() => this.updateActiveImageIndex(index)}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            width: 120,
            height: 120,
            backgroundColor: "white",
            marginRight: 10,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: "#d3d3d3"
          }}>
          {this.renderImageCover(imageIsLoading, isActiveImage)}
          <ProgressiveImage source={sourceUri} style={{ width: 120, height: 120 }} />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderUploadButton = () => {
    return (
      <TouchableWithoutFeedback onPress={() => this.openCameraRollContainer()}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            width: 120,
            height: 120,
            backgroundColor: "white",
            marginRight: 10,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: "#d3d3d3",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around"
          }}>
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
            <MaterialIcons name={"file-upload"} size={32} />
            <View>
              <Text style={{ fontSize: 20 }}>Upload</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 18, color: "#323941" }}>Photos</Text>
        </View>
        <FlatList
          ListHeaderComponent={this.renderUploadButton}
          extraData={this.props.activeImageIndex}
          horizontal={true}
          data={this.props.images}
          renderItem={({ item, index }) => this.renderItem(item, index)}
        />
        {this.renderCameraRollContainer()}
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormImageCarousel)
