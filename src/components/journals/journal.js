import React, { Component } from "react"
import { journalQuery, journalChaptersQuery, journalGearItems } from "graphql/queries/journals"
import { StyleSheet, View, Text, ScrollView, Image, ImageBackground, Dimensions } from "react-native"
import ChapterList from "components/chapters/chapter_list"
import { gql } from "agent"
import { SINGLE_JOURNAL_LOADED } from "actions/action_types"
import { connect } from "react-redux"
import { SimpleLineIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  journal: state.journal.journal,
  user: state.journal.journal.user,
  chapters: state.journal.journal.chapters,
  loaded: state.journal.loaded
})

const mapDispatchToProps = dispatch => ({
  onLoad: payload => {
    dispatch({ type: SINGLE_JOURNAL_LOADED, payload })
  }
})

const bannerImageWidth = Dimensions.get("window").width
const bannerImageHeight = Math.round(bannerImageWidth * (150 / 300))

class Journal extends Component {
  constructor(props) {
    super(props)
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

  renderBannerAndUserImages(journal, user) {
    return (
      <View style={{ position: "relative", height: bannerImageHeight + 30, backgroundColor: "white" }}>
        <Image style={styles.bannerImage} source={{ uri: journal.cardImageUrl }} />
        <Image style={styles.userImage} source={{ uri: user.avatarImageUrl }} />
      </View>
    )
  }

  renderJournalMetadata(journal) {
    return (
      <View style={styles.metaDataContainer}>
        <View style={styles.titleSubTitleContainer}>
          <Text style={styles.journalHeader}>{journal.title}</Text>
          <View style={{ display: "flex", flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
            <SimpleLineIcons name="location-pin" style={{ marginRight: 10 }} size={22} color="black" />
            <Text style={styles.journalDescription}>{journal.description}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.stats}>{`${journal.status} \u2022 ${journal.distance} miles`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderHeader() {
    const { journal, user } = this.props
    return (
      <View style={{ marginBottom: 10 }}>
        {this.renderBannerAndUserImages(journal, user)}
        {this.renderJournalMetadata(journal)}
      </View>
    )
  }

  renderChapters() {
    return <ChapterList chapters={this.props.chapters} />
  }

  render() {
    if (!this.props.loaded) return null
    return (
      <ScrollView style={{ backgroundColor: "white" }}>
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
    paddingBottom: 20,
    backgroundColor: "white"
  },
  journalHeader: {
    fontSize: 20,
    fontFamily: "playfair"
  },
  journalDescription: {
    fontSize: 14,
    fontFamily: "open-sans-regular"
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 10,
    borderWidth: 4,
    borderColor: "white",
    position: "absolute",
    bottom: 0,
    left: 30,
    zIndex: 100
  },
  userName: {
    fontSize: 18
  },
  wideFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  stats: {
    fontFamily: "overpass"
  },
  activeTabContainer: {
    padding: 16,
    backgroundColor: "rgb(245,245,245)"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Journal)
