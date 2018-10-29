import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback
} from "react-native"
import { populateUserPage } from "actions/user"
import JournalMini from "components/journals/JournalMini"
import { userQuery } from "graphql/queries/users"
import { gql } from "agent"
import { connect } from "react-redux"
import { Ionicons, Entypo } from "@expo/vector-icons"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  populateUserPage: payload => dispatch(populateUserPage(payload))
})

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: "journals"
    }
  }

  componentWillMount() {
    this.getProfilePageData()
  }

  getProfilePageData() {
    gql(userQuery, { id: this.props.currentUser.id }).then(res => {
      this.props.populateUserPage(res.user)
    })
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

  renderHeader() {
    return (
      <View
        style={{
          height: 60,
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

  renderGearItemsStatistics() {
    return (
      <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{15}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, color: "gray" }}>Gear</Text>
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
          {this.renderGearItemsStatistics()}
        </View>
        <View style={{ marginTop: 10 }}>{this.renderEditProfile()}</View>
      </View>
    )
  }

  renderProfilePhoto() {
    return (
      <View style={{ width: "33%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Image
          style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 5 }}
          source={{ uri: this.props.user.avatarImageUrl }}
        />
        <View>{this.renderUserName()}</View>
      </View>
    )
  }

  renderProfilePhotoAndMetadata() {
    return (
      <View style={{ marginBottom: 20, padding: 15 }}>
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
        <TouchableWithoutFeedback onPress={() => this.switchActiveTab("gear")}>
          <View style={{ width: Dimensions.get("window").width / 2 }}>
            <Entypo style={{ textAlign: "center" }} name="tools" color={this.isActiveTab("gear")} size={22} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderProfileGear() {
    return <Text>yall need gear to even do this haha what?!</Text>
  }

  renderProfileJournals() {
    const pad = Dimensions.get("window").width * 0.035
    console.log(this.props.user.journals)
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

  renderRelatedProfileContent() {
    switch (this.state.activeTab) {
      case "journals":
        return this.renderProfileJournals()
      case "gear":
        return this.renderProfileGear()
      default:
        console.log("WHAT IS THIS", this.state.activeTab)
    }
  }

  render() {
    return (
      <View>
        {this.renderHeader()}
        <ScrollView>
          {this.renderProfilePhotoAndMetadata()}
          {this.renderProfileTabBar()}
          {this.renderRelatedProfileContent()}
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
