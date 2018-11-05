import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback
} from "react-native"
import ChapterList from "components/chapters/ChapterList"
import { Feather } from "@expo/vector-icons"
import { populateUserPage, populateOfflineChapters } from "actions/user"
import JournalMini from "components/journals/JournalMini"
import { userQuery } from "graphql/queries/users"
import { gql } from "agent"
import { loadChapter } from "actions/chapter"
import { connect } from "react-redux"
import { Ionicons, Entypo } from "@expo/vector-icons"
import { RESET_JOURNAL_TAB } from "actions/action_types"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  user: state.user.user,
  offlineChapters: state.user.offlineChapters
})

const mapDispatchToProps = dispatch => ({
  populateUserPage: payload => dispatch(populateUserPage(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  resetJournal: () => {
    dispatch({ type: RESET_JOURNAL_TAB })
  }
})

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: "offlineChapters"
    }
  }

  componentWillMount() {
    this.getProfilePageData()
    this.getOfflineChapters()
  }

  getProfilePageData() {
    gql(userQuery, { id: this.props.currentUser.id }).then(res => {
      this.props.populateUserPage(res.user)
    })
  }

  async getOfflineChapters() {
    let offlineChapters = await AsyncStorage.getItem("chapters")
    offlineChapters = JSON.parse(offlineChapters)
    this.props.populateOfflineChapters(offlineChapters)
  }

  switchActiveTab = newTab => {
    this.setState({
      activeTab: newTab
    })
  }

  isActiveTab(tab) {
    if (this.state.activeTab === tab) {
      return "#FF8C34"
    } else {
      return "lightgray"
    }
  }

  handleJournalPress = journalId => {
    this.props.resetJournal()
    this.props.navigation.navigate("Journal", { journalId })
  }

  selectChapter = chapterId => {
    let chapter
    chapter = this.props.offlineChapters.find(chapter => {
      return chapter.id === chapterId
    })
    /// make sure to have the chapter make sens when you update it
    this.props.loadChapter(chapter)
    this.props.navigation.navigate("Chapter")
  }

  renderHeader() {
    return (
      <View
        style={{
          height: 60,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          borderBottomWidth: 1,
          borderBottomColor: "lightgray"
        }}>
        <Text>{this.props.user.fullName}</Text>
      </View>
    )
  }

  renderUserName() {
    return (
      <View>
        <Text>{this.props.user.fullName}</Text>
      </View>
    )
  }

  renderEditProfile() {
    return (
      <TouchableWithoutFeedback onPress={() => console.log("HEY WE OUT HERE PRESSIN!")}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 4,
            borderColor: "gray",
            paddingTop: 2.5,
            paddingBottom: 2.5,
            paddingLeft: 10,
            paddingRight: 10
          }}>
          <Text>Edit Profile</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderOfflineChapterStatistics() {
    return (
      <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{this.props.offlineChapters.length}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, color: "gray" }}>Offline Chapters</Text>
        </View>
      </View>
    )
  }

  renderJournalStatistics() {
    return (
      <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{this.props.user.journals.length}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, color: "gray" }}>Trips</Text>
        </View>
      </View>
    )
  }

  renderStatistics() {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "66%"
        }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {this.renderJournalStatistics()}
          {this.renderOfflineChapterStatistics()}
        </View>
        <View style={{ marginTop: 10 }}>{this.renderEditProfile()}</View>
      </View>
    )
  }

  renderProfilePhoto() {
    return (
      <View style={{ width: "33%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Image
          style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 5, borderWidth: 1, borderColor: "gray" }}
          source={{ uri: this.props.user.avatarImageUrl }}
        />
        <View>{this.renderUserName()}</View>
      </View>
    )
  }

  renderProfilePhotoAndMetadata() {
    return (
      <View style={{ marginBottom: 20, padding: 15, backgroundColor: "white" }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {this.renderProfilePhoto()}
          {this.renderStatistics()}
        </View>
      </View>
    )
  }

  renderProfileTabBar() {
    return (
      <View
        style={{
          marginBottom: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
          height: 45
        }}>
        <TouchableWithoutFeedback onPress={() => this.switchActiveTab("journals")}>
          <View style={{ width: Dimensions.get("window").width / 2 }}>
            <Ionicons
              style={{ textAlign: "center" }}
              name="ios-bicycle"
              color={this.isActiveTab("journals")}
              size={25}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.switchActiveTab("offlineChapters")}>
          <View style={{ width: Dimensions.get("window").width / 2 }}>
            <Entypo
              style={{ textAlign: "center" }}
              name="tools"
              color={this.isActiveTab("offlineChapters")}
              size={22}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderOfflineChapter(chapter, index) {
    return (
      <View>
        <Text>{chapter.title}</Text>
      </View>
    )
  }

  renderOfflineChapters() {
    return <ChapterList chapters={this.props.offlineChapters} handleSelectChapter={this.selectChapter} />
  }

  renderProfileJournals() {
    const pad = Dimensions.get("window").width * 0.035

    return (
      <View style={{ position: "relative", backgroundColor: "white" }}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{
            display: "flex",
            backgroundColor: "white",
            paddingLeft: pad,
            paddingRight: pad,
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}
          data={this.props.user.journals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <JournalMini {...item} handlePress={this.handleJournalPress} />}
        />
      </View>
    )
  }

  navigateToJournalForm = () => {
    this.props.navigation.navigate("JournalFormTitle")
  }

  renderCreateJournalCta() {
    return (
      <TouchableWithoutFeedback onPress={this.navigateToJournalForm}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 1, height: 1 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            position: "absolute",
            backgroundColor: "#FF8C34",
            width: 60,
            height: 60,
            borderRadius: 30,
            bottom: 80,
            right: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Feather name="plus" size={32} color="white" />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderRelatedProfileContent() {
    switch (this.state.activeTab) {
      case "journals":
        return this.renderProfileJournals()
      case "offlineChapters":
        return this.renderOfflineChapters()
      default:
        console.log("WHAT IS THIS", this.state.activeTab)
    }
  }

  renderFloatingCreateButton() {
    switch (this.state.activeTab) {
      case "journals":
        return this.renderCreateJournalCta()
      case "offlineChapters":
        return this.createOfflineChapters()
    }
  }

  createOfflineChapters() {
    return (
      <TouchableWithoutFeedback onPress={() => console.log("we out here")}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 1, height: 1 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            position: "absolute",
            backgroundColor: "#067BC2",
            width: 60,
            height: 60,
            borderRadius: 30,
            bottom: 80,
            right: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Feather name="plus" size={32} color="white" />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
      <View style={{ backgroundColor: "white", paddingBottom: 60 }}>
        {this.renderHeader()}
        <ScrollView style={{ height: "100%" }}>
          {this.renderProfilePhotoAndMetadata()}
          {this.renderProfileTabBar()}
          {this.renderRelatedProfileContent()}
        </ScrollView>
        {this.renderFloatingCreateButton()}
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
