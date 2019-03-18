import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  AsyncStorage,
  TouchableHighlight,
  CameraRoll,
  Alert,
  ActivityIndicator
} from "react-native"
import { connect } from "react-redux"
import {
  editEntry,
  updateFormatBar,
  updateActiveIndex,
  removeEntryAndFocus,
  updateActiveImageCaption,
  setNextIndexNull,
  editChapterOfflineMode,
  prepManageContent,
  updateKeyboardState,
  saveEditorContent,
  updateEntryState,
  storeChapterToOfflineMode,
  populateEntries,
  setInitialEditorState,
  addImageToDeletedIds
} from "actions/editor"
import ChapterMetaDataForm from "components/editor/ChapterMetaDataForm"
import InputScrollView from "react-native-input-scroll-view"
import _ from "lodash"
import { updateChapterForm } from "actions/chapter_form"
import DatePickerDropdown from "components/editor/DatePickerDropdown"
import EditorToolbar from "components/editor/EditorToolbar"
import { updateChapter, generateReadableDate } from "utils/chapter_form_helper"
import { populateOfflineChapters } from "actions/user"
import ContentCreator from "components/editor/ContentCreator"
import {
  persistChapterToAsyncStorage,
  removeChapterFromAsyncStorage,
  offlineChapterCreate,
  notInternetConnected
} from "utils/offline_helpers"
import { FontAwesome } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  setInitialEditorState: () => dispatch(setInitialEditorState()),
  updateActiveImageCaption: payload => dispatch(updateActiveImageCaption(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
  updateEntryState: payload => dispatch(updateEntryState(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateKeyboardState: payload => dispatch(updateKeyboardState(payload)),
  removeEntryAndFocus: payload => dispatch(removeEntryAndFocus(payload)),
  storeChapterToOfflineMode: payload => dispatch(storeChapterToOfflineMode(payload)),
  setNextIndexNull: payload => dispatch(setNextIndexNull(payload)),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  prepManageContent: payload => dispatch(prepManageContent(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  saveEditorContent: (entries, chapterId) => saveEditorContent(entries, chapterId, dispatch),
  editChapterOfflineMode: (chapter, offline) => editChapterOfflineMode(chapter, offline, dispatch),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload)),
  addImageToDeletedIds: payload => dispatch(addImageToDeletedIds(payload))
})

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  chapterForm: state.chapterForm,
  loaded: state.chapter.loaded,
  currentUser: state.common.currentUser,
  entries: state.editor.entries,
  activeAttribute: state.editor.activeAttribute,
  focusedEntryIndex: state.editor.focusedEntryIndex,
  activeIndex: state.editor.activeIndex,
  cursorPosition: state.editor.cursorPosition,
  containerHeight: state.editor.containerHeight,
  newIndex: state.editor.newIndex,
  showEditorToolbar: state.editor.showEditorToolbar,
  isOffline: state.common.isOffline,
  uploadIsImage: state.editor.uploadIsImage
})

class ChapterEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      containerHeight: Dimensions.get("window").height - 105,
      offlineMode: false,
      imagesNeededOffline: []
    }
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardWillShow.bind(this))
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide.bind(this))
  }

  async componentDidMount() {
    // this.populateEditor()
  }

  componentWillUnmount() {
    this.props.setInitialEditorState()
  }

  componentDidUpdate(prevProps, prevState) {
    let nextIndex = this.refs[`textInput${this.props.newIndex}`]
    if (nextIndex) {
      nextIndex.focus()
      this.props.setNextIndexNull()
    }
  }

  populateEditor = () => {
    let entries = this.props.chapter.content ? this.props.chapter.content : []

    this.props.populateEntries(entries)
  }

  keyboardWillShow(e) {
    // this.props.updateKeyboardState(true)
    this.setState({
      containerHeight: Dimensions.get("window").height - e.endCoordinates.height - 105
    })
  }

  keyboardWillHide(e) {
    this.props.updateKeyboardState(false)
  }

  handleTextChange(content, index) {
    let payload
    let editableEntry = this.props.entries[index]
    const entry = { ...editableEntry, content: content }

    payload = Object.assign({}, { entry, index })
    this.props.editEntry(payload)
  }

  getInputStyling(entry) {
    switch (entry.styles) {
      case "H1":
        return styles.headerText
      case "QUOTE":
        return styles.quoteText
      default:
        return {}
    }
  }

  updateActiveIndex(e, index) {
    this.props.updateActiveIndex(index)
  }

  deleteIfEmpty(index) {
    const entry = this.props.entries[index]
    if (entry.content.length === 0) {
      this.props.removeEntryAndFocus(index)
    }
  }

  handleImageDelete = index => {
    Alert.alert(
      "Are you sure?",
      "Deleting this image will erase it from this chapter",
      [{ text: "Delete Image", onPress: () => this.deleteImage(index) }, { text: "Cancel", style: "cancel" }],
      { cancelable: true }
    )
  }

  deleteImage = index => {
    let imageId = this.props.entries[index].id

    this.props.addImageToDeletedIds(imageId)
    this.props.removeEntryAndFocus(index)
  }

  renderEntry(entry, index) {
    switch (entry.type) {
      case "text":
        return this.renderAsTextInput(entry, index)
      case "image":
        return this.renderAsImage(entry, index)
      default:
        return null
    }
  }

  renderImageLoadingCover(index, imageHeight) {
    return (
      <View
        style={[
          styles.opacCover,
          { height: imageHeight, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }
        ]}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    )
  }

  renderOpacCover(index, imageHeight, image) {
    if (this.props.uploadIsImage && !image.id) {
      return this.renderImageLoadingCover(index, imageHeight)
    }

    if (index !== this.props.activeIndex) return

    return (
      <TouchableWithoutFeedback onPress={e => this.updateActiveIndex(e, null)}>
        <View style={[styles.opacCover, { height: imageHeight }]}>
          <TouchableWithoutFeedback onPress={() => this.handleImageDelete(index)}>
            <View>
              <FontAwesome name={"trash-o"} size={28} color={"white"} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={e => this.openImageCaptionForm(e, index)}>
            <View>
              <FontAwesome name={"quote-right"} color={"white"} size={28} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  getImageHeight(aspectRatio) {
    return aspectRatio * Dimensions.get("window").width
  }

  commenceDownloadtoDevice = () => {
    this.setState({
      offlineMode: true
    })
  }

  async persistChapterToLocalStorage() {
    await persistChapterToAsyncStorage(this.props.chapter)
  }

  async saveImagesToCameraRoll() {
    for (let img of this.state.imagesNeededOffline) {
      await CameraRoll.saveToCameraRoll(img.entry.uri, "photo").then(uri => {
        entry = Object.assign(img.entry, { localUri: uri })
        this.props.updateEntryState({ entry: img.entry, index: img.index })
      })
    }
  }

  actuallyDownload = async () => {
    await this.saveImagesToCameraRoll()
    await this.props.saveEditorContent(this.props.entries, this.props.chapter.id)
    this.persistChapterToLocalStorage()
    this.setState({
      imagesNeededOffline: []
    })
  }

  downloadButton() {
    return (
      <TouchableWithoutFeedback onPress={this.actuallyDownload}>
        <View style={{ height: 60, backgroundColor: "orange" }}>
          <Text>download {this.state.imagesNeededOffline.length} images</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  commenceDownloadtoDeviceButton() {
    return (
      <TouchableWithoutFeedback onPress={this.commenceDownloadtoDevice}>
        <View style={{ height: 60, backgroundColor: "red" }}>
          <Text>download to device</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderProperUri(entry) {
    return this.props.isOffline ? entry.localUri : entry.uri
  }

  downloadToDevice(entry, index) {
    if (!this.props.isOffline) return

    let image = { entry: entry, index: index }
    let imagesNeededOffline = [...this.state.imagesNeededOffline, image]

    this.setState({
      imagesNeededOffline: imagesNeededOffline
    })
  }

  renderOfflineButton() {
    if (!this.props.chapter.offline || this.state.imagesNeededOffline.length === 0) return

    return this.downloadButton()
  }

  renderDivider() {
    return (
      <View
        style={{
          borderBottomWidth: 3,
          borderBottomColor: "black",
          width: 90,
          marginTop: 10,
          marginLeft: 20,
          marginBottom: 30
        }}
      />
    )
  }

  renderAsImage(entry, index) {
    const imageHeight = this.getImageHeight(entry.aspectRatio)

    return (
      <View key={`image${index}`} style={styles.positionRelative}>
        <TouchableWithoutFeedback style={styles.positionRelative} onPress={e => this.updateActiveIndex(e, index)}>
          <View>
            <ImageBackground
              style={{ width: Dimensions.get("window").width, height: imageHeight }}
              source={{ uri: this.renderProperUri(entry) }}
              onError={() => this.downloadToDevice(entry, index)}>
              {this.renderOpacCover(index, imageHeight, entry)}
            </ImageBackground>
            {this.renderImageCaption(entry)}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderImageCaption(entry) {
    if (entry.caption.length === 0) return

    return (
      <View style={styles.captionPadding}>
        <Text style={styles.textAlignCenter}>{entry.caption}</Text>
      </View>
    )
  }

  handleOnFocus(index) {
    const styles = this.props.entries[index].styles
    this.props.updateKeyboardState(true)
    this.props.updateActiveIndex(index)
    this.props.updateFormatBar(styles)
  }

  renderAsTextInput(entry, index) {
    return (
      <TextInput
        multiline
        key={index}
        selectionColor={"#FF8C34"}
        ref={`textInput${index}`}
        style={[styles.textInput, this.getInputStyling(entry)]}
        onChangeText={text => this.handleTextChange(text, index)}
        onBlur={() => this.deleteIfEmpty(index)}
        placeholder={"Enter Entry..."}
        value={entry.content}
        onFocus={() => this.handleOnFocus(index)}
        blurOnSubmit={false}
      />
    )
  }

  getAppropriateIndex() {
    let activeEntry = this.props.entries[this.props.activeIndex]
    if (activeEntry.content.length === 0 && this.props.activeIndex !== 0) {
      return this.props.activeIndex - 1
    } else {
      return this.props.activeIndex
    }
  }

  openImageCaptionForm(e, index) {
    const entryCaption = this.props.entries[index].caption
    this.props.updateActiveImageCaption(entryCaption)
    this.props.navigation.navigate("ImageCaptionForm", { index: index })
  }

  openManageContent = () => {
    this.props.prepManageContent()
    this.props.navigation.navigate("ManageContent")
  }

  getToolbarPositioning() {
    if (this.props.showEditorToolbar) {
      return { width: Dimensions.get("window").width, position: "absolute", top: this.state.containerHeight }
    } else {
      return { width: Dimensions.get("window").width }
    }
  }

  renderEditorToolbar() {
    if (!this.props.showEditorToolbar) return

    return (
      <View style={this.getToolbarPositioning()}>
        <EditorToolbar openManageContent={this.openManageContent} />
      </View>
    )
  }

  renderCreateCta(index) {
    return <ContentCreator index={index} key={`contentCreator${index}`} navigation={this.props.navigation} />
  }

  renderChapterForm() {
    return <ChapterMetaDataForm navigation={this.props.navigation} />
  }

  renderEditor() {
    if (!this.props.chapter.id) return

    return this.props.entries.map((entry, index) => {
      return (
        <View>
          {this.renderCreateCta(index)}
          {this.renderEntry(entry, index)}
        </View>
      )
    })
  }

  getContainerSize() {
    if (this.props.showEditorToolbar) {
      return { height: Dimensions.get("window").height - 105 }
    } else {
      return { height: Dimensions.get("window").height }
    }
  }

  render() {
    return (
      <View style={([styles.container], this.getContainerSize())}>
        <InputScrollView
          useAnimatedScrollView={true}
          bounces={true}
          style={styles.positionRelative}
          keyboardOffset={90}
          multilineInputStyle={{ lineHeight: 30 }}>
          {this.renderChapterForm()}
          {this.renderDivider()}
          {this.renderOfflineButton()}
          <View style={{ marginBottom: 100 }}>
            {this.renderEditor()}
            {this.renderCreateCta(this.props.entries.length)}
          </View>
        </InputScrollView>
        {this.renderEditorToolbar()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    position: "relative"
  },
  titleAndDescriptionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10
  },
  title: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "black",
    backgroundColor: "#f8f8f8"
  },
  description: {
    fontSize: 18,
    color: "#c3c3c3",
    fontFamily: "open-sans-semi"
  },
  statsContainer: {
    padding: 20,
    paddingTop: 0
  },
  iconsAndText: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 5,
    backgroundColor: "#f8f8f8"
  },
  iconPositioning: {
    marginRight: 5
  },
  iconText: {
    fontFamily: "overpass",
    fontSize: 14
  },
  bannerImage: {
    width: Dimensions.get("window").width,
    height: 200
  },
  headerText: {
    fontFamily: "playfair",
    fontSize: 22
  },
  quoteText: {
    fontStyle: "italic",
    borderLeftWidth: 5,
    paddingTop: 10,
    paddingBottom: 10
  },
  opacCover: {
    width: Dimensions.get("window").width,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  positionRelative: {
    position: "relative"
  },
  captionPadding: {
    paddingLeft: 20,
    paddingRight: 20
  },
  textAlignCenter: {
    textAlign: "center"
  },
  textInput: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 20,
    fontFamily: "open-sans-regular",
    lineHeight: 24,
    minHeight: 30
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterEditor)
