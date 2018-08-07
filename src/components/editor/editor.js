import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  findNodeHandle,
  KeyboardAvoidingView
} from "react-native"
import { connect } from "react-redux"
import { UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY, UPDATE_ENTRY_FOCUS } from "actions/action_types"
import {
  editEntry,
  updateFormatBar,
  turnTextToTextInput,
  updateActiveIndex,
  removeEntryAndFocus,
  updateActiveImageCaption,
  setNextIndexNull,
  updateContainerHeight
} from "actions/editor"
import ContentCreator from "components/editor/content_creator"
import EditorToolbar from "components/editor/editor_toolbar"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import InputScrollView from "react-native-input-scroll-view"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  activeAttribute: state.editor.activeAttribute,
  focusedEntryIndex: state.editor.focusedEntryIndex,
  activeIndex: state.editor.activeIndex,
  cursorPosition: state.editor.cursorPosition,
  containerHeight: state.editor.containerHeight,
  newIndex: state.editor.newIndex
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  updateActiveImageCaption: payload => dispatch(updateActiveImageCaption(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateContainerHeight: payload => dispatch(updateContainerHeight(payload)),
  removeEntryAndFocus: payload => dispatch(removeEntryAndFocus(payload)),
  setNextIndexNull: payload => dispatch(setNextIndexNull(payload))
})

class Editor extends Component {
  constructor(props) {
    super(props)
    this.openCameraRoll = this.openCameraRoll.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
  }

  componentWillMount() {
    // this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow.bind(this))
    // this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide.bind(this))
  }

  componentDidUpdate(prevProps) {
    let nextIndex = this.refs[`textInput${this.props.newIndex}`]
    if (nextIndex) {
      nextIndex.focus()
      this.props.setNextIndexNull()
    }
  }

  // keyboardDidShow(e) {
  //   let newSize = Dimensions.get("window").height - e.endCoordinates.height - 80
  //   this.props.updateContainerHeight(true)
  // }

  // keyboardDidHide() {
  //   let newSize = Dimensions.get("window").height - 80
  //   this.props.updateContainerHeight(false)
  // }

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
        return { fontWeight: "600", fontSize: 22 }
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

  TextOrTextInput(entry, index) {
    if (this.props.activeIndex === index) {
      return this.renderAsTextInput(entry, index)
    } else {
      return this.renderAsTheText(entry, index)
    }
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
            fontSize: 17,
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

  renderEditorToolbar() {
    if (this.props.activeIndex && this.props.entries[this.props.activeIndex].type !== "text") {
      return
    }

    return (
      <KeyboardAvoidingView behavior={"position"}>
        <EditorToolbar />
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

  render() {
    return (
      <KeyboardAvoidingView style={{ backgroundColor: "white" }}>
        <View style={{ height: 60 }} />
        <InputScrollView
          useAnimatedScrollView={true}
          bounces={false}
          keyboardDismissMode="on-drag"
          style={{ position: "relative" }}
          keyboardOffset={100}
          multilineInputStyle={{ lineHeight: 30 }}>
          {this.props.entries.map((entry, index) => {
            return [this.renderEntry(entry, index), this.renderCreateCta(index)]
          })}>
        </InputScrollView>
        {this.renderEditorToolbar()}
      </KeyboardAvoidingView>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor)
