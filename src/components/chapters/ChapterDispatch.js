import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import {
  resetChapter,
  editChapterPublished,
  deleteChapter,
  uploadBannerPhoto
} from "../../actions/chapter";
import { populateEntries } from "../../actions/editor";
import {
  updateChapterForm,
  toggleChapterModal
} from "../../actions/chapter_form";
import { toggleCameraRollModal } from "../../actions/camera_roll";
import ChapterEditor from "./ChapterEditor";
import ChapterShow from "./ChapterShow";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingScreen from "../shared/LoadingScreen";
import { JournalChildHeader } from "../shared/JournalChildHeader";
import { sendEmails } from "../../actions/chapter";
import ImagePickerContainer from "../shared/ImagePickerContainer";

const mapStateToProps = state => ({
  journal: state.chapter.chapter.journal,
  chapter: state.chapter.chapter,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser,
  width: state.common.width
});

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  sendEmails: payload => dispatch(sendEmails(payload)),
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  editChapterPublished: (chapter, published) =>
    dispatch(editChapterPublished(chapter, published, dispatch)),
  toggleChapterModal: payload => dispatch(toggleChapterModal(payload)),
  uploadBannerPhoto: payload => dispatch(uploadBannerPhoto(payload)),
  resetChapter: () => dispatch(resetChapter()),
  deleteChapter: (chapterId, callback) =>
    dispatch(deleteChapter(chapterId, callback, dispatch))
});

class ChapterDispatch extends Component {
  constructor(props) {
    super(props);
  }

  populateEditorAndSwitch = content => {
    let entries = content;
    if (entries === null) {
      entries = [];
    }
    if (!Array.isArray(content)) {
      entries = Array.from(entries);
    }

    this.props.populateEntries(entries);
  };

  navigateBack = () => {
    this.props.resetChapter();
    this.props.navigation.goBack();
  };

  navigateToEditor = () => {
    const { content } = this.props.chapter.editorBlob;
    this.populateEditorAndSwitch(content);
    this.props.navigation.navigate("ChapterEditor");
  };

  openDeleteAlert = () => {
    Alert.alert(
      "Are you sure?",
      "Deleting this chapter will erase all images and content",
      [
        { text: "Delete Chapter", onPress: this.handleDelete },
        { text: "Cancel", style: "cancel" }
      ],
      { cancelable: true }
    );
  };

  updatePublishedStatus = async () => {
    const {
      chapter: { id, published }
    } = this.props;

    this.props.editChapterPublished(id, !published);
  };

  handleDelete = async () => {
    this.props.deleteChapter(this.props.chapter.id, this.navigateBack);
  };

  triggerImagePicker = () => {
    this.props.toggleCameraRollModal(true);
  };

  uploadBannerPhoto = img => {
    this.props.uploadBannerPhoto(img);
  };

  getOptions() {
    let published = this.props.chapter.published ? "Unpublish" : "Publish";
    let emailSent = this.props.chapter.emailSent ? "Email Sent" : "Send Email";

    let optionsProps = [
      {
        title: "Edit Metadata",
        callback: this.navigateToChapterForm
      },
      {
        title: "Upload Banner Image",
        callback: this.triggerImagePicker
      },
      {
        title: "Delete Chapter",
        callback: this.openDeleteAlert
      },
      {
        title: published,
        callback: this.updatePublishedStatus
      }
    ];

    if (this.props.chapter.published) {
      const emailOption = {
        title: emailSent,
        callback: this.sendEmails
      };
      optionsProps.push(emailOption);
    }

    return optionsProps;
  }

  isCurrentUser() {
    return this.props.user.id == this.props.currentUser.id;
  }

  sendEmails = async () => {
    if (this.props.chapter.emailSent) return;

    this.props.sendEmails(this.props.chapter.id);
  };

  navigateToChapterForm = () => {
    let {
      id,
      title,
      distance,
      description,
      journal,
      imageUrl,
      date
    } = this.props.chapter;
    let distanceAmount =
      distance.distanceType === "kilometer"
        ? distance.kilometerAmount
        : distance.mileAmount;

    let obj = Object.assign(
      {},
      {
        id: id,
        title: title,
        distance: distanceAmount,
        description: description,
        readableDistanceType: distance.readableDistanceType,
        date: new Date(date),
        journalId: journal.id
      }
    );

    this.props.updateChapterForm(obj);
    this.props.toggleChapterModal(true);
  };

  getDropdownProps = () => {
    const isCurrentUser = this.isCurrentUser();
    const options = this.getOptions(isCurrentUser);

    return Object.assign(
      {},
      {
        isCurrentUser,
        options
      }
    );
  };

  renderHeader = () => {
    const dropdownProps = this.getDropdownProps();

    return (
      <JournalChildHeader
        width={this.props.width}
        title={this.props.journal.title}
        navigateBack={this.navigateBack}
        dropdownProps={dropdownProps}
      />
    );
  };

  renderEditorFloatingButton() {
    if (this.props.currentUser.id != this.props.user.id) return;

    return (
      <TouchableWithoutFeedback onPress={this.navigateToEditor}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 1, height: 1 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={styles.editorFloatingButton}
        >
          <MaterialIcons name="edit" size={32} color="white" />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    if (!this.props.chapter.id) {
      return <LoadingScreen />;
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.chapterDispatchContainer}>
          {this.renderHeader()}
          <ChapterShow navigation={this.props.navigation} />
          {this.renderEditorFloatingButton()}
          <ImagePickerContainer
            imageCallback={this.uploadBannerPhoto}
            selectSingleItem
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  chapterDispatchContainer: {
    backgroundColor: "white",
    position: "relative",
    height: "100%"
  },
  safeContainer: {
    backgroundColor: "white",
    flex: 1
  },
  chapterNavigationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8"
  },
  journalAndUserContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  journalImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5
  },
  editorFloatingButton: {
    position: "absolute",
    backgroundColor: "#FF5423",
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 30,
    right: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  journalTitle: {
    fontFamily: "open-sans-semi",
    fontSize: 16
  },
  backIconContainer: {
    display: "flex",
    flexDirection: "row"
  },
  backButton: {
    padding: 20,
    height: 50,
    width: 50,
    marginLeft: 2,
    borderRadius: 25,
    position: "relative"
  },
  backIcon: {
    position: "absolute",
    top: 11,
    left: 18
  },
  userCtaPosition: {
    paddingRight: 20
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterDispatch);
