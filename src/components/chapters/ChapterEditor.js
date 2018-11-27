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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  Switch,
  AsyncStorage,
  TouchableHighlight,
  CameraRoll
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
  populateEntries
} from "actions/editor"
import { loadChapter } from "actions/chapter"
import InputScrollView from "react-native-input-scroll-view"
import ContentCreator from "components/editor/ContentCreator"
import EditorToolbar from "components/editor/EditorToolbar"
import { populateOfflineChapters } from "actions/user"
import { persistChapterToAsyncStorage, removeChapterFromAsyncStorage } from "utils/offline_helpers"
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  updateActiveImageCaption: payload => dispatch(updateActiveImageCaption(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
  updateEntryState: payload => dispatch(updateEntryState(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateKeyboardState: payload => dispatch(updateKeyboardState(payload)),
  removeEntryAndFocus: payload => dispatch(removeEntryAndFocus(payload)),
  storeChapterToOfflineMode: payload => dispatch(storeChapterToOfflineMode(payload)),
  setNextIndexNull: payload => dispatch(setNextIndexNull(payload)),
  prepManageContent: payload => dispatch(prepManageContent(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  saveEditorContent: (entries, chapterId) => saveEditorContent(entries, chapterId, dispatch),
  editChapterOfflineMode: (chapter, offline) => editChapterOfflineMode(chapter, offline, dispatch),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload))
})

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  loaded: state.chapter.loaded,
  currentUser: state.common.currentUser,
  entries: state.editor.entries,
  activeAttribute: state.editor.activeAttribute,
  focusedEntryIndex: state.editor.focusedEntryIndex,
  activeIndex: state.editor.activeIndex,
  cursorPosition: state.editor.cursorPosition,
  containerHeight: state.editor.containerHeight,
  newIndex: state.editor.newIndex,
  keyboardShowing: state.editor.keyboardShowing
})

class ChapterEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      containerHeight: Dimensions.get("window").height - 110,
      offlineMode: false,
      imagesNeededOffline: []
    }
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardWillShow.bind(this))
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide.bind(this))
  }

  componentDidMount() {
    this.populateEditor()
  }

  componentDidUpdate(prevProps, prevState) {
    let nextIndex = this.refs[`textInput${this.props.newIndex}`]
    if (nextIndex) {
      nextIndex.focus()
      this.props.setNextIndexNull()
    }
  }

  populateEditor = () => {
    let entries
    if (!this.props.chapter.content) {
      entries = [{ type: "text", content: "", styles: "" }]
    } else {
      entries = this.props.chapter.content
    }

    this.props.populateEntries(entries)
  }

  navigateBack() {
    this.props.navigation.goBack()
  }

  renderTitleAndDescription() {
    const { title, description } = this.props.chapter
    return (
      <View style={styles.titleAndDescriptionContainer}>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    )
  }

  renderStatistics() {
    const { readableDate, distance } = this.props.chapter
    return (
      <View style={styles.statsContainer}>
        <View style={styles.iconsAndText}>
          <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPositioning} />
          <Text style={styles.iconText}>{`${readableDate}`.toUpperCase()}</Text>
        </View>
        <View style={styles.iconsAndText}>
          <MaterialIcons style={styles.iconPositioning} name="directions-bike" size={16} />
          <Text style={styles.iconText}>{`${distance} miles`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderBannerImage() {
    const { bannerImageUrl } = this.props.chapter
    return <Image style={styles.bannerImage} source={{ uri: bannerImageUrl }} />
  }

  keyboardWillShow(e) {
    this.props.updateKeyboardState(true)
    this.setState({
      containerHeight: Dimensions.get("window").height - e.endCoordinates.height - 110
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

  renderOpacCover(index, imageHeight) {
    if (index !== this.props.activeIndex) return

    return (
      <TouchableWithoutFeedback onPress={e => this.updateActiveIndex(e, null)}>
        <View style={[styles.opacCover, { height: imageHeight }]}>
          <TouchableWithoutFeedback onPress={() => this.props.removeEntryAndFocus(index)}>
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
    return this.props.chapter.offline ? entry.localUri : entry.uri
  }

  downloadToDevice(entry, index) {
    if (!this.state.offlineMode) return

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
              {this.renderOpacCover(index, imageHeight)}
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
    this.props.updateActiveIndex(index)
    this.props.updateFormatBar(styles)
  }

  renderAsTextInput(entry, index) {
    return (
      <TextInput
        multiline
        key={index}
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

  openCameraRoll = e => {
    this.props.navigation.navigate("CameraRollContainer", { index: this.props.activeIndex + 1 })
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
    if (this.props.keyboardShowing) {
      return { width: Dimensions.get("window").width, position: "absolute", top: this.state.containerHeight }
    } else {
      return { width: Dimensions.get("window").width }
    }
  }

  updateOfflineStatus = async () => {
    let { chapter } = this.props
    const { offline } = chapter
    this.props.editChapterOfflineMode(chapter, !offline)

    if (offline) {
      await removeChapterFromAsyncStorage(chapter, this.props.populateOfflineChapters)
    } else {
      await persistChapterToAsyncStorage(chapter, this.props.populateOfflineChapters)
    }
  }

  renderEditorToolbar() {
    return (
      <View style={this.getToolbarPositioning()}>
        <EditorToolbar openManageContent={this.openManageContent} openCameraRoll={e => this.openCameraRoll(e)} />
      </View>
    )
  }

  renderCreateCta(index) {
    return <ContentCreator index={index} key={`contentCreator${index}`} />
  }

  renderSwitch() {
    return <Switch value={this.props.chapter.offline} onValueChange={this.updateOfflineStatus} />
  }

  renderChapterMetadata() {
    return (
      <View style={styles.marginBottom20}>
        {this.renderTitleAndDescription()}
        {this.renderStatistics()}
        {this.renderBannerImage()}
        {this.renderSwitch()}
      </View>
    )
  }

  renderEditor() {
    return this.props.entries.map((entry, index) => {
      return (
        <View>
          {this.renderEntry(entry, index)}
          {this.renderCreateCta(index)}
        </View>
      )
    })
  }

  getContainerSize() {
    return { height: Dimensions.get("window").height - 110 }
  }

  renderToggleEdit() {
    return (
      <TouchableHighlight onPress={this.props.toggleEditMode}>
        <View
          style={{
            height: 50,
            backgroundColor: "#f8f8f8",
            width: Dimensions.get("window").width,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Text style={{ fontSize: 18 }}>Done Editing</Text>
        </View>
      </TouchableHighlight>
    )
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
          {this.renderChapterMetadata()}
          {this.renderOfflineButton()}
          {this.renderToggleEdit()}
          {this.renderEditor()}
        </InputScrollView>
        {this.renderEditorToolbar()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "yellow",
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
    color: "black"
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
    flexDirection: "row"
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
    paddingLeft: 10,
    paddingRight: 10,
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
