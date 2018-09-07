import React, { Component } from "react"
import { journalQuery, journalGearItems } from "graphql/queries/journals"
import { chapterQuery } from "graphql/queries/chapters"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableHighlight,
  Dimensions
} from "react-native"
import ChapterList from "components/chapters/ChapterList"
import { gql } from "agent"
import { SINGLE_JOURNAL_LOADED } from "actions/action_types"
import { loadChapter } from "actions/chapter"
import { connect } from "react-redux"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  journal: state.journal.journal,
  user: state.journal.journal.user,
  chapters: state.journal.journal.chapters,
  loaded: state.journal.loaded
})

const mapDispatchToProps = dispatch => ({
  onLoad: payload => {
    dispatch({ type: SINGLE_JOURNAL_LOADED, payload })
  },

  loadChapter: payload => dispatch(loadChapter(payload))
})

const bannerImageWidth = Dimensions.get("window").width
const bannerImageHeight = Math.round(bannerImageWidth * 0.65)

class Journal extends Component {
  constructor(props) {
    super(props)
    this.navigateBack = this.navigateBack.bind(this)
    this.requestForChapter = this.requestForChapter.bind(this)
  }

  componentWillMount() {
    this.requestForJournal()
  }

  requestForJournal() {
    let journalId = this.props.navigation.getParam("journalId", "NO-ID")
    gql(journalQuery, { id: journalId }).then(res => {
      this.props.onLoad(res.journal)
    })
  }

  requestForChapter(chapterId) {
    gql(chapterQuery, { id: chapterId }).then(res => {
      this.props.loadChapter(res.chapter)
      this.props.navigation.navigate("Chapter")
    })
  }

  navigateBack() {
    this.props.navigation.goBack()
  }

  renderNavHeader(user) {
    return (
      <View
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={{
            padding: 20,
            height: 50,
            width: 50,
            marginLeft: 10,
            borderRadius: "50%",
            position: "relative"
          }}
          onPress={this.navigateBack}>
          <Ionicons style={{ position: "absolute", top: 11, left: 18 }} name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
        <Image style={styles.userImage} source={{ uri: user.avatarImageUrl }} />
      </View>
    )
  }

  renderBannerAndUserImages(journal, user) {
    return (
      <View style={{ position: "relative", height: bannerImageHeight + 10, backgroundColor: "white" }}>
        <ImageBackground style={styles.bannerImage} source={{ uri: journal.cardBannerImageUrl }}>
          <View
            style={{
              width: bannerImageWidth,
              height: bannerImageHeight,
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}>
            {this.renderNavHeader(user)}
            {this.renderJournalMetadata(journal)}
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderJournalMetadata(journal) {
    return (
      <View style={styles.metaDataContainer}>
        <View style={styles.titleSubTitleContainer}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <SimpleLineIcons name="location-pin" style={{ marginRight: 5 }} size={14} color="white" />
            <Text style={styles.journalDescription}>{journal.description}</Text>
          </View>
          <Text style={styles.journalHeader}>{journal.title}</Text>
        </View>
        <View>
          <Text style={styles.stats}>{`${journal.status} \u2022 ${journal.distance} miles`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderHeader() {
    const { journal, user } = this.props
    return <View>{this.renderBannerAndUserImages(journal, user)}</View>
  }

  renderChapters() {
    return <ChapterList chapters={this.props.chapters} handleSelectChapter={this.requestForChapter} />
  }

  render() {
    if (!this.props.loaded) return null
    return (
      <ScrollView bounces={"none"} style={{ backgroundColor: "white" }}>
        {this.renderHeader()}
        {this.renderChapters()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  bannerImage: {
    width: bannerImageWidth,
    height: bannerImageHeight
  },
  metaDataContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 10,
    marginTop: "auto"
  },
  journalHeader: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "white"
  },
  journalDescription: {
    fontSize: 14,
    fontFamily: "open-sans-regular",
    color: "white"
  },
  userInfo: {
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    // marginTop: 20,
    // marginBottom: 20
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
    borderWidth: 2,
    borderColor: "white"
  },
  wideFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  stats: {
    fontFamily: "open-sans-regular",
    color: "white"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Journal)
