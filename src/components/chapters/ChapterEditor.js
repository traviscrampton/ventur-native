import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native"
import { gql } from "agent"
import { connect } from "react-redux"
import {
  editEntry,
  updateFormatBar,
  turnTextToTextInput,
  updateActiveIndex,
  removeEntryAndFocus,
  updateActiveImageCaption,
  setNextIndexNull,
  prepManageContent,
  updateKeyboardState
} from "actions/editor"
import InputScrollView from "react-native-input-scroll-view"
import ContentCreator from "components/editor/content_creator"
import EditorToolbar from "components/editor/editor_toolbar"
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  updateActiveImageCaption: payload => dispatch(updateActiveImageCaption(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateKeyboardState: payload => dispatch(updateKeyboardState(payload)),
  removeEntryAndFocus: payload => dispatch(removeEntryAndFocus(payload)),
  setNextIndexNull: payload => dispatch(setNextIndexNull(payload)),
  prepManageContent: payload => dispatch(prepManageContent(payload))
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
  newIndex: state.editor.newIndex
})

class ChapterEditor extends Component {
  constructor(props) {
    super(props)
    this.openCameraRoll = this.openCameraRoll.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
    this.openManageContent = this.openManageContent.bind(this)
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow.bind(this))
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide.bind(this))
  }

  navigateBack() {
    this.props.navigation.goBack()
  }

  renderTitleAndDescription() {
    const { title, description } = this.props.chapter
    return (
      <View style={{ padding: 20, paddingTop: 0, paddingBottom: 10 }}>
        <View>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "playfair",
              color: "black"
            }}>
            {title}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 18, color: "#c3c3c3", fontFamily: "open-sans-semi" }}>{description}</Text>
        </View>
      </View>
    )
  }

  renderStatistics() {
    const { dateCreated, distance } = this.props.chapter
    return (
      <View style={{ padding: 20, paddingTop: 0 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: "#f8f8f8",
            paddingTop: 10
          }}>
          <MaterialCommunityIcons name="calendar" size={18} style={{ marginRight: 5 }} />
          <Text style={{ fontFamily: "overpass", fontSize: 14 }}>{`${dateCreated}`.toUpperCase()}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <MaterialIcons style={{ marginRight: 5 }} name="directions-bike" size={16} />
          <Text style={{ fontFamily: "overpass", fontSize: 14 }}>{`${distance} miles`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderBannerImage() {
    const { bannerImageUrl } = this.props.chapter
    return <Image style={{ width: Dimensions.get("window").width, height: 200 }} source={{ uri: bannerImageUrl }} />
  }

  componentDidUpdate(prevProps) {
    let nextIndex = this.refs[`textInput${this.props.newIndex}`]
    if (nextIndex) {
      nextIndex.focus()
      this.props.setNextIndexNull()
    }
  }

  keyboardWillShow(e) {
    this.props.updateKeyboardState(true)
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
        return { fontFamily: "playfair", fontSize: 22 }
      case "QUOTE":
        return {
          fontStyle: "italic",
          borderLeftWidth: 5,
          paddingTop: 10,
          paddingBottom: 10
        }
      default:
        return {}
    }
  }

  updateActiveIndex(e, index) {
    this.props.updateActiveIndex(index)
  }

  handleLayoutChange(e, index) {
    let editableEntry = this.props.entries[index]
    const entry = { ...editableEntry, height: e.nativeEvent.contentSize.height + 5 }
    payload = Object.assign({}, { entry, index })
    this.props.editEntry(payload)
  }

  deleteIfEmpty(index) {
    const entry = this.props.entries[index]
    if (entry.content.length === 0) {
      this.props.removeEntryAndFocus(index)
    }
  }

  renderAsTheText(entry, index) {
    return (
      <TouchableWithoutFeedback onPress={e => this.updateActiveIndex(e, index)} key={index}>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 0,
            paddingBottom: 10,
            minHeight: Math.max(60, entry.height)
          }}>
          <Text
            style={[
              {
                fontSize: 18,
                lineHeight: 25
              },
              this.getInputStyling(entry)
            ]}>
            {entry.content}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderEntry(entry, index) {
    switch (entry.type) {
      case "text":
        return this.renderAsTextInput(entry, index)
      case "image":
        return this.renderAsImage(entry, index)
      default:
        console.log("WHAT IS IT?!", entry)
    }
  }

  renderOpacCover(index) {
    // todo => make functional component
    if (index !== this.props.activeIndex) {
      return
    }

    return (
      <TouchableWithoutFeedback onPress={e => this.updateActiveIndex(e, null)}>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 350,
            padding: 10,
            zIndex: 1,
            opacity: 0.6,
            display: "flex",
            backgroundColor: "black",
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute"
          }}>
          <TouchableWithoutFeedback onPress={() => this.props.removeEntryAndFocus(index)}>
            <View>
              <Text style={{ color: "white", opacity: 1, fontSize: 20 }}>Delete</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={e => this.openImageCaptionForm(e, index)}>
            <View>
              <Text style={{ color: "white", opacity: 1, fontSize: 20 }}>Caption</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderAsImage(entry, index) {
    // todo => make functional component
    return (
      <View key={`image${index}`} style={{ position: "relative" }}>
        {this.renderOpacCover(index)}
        <TouchableWithoutFeedback style={{ position: "relative" }} onPress={e => this.updateActiveIndex(e, index)}>
          <View>
            <Image style={{ width: Dimensions.get("window").width, height: 350 }} source={{ uri: entry.uri }} />
            {this.renderImageCaption(entry)}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderImageCaption(entry) {
    if (entry.caption.length === 0) {
      return
    }

    return (
      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Text style={{ textAlign: "center" }}>{entry.caption}</Text>
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
        style={[
          {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: 22,
            fontFamily: "open-sans-regular",
            lineHeight: 24,
            minHeight: Math.max(30, entry.height)
          },
          this.getInputStyling(entry)
        ]}
        onChangeText={text => this.handleTextChange(text, index)}
        onBlur={() => this.deleteIfEmpty(index)}
        placeholder={"Enter Entry..."}
        value={entry.content}
        onFocus={() => this.handleOnFocus(index)}
        onContentSizeChange={e => this.handleLayoutChange(e, index)}
        blurOnSubmit={false}
      />
    )
  }

  openCameraRoll(e, index) {
    this.props.navigation.navigate("CameraRollContainer", { index: index })
  }

  openImageCaptionForm(e, index) {
    const entryCaption = this.props.entries[index].caption
    this.props.updateActiveImageCaption(entryCaption)
    this.props.navigation.navigate("ImageCaptionForm", { index: index })
  }

  openManageContent() {
    this.props.prepManageContent()
    this.props.navigation.navigate("ManageContent")
  }

  renderEditorToolbar() {
    return (
      <KeyboardAvoidingView behavior={"position"}>
        <EditorToolbar openManageContent={this.openManageContent} />
      </KeyboardAvoidingView>
    )
  }

  renderCreateCta(index) {
    return (
      <ContentCreator
        index={index}
        key={`contentCreator${index}`}
        openCameraRoll={e => this.openCameraRoll(e, index)}
      />
    )
  }

  renderChapterMetadata() {
    return (
      <React.Fragment>
        {this.renderTitleAndDescription()}
        {this.renderStatistics()}
        {this.renderBannerImage()}
      </React.Fragment>
    )
  }

  renderEditor() {
    return this.props.entries.map((entry, index) => {
      return (
        <React.Fragment>
          {this.renderEntry(entry, index)}
          {this.renderCreateCta(index)}
        </React.Fragment>
      )
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ backgroundColor: "white", marginBottom: 200 }}>
        <InputScrollView
          useAnimatedScrollView={true}
          bounces={true}
          keyboardDismissMode="on-drag"
          style={{ position: "relative" }}
          keyboardOffset={100}
          multilineInputStyle={{ lineHeight: 30 }}>
          {this.renderChapterMetadata()}
          {this.renderEditor()}
        </InputScrollView>
        {this.renderEditorToolbar()}
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterEditor)
