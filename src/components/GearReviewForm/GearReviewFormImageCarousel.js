import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Text, FlatList, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"
import ProgressiveImage from "../shared/ProgressiveImage"
import { uploadImageToCarousel } from "../../actions/gear_review_form"
import { MaterialIndicator } from "react-native-indicators"
import CameraRollContainer from "../editor/CameraRollContainer"
import { toggleCameraRollModal, updateActiveView } from "../../actions/camera_roll"

const mapStateToProps = state => ({
  width: state.common.width,
  images: state.gearReviewForm.images,
  activeView: state.cameraRoll.activeView,
  imageUploading: state.gearReviewForm.imageUploading
})

const mapDispatchToProps = dispatch => ({
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  uploadImageToCarousel: payload => dispatch(uploadImageToCarousel(payload)),
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
    console.log("selected Image", selectedImage)
    this.props.uploadImageToCarousel(selectedImage)
  }

  openCameraRollContainer() {
    this.props.toggleCameraRollModal(true)
  }

  renderCameraRollContainer() {
    if (this.props.activeView !== "gear_review_form") return

    return <CameraRollContainer imageCallback={this.uploadImage} selectSingleItem />
  }

  renderImageCover(imageIsLoading) {
    if (!imageIsLoading) return

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

  imageIsLoading(item) {
    return item.localUri && this.props.imageUploading
  }

  selectSourceUri(imageIsLoading, item) {
    return imageIsLoading ? item.localUri : item.thumbnailUri
  }

  renderItem = ({ item }) => {
    let imageIsLoading = this.imageIsLoading(item)
    let sourceUri = this.selectSourceUri(imageIsLoading, item)

    return (
      <View
        style={{
          width: 120,
          height: 120,
          backgroundColor: "white",
          marginRight: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#d3d3d3"
        }}>
        {this.renderImageCover(imageIsLoading)}
        <ProgressiveImage source={sourceUri} style={{ width: 120, height: 120 }} />
      </View>
    )
  }

  renderUploadButton = () => {
    return (
      <TouchableWithoutFeedback onPress={() => this.openCameraRollContainer()}>
        <View
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
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Photos</Text>
        </View>
        <FlatList
          ListHeaderComponent={this.renderUploadButton}
          horizontal={true}
          data={this.props.images}
          renderItem={this.renderItem}
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
