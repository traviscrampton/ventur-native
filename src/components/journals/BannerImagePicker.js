import React, { Component } from "react"
import { connect } from "react-redux"
import { updateChapterForm } from "actions/chapter_form"
import { chapterQuery } from "graphql/queries/chapters"
import { setToken } from "agent"
import CameraRollPicker from "react-native-camera-roll-picker"
import { Header } from "components/editor/Header"
import { gql } from "agent"
import { loadChapter } from "actions/chapter"
const API_ROOT = "http://192.168.7.23:3000"

const mapStateToProps = state => ({
  id: state.chapterForm.id
})
const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateJournalForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload))
})

class BannerImagePicker extends Component {
  constructor(props) {
    super(props)
    this.handleGoBack = this.handleGoBack.bind(this)
    this.getSelectedImage = this.getSelectedImage.bind(this)

    this.state = {
      selectedImage: {}
    }
  }

  handleGoBack() {
    this.setState({
      selectedImage: {}
    })
    this.props.navigation.goBack()
  }

  getSelectedImage(images) {
    console.log("images", images)
    if (images.length === 0) {
      this.setState({
        selectedImages: {}
      })
      return
    }
    let image = images[0]
    this.setState({
      selectedImage: image
    })
  }

  getConfirmCta() {
    return this.state.selectedImage.uri ? "Add" : "No Image"
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Back",
      handleGoBack: this.handleGoBack,
      centerCta: `Banner Image`,
      handleConfirm: this.uploadChapterImage,
      confirmCta: this.getConfirmCta()
    }
    return <Header key="header" {...headerProps} />
  }

  uploadChapterImage = async () => {
    console.log("HIT")
    const formData = new FormData()
    let { selectedImage } = this.state
    let imgPost = {
      uri: selectedImage.uri,
      name: selectedImage.filename,
      type: "multipart/form-data"
    }
    formData.append("banner_image", imgPost)
    let params = { id: this.props.id, banner_image: imgPost }
    console.log("PARAMS", params)
    const token = await setToken()
    fetch(`${API_ROOT}/chapters/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token
      },
      body: formData
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.loadAndNavigate(data.id)
      })
  }

  loadAndNavigate(id) {
    gql(chapterQuery, { id: id }).then(res => {
      this.props.loadChapter(res.chapter)
      this.props.navigation.navigate("Chapter")
    })
  }

  renderCameraRollPicker() {
    return (
      <CameraRollPicker
        selectSingleItem
        key="cameraRollPicker"
        selected={[this.state.selectedImage]}
        callback={this.getSelectedImage}
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
)(BannerImagePicker)
