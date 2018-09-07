import React, { Component } from "react"
import { StyleSheet, FlatList, ScrollView } from "react-native"
import { connect } from "react-redux"
import { gql } from "agent"
import { JOURNAL_FEED_LOADED, RESET_JOURNAL_TAB } from "actions/action_types"
import { allJournalsQuery } from "graphql/queries/journals"
import JournalCard from "components/journals/JournalCard"

const mapDispatchToProps = dispatch => ({
  onLoad: payload => {
    dispatch({ type: JOURNAL_FEED_LOADED, payload })
  },

  resetJournal: () => {
    dispatch({ type: RESET_JOURNAL_TAB })
  }
})

const mapStateToProps = state => ({
  journals: state.journalFeed.allJournals,
  currentUser: state.common.currentUser
})

class JournalFeed extends Component {
  constructor(props) {
    super(props)

    this.handlePress = this.handlePress.bind(this)
  }

  componentWillMount() {
    this.getJournalFeed()
  }

  getJournalFeed() {
    gql(allJournalsQuery).then(res => {
      this.props.onLoad(res.allJournals)
    })
  }

  handlePress(journalId) {
    this.props.resetJournal()
    this.props.navigation.navigate("Journal", { journalId })
  }

  render() {
    return (
      <ScrollView>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={styles.container}
          data={this.props.journals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <JournalCard {...item} handlePress={this.handlePress} />}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: 50
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalFeed)
