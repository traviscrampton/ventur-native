import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import { StyleSheet, View, Text, Image, TouchableHighlight } from "react-native"
import { connect } from "react-redux"
import ChapterEditor from "components/chapters/ChapterEditor"
import ChapterShow from "components/chapters/ChapterShow"
import { Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  journal: state.chapter.chapter.journal,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  resetChapter: dispatch(resetChapter)
})

class ChapterDispatch extends Component {
  constructor(props) {
    super(props)
    this.navigateBack = this.navigateBack.bind(this)
  }

  navigateBack() {
    this.props.navigation.goBack()
  }

  renderChapterNavigation() {
    return (
      <View style={styles.chapterNavigationContainer}>
        {this.renderBackIcon()}
        {this.renderEditButton()}
      </View>
    )
  }

  renderJournalAndUser() {
    return (
      <View style={styles.journalAndUserContainer}>
        <Image style={styles.journalImage} source={{ uri: this.props.journal.miniBannerImageUrl }} />
        <View>
          <Text style={styles.journalTitle}>{this.props.journal.title}</Text>
          <Text>{this.props.user.fullName}</Text>
        </View>
      </View>
    )
  }

  renderBackIcon() {
    return (
      <View style={styles.backIconContainer}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={styles.backButton}
          onPress={this.navigateBack}>
          <Ionicons style={styles.backIcon} name="ios-arrow-back" size={28} color="black" />
        </TouchableHighlight>
        {this.renderJournalAndUser()}
      </View>
    )
  }

  renderEditButton() {
    return <View style={styles.userCtaPosition}>{this.getUserCta()}</View>
  }

  getUserCta() {
    if (this.props.currentUser.id === this.props.user.id) {
      return <Text>Saving...</Text>
    }
  }

  dispatchChapter() {
    return <ChapterEditor navigation={this.props.navigation} />
  }

  render() {
    return (
      <View style={styles.chapterDispatchContainer}>
        {this.renderChapterNavigation()}
        {this.dispatchChapter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chapterDispatchContainer: {
    backgroundColor: "white"
  },
  chapterNavigationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 10,
    height: 80
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
  journalTitle: {
    fontFamily: "open-sans-semi"
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
    borderRadius: "50%",
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterDispatch)
