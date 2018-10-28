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
  TouchableHighlight
} from "react-native"
import { connect } from "react-redux"
import {
  editEntry,
  updateFormatBar,
  updateActiveIndex,
  removeEntryAndFocus,
  updateActiveImageCaption,
  setNextIndexNull,
  prepManageContent,
  updateKeyboardState,
  populateEntries
} from "actions/editor"
import { loadChapter } from "actions/chapter"
import InputScrollView from "react-native-input-scroll-view"
import ContentCreator from "components/editor/ContentCreator"
import EditorToolbar from "components/editor/EditorToolbar"
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  updateActiveImageCaption: payload => dispatch(updateActiveImageCaption(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateKeyboardState: payload => dispatch(updateKeyboardState(payload)),
  removeEntryAndFocus: payload => dispatch(removeEntryAndFocus(payload)),
  setNextIndexNull: payload => dispatch(setNextIndexNull(payload)),
  prepManageContent: payload => dispatch(prepManageContent(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  loadChapter: payload => dispatch(loadChapter(payload))
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
      containerHeight: Dimensions.get("window").height - 110
    }
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardWillShow.bind(this))
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide.bind(this))
  }

  componentDidMount() {
    this.populateEditor()
  }

  componentDidUpdate(prevProps) {
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
      entries = JSON.parse(this.props.chapter.content)
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
    const { dateCreated, distance } = this.props.chapter
    return (
      <View style={styles.statsContainer}>
        <View style={styles.iconsAndText}>
          <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPositioning} />
          <Text style={styles.iconText}>{`${dateCreated}`.toUpperCase()}</Text>
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

  getOpacCoverHeight() {
    return {}
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

  renderAsImage(entry, index) {
    const imageHeight = this.getImageHeight(entry.aspectRatio)

    return (
      <View key={`image${index}`} style={styles.positionRelative}>
        <TouchableWithoutFeedback style={styles.positionRelative} onPress={e => this.updateActiveIndex(e, index)}>
          <View>
            <ImageBackground
              style={{ width: Dimensions.get("window").width, height: imageHeight }}
              source={{ uri: entry.uri }}>
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

  renderChapterMetadata() {
    return (
      <View style={styles.marginBottom20}>
        {this.renderTitleAndDescription()}
        {this.renderStatistics()}
        {this.renderBannerImage()}
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
