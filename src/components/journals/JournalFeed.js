import React, { Component } from "react"
import { StyleSheet, ScrollView, SafeAreaView, Dimensions, View, Text, FlatList } from "react-native"
import { connect } from "react-redux"
import { get } from "../../agent"
import { deleteS3Objects } from "../../utils/image_uploader"
import { loadJournalFeed, resetJournalShow, toggleRefreshAndRefresh } from "../../actions/journals"
import JournalCard from "./JournalCard"
import LoadingScreen from "../shared/LoadingScreen"
import RetryRequestScreen from "../shared/RetryRequestScreen"

const mapDispatchToProps = dispatch => ({
  loadJournalFeed: () => dispatch(loadJournalFeed()),
  resetJournalShow: () => dispatch(resetJournalShow()),
  toggleRefreshAndRefresh: payload => dispatch(toggleRefreshAndRefresh(payload))
})

const mapStateToProps = state => ({
  journals: state.journalFeed.allJournals,
  refreshing: state.journalFeed.refreshing,
  currentUser: state.common.currentUser,
  isLoading: state.common.isLoading,
  width: state.common.width,
  height: state.common.height
})

class JournalFeed extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.loadJournalFeed()
  }

  loadJournalFeed = () => {
    this.props.loadJournalFeed()
  }

  handlePress = journalId => {
    this.props.resetJournalShow()
    this.props.navigation.navigate("Journal", { journalId })
  }

  handleRefresh = () => {
    this.props.toggleRefreshAndRefresh()
  }

  renderJournal(journal, index) {
    const styles = this.props.journals.length - 1 === index ? { marginBottom: 200 } : {}
    return (
      <View style={styles}>
        <JournalCard {...journal} width={this.props.width} height={this.props.height} handlePress={this.handlePress} />
      </View>
    )
  }

  renderErrorScreen = () => {
    return (
      <View style={{ marginTop: this.props.height / 2.5 }}>
        <RetryRequestScreen reload={this.loadJournalFeed} />
      </View>
    )
  }

  renderJournals() {
    return (
      <FlatList
        ListEmptyComponent={this.renderErrorScreen()}
        style={{ backgroundColor: "white", minHeight: this.props.height }}
        data={this.props.journals}
        refreshing={this.props.refreshing}
        onRefresh={this.handleRefresh}
        renderItem={({ item, index }) => this.renderJournal(item, index)}
        keyExtractor={item => item.id}
      />
    )
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />
    }

    return <SafeAreaView style={{ backgroundColor: "white" }}>{this.renderJournals()}</SafeAreaView>
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 50
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalFeed)
