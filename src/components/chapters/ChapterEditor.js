import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  Alert,
  SafeAreaView,
  TouchableWithoutFeedback
} from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import {
  editEntry,
  updateFormatBar,
  updateActiveIndex,
  removeEntryAndFocus,
  updateActiveImageCaption,
  setNextIndexNull,
  prepManageContent,
  updateKeyboardState,
  populateEntries,
  setInitialEditorState,
  addToDeletedUrls,
  doneEditingAndPersist,
  loseChangesAndUpdate,
  addImagesToEntries
} from '../../actions/editor';
import { Header } from '../editor/header';
import InputScrollView from 'react-native-input-scroll-view';
import _ from 'lodash';
import EditorToolbar from '../editor/EditorToolbar';
import ContentCreator from '../editor/ContentCreator';
import { FontAwesome } from '@expo/vector-icons';
import LazyImage from '../shared/LazyImage';
import ImagePickerContainer from '../shared/ImagePickerContainer';

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  setInitialEditorState: () => dispatch(setInitialEditorState()),
  updateActiveImageCaption: payload =>
    dispatch(updateActiveImageCaption(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateKeyboardState: payload => dispatch(updateKeyboardState(payload)),
  removeEntryAndFocus: payload => dispatch(removeEntryAndFocus(payload)),
  setNextIndexNull: payload => dispatch(setNextIndexNull(payload)),
  prepManageContent: payload => dispatch(prepManageContent(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  loseChangesAndUpdate: payload => dispatch(loseChangesAndUpdate(payload)),
  doneEditingAndPersist: () => dispatch(doneEditingAndPersist()),
  addImagesToEntries: payload => dispatch(addImagesToEntries(payload)),
  addToDeletedUrls: payload => dispatch(addToDeletedUrls(payload))
});

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  chapterForm: state.chapterForm,
  loaded: state.chapter.loaded,
  currentUser: state.common.currentUser,
  entries: state.editor.entries,
  activeIndex: state.editor.activeIndex,
  initialImageIds: state.editor.initialImageIds,
  containerHeight: state.editor.containerHeight,
  newIndex: state.editor.newIndex,
  initialEntries: state.editor.initialEntries,
  showEditorToolbar: state.editor.showEditorToolbar,
  uploadIsImage: state.editor.uploadIsImage,
  deletedUrls: state.editor.deletedUrls,
  activeContentCreator: state.editor.activeContentCreator,
  width: state.common.width,
  height: state.common.height
});

class ChapterEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containerHeight: props.height - 80,
      offlineMode: false,
      imagesNeededOffline: [],
      scrollPosition: 0,
      imageYPositions: []
    };
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow.bind(this)
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.props.setInitialEditorState();
  }

  componentDidUpdate(prevProps, prevState) {
    let nextIndex = this.refs[`textInput${this.props.newIndex}`];
    if (nextIndex) {
      nextIndex.focus();
      this.props.setNextIndexNull();
    }
  }

  handleScroll = event => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  };

  populateEditor = () => {
    let entries = this.props.chapter.content ? this.props.chapter.content : [];

    this.props.populateEntries(entries);
  };

  keyboardWillShow(e) {
    this.setState({
      containerHeight: this.props.height - e.endCoordinates.height - 87
    });
  }

  keyboardWillHide(e) {
    this.props.updateKeyboardState(false);
  }

  handleTextChange(content, index) {
    let payload;
    let editableEntry = this.props.entries[index];
    const entry = { ...editableEntry, content: content };

    payload = Object.assign({}, { entry, index });
    this.props.editEntry(payload);
  }

  getInputStyling(entry) {
    switch (entry.styles) {
      case 'H1':
        return styles.headerText;
      case 'QUOTE':
        return styles.quoteText;
      default:
        return {};
    }
  }

  handleLayout(e, index) {
    const { y } = e.nativeEvent.layout;
    this.setState({
      imageYPositions: Object.assign({}, this.state.imageYPositions, {
        [index]: y
      })
    });
  }

  getYPosition(index) {
    if (index === 0) {
      return 0;
    }

    return this.state.imageYPositions[index]
      ? this.state.imageYPositions[index]
      : false;
  }

  updateActiveIndex(e, index) {
    this.props.updateActiveIndex(index);
  }

  deleteIfEmpty(index) {
    const entry = this.props.entries[index];
    if (entry.content.length === 0) {
      this.props.removeEntryAndFocus(index);
    }
  }

  uploadImages = selectedImages => {
    this.props.addImagesToEntries({
      images: selectedImages,
      index: this.props.activeContentCreator
    });
  };

  handleImageDelete = index => {
    Alert.alert(
      'Are you sure?',
      'Deleting this image will erase it from this chapter',
      [
        { text: 'Delete Image', onPress: () => this.deleteImage(index) },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  deleteImage = index => {
    let uri = this.props.entries[index].originalUri;

    this.props.addToDeletedUrls(uri);
    this.props.removeEntryAndFocus(index);
  };

  renderEntry(entry, index) {
    switch (entry.type) {
      case 'text':
        return this.renderAsTextInput(entry, index);
      case 'image':
        return this.renderAsImage(entry, index);
      default:
        return null;
    }
  }

  renderImageLoadingCover(imageHeight) {
    return (
      <View
        style={[
          styles.opacCover,
          styles.loadingOpacCover,
          { height: imageHeight, width: this.props.width }
        ]}
      >
        <MaterialIndicator size={40} color="#FF5423" />
      </View>
    );
  }

  renderOpacCover(index, imageHeight, image) {
    if (this.props.uploadIsImage && !image.uri) {
      return this.renderImageLoadingCover(imageHeight);
    }

    if (index !== this.props.activeIndex) return;

    return (
      <TouchableWithoutFeedback
        style={{ height: imageHeight }}
        onPress={e => this.updateActiveIndex(e, null)}
      >
        <View
          style={[
            styles.opacCover,
            { height: imageHeight, width: this.props.width }
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => this.handleImageDelete(index)}
          >
            <View>
              <FontAwesome name={'trash-o'} size={28} color={'white'} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={e => this.openImageCaptionForm(e, index)}
          >
            <View>
              <FontAwesome name={'quote-right'} color={'white'} size={28} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  getImageHeight(aspectRatio) {
    return aspectRatio * this.props.width;
  }

  getAllImageIds = () => {
    let entries = this.props.entries
      .filter(entry => entry.type === 'image')
      .map(entry => {
        return entry.id;
      });
    return entries;
  };

  getImagesToDelete() {
    const allImageIds = this.getAllImageIds();
    const { initialImageIds } = this.props;

    const diff = _.xor(initialImageIds, allImageIds);
    return diff;
  }

  returnLowResImageUri(entry) {
    const { uri, lowResUri, localUri } = entry;

    if (!uri) {
      return localUri;
    }

    return lowResUri ? lowResUri : uri;
  }

  renderAsImage(entry, index) {
    const imageHeight = this.getImageHeight(entry.aspectRatio);
    const uri = entry.uri ? entry.uri : entry.localUri;

    return (
      <React.Fragment>
        <View
          onLayout={e => this.handleLayout(e, index)}
          key={`image${index}`}
          style={[{ height: imageHeight }, styles.positionRelative]}
        >
          <TouchableWithoutFeedback
            style={styles.positionRelative}
            onPress={e => this.updateActiveIndex(e, index)}
          >
            <View>
              {this.renderOpacCover(index, imageHeight, entry)}
              <LazyImage
                style={{
                  width: this.props.width,
                  height: imageHeight,
                  position: 'relative'
                }}
                yPosition={this.getYPosition(index)}
                scrollPosition={this.state.scrollPosition}
                uri={uri}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {this.renderImageCaption(entry)}
      </React.Fragment>
    );
  }

  renderImageCaption(entry) {
    if (entry.caption.length === 0) return;

    return (
      <View style={styles.captionPadding}>
        <Text style={styles.textAlignCenter}>{entry.caption}</Text>
      </View>
    );
  }

  handleOnFocus(index) {
    const styles = this.props.entries[index].styles;
    this.props.updateKeyboardState(true);
    this.props.updateActiveIndex(index);
    this.props.updateFormatBar(styles);
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  };

  renderHeader() {
    const headerProps = Object.assign(
      {},
      {
        goBackCta: 'Cancel',
        handleGoBack: this.handleCancelButtonPress,
        centerCta: '',
        handleConfirm: this.handleDoneButtonPress,
        confirmCta: 'Save'
      }
    );
    return <Header key="header" {...headerProps} />;
  }

  renderAsTextInput(entry, index) {
    return (
      <TextInput
        multiline
        editable={!this.props.uploadIsImage}
        key={index}
        selectionColor={'#FF5423'}
        ref={`textInput${index}`}
        style={[styles.textInput, this.getInputStyling(entry)]}
        onChangeText={text => this.handleTextChange(text, index)}
        onBlur={() => this.deleteIfEmpty(index)}
        placeholder={'Enter Entry...'}
        value={entry.content}
        onFocus={() => this.handleOnFocus(index)}
        blurOnSubmit={false}
      />
    );
  }

  handleDoneButtonPress = () => {
    if (this.props.isUpdating || this.props.uploadIsImage) return;
    this.props.doneEditingAndPersist();
    this.navigateBack();
  };

  loseChangesAndUpdate = () => {
    const { id } = this.props.chapter.editorBlob;
    const payload = Object.assign({}, { id });
    this.props.loseChangesAndUpdate(payload);
    this.navigateBack();
  };

  editorIsSaved() {
    return (
      JSON.stringify(this.props.entries) ===
      JSON.stringify(this.props.initialEntries)
    );
  }

  handleCancelButtonPress = () => {
    if (this.editorIsSaved()) {
      this.loseChangesAndUpdate();
    } else {
      Alert.alert(
        'Are you sure?',
        'You will lose all your blog changes',
        [
          { text: 'Lose blog changes', onPress: this.loseChangesAndUpdate },
          { text: 'Cancel', style: 'cancel' }
        ],
        { cancelable: true }
      );
    }
  };

  openImageCaptionForm(e, index) {
    const entryCaption = this.props.entries[index].caption;
    this.props.updateActiveImageCaption(entryCaption);
    this.props.navigation.navigate('ImageCaptionForm', { index: index });
  }

  openManageContent = () => {
    this.props.prepManageContent();
    this.props.navigation.navigate('ManageContent');
  };

  getToolbarPositioning() {
    if (this.props.showEditorToolbar) {
      return {
        width: this.props.width,
        position: 'absolute',
        top: this.state.containerHeight
      };
    } else {
      return { width: this.props.width };
    }
  }

  renderEditorToolbar() {
    return; // letrs test and see how neccessary this actually is

    return (
      <View style={this.getToolbarPositioning()}>
        <EditorToolbar openManageContent={this.openManageContent} />
      </View>
    );
  }

  renderCreateCta(index) {
    return (
      <ContentCreator
        index={index}
        key={`contentCreator${index}`}
        navigation={this.props.navigation}
      />
    );
  }

  renderEditor() {
    if (!this.props.chapter.id) return;

    return this.props.entries.map((entry, index) => {
      return (
        <View>
          {this.renderCreateCta(index)}
          {this.renderEntry(entry, index)}
        </View>
      );
    });
  }

  getContainerSize() {
    if (this.props.showEditorToolbar) {
      return { height: this.props.height - 40 };
    } else {
      return { height: this.props.height };
    }
  }

  renderImagePickerContainer() {
    return (
      <ImagePickerContainer
        imageCallback={this.uploadImages}
        selectSingleItem={false}
      />
    );
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={([styles.container], this.getContainerSize())}>
          {this.renderHeader()}
          <InputScrollView
            useAnimatedScrollView={true}
            bounces={true}
            topOffset={50}
            style={styles.positionRelative}
            keyboardOffset={90}
            onScroll={event => this.handleScroll(event)}
            scrollEventThrottle={100}
            multilineInputStyle={{ lineHeight: 30 }}
          >
            {this.renderEditor()}
            {this.renderCreateCta(this.props.entries.length)}
            <View style={{ marginBottom: 200 }} />
          </InputScrollView>
          {this.renderEditorToolbar()}
        </View>
        {this.renderImagePickerContainer()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 0,
    position: 'relative'
  },
  titleAndDescriptionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10
  },
  title: {
    fontSize: 28,
    fontFamily: 'playfair',
    color: '#323941',
    backgroundColor: '#f8f8f8'
  },
  description: {
    fontSize: 18,
    color: '#c3c3c3',
    fontFamily: 'open-sans-semi'
  },
  statsContainer: {
    padding: 20,
    paddingTop: 0
  },
  headerText: {
    fontFamily: 'playfair',
    fontSize: 22
  },
  quoteText: {
    fontStyle: 'italic',
    borderLeftWidth: 5,
    paddingTop: 10,
    paddingBottom: 10
  },
  opacCover: {
    padding: 20,
    position: 'absolute',
    zIndex: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  positionRelative: {
    position: 'relative',
    backgroundColor: 'white'
  },
  loadingOpacCover: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  captionPadding: {
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  textInput: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 20,
    fontFamily: 'open-sans-regular',
    lineHeight: 24,
    minHeight: 30
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChapterEditor);
