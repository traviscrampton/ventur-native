import React, { Component } from "react"
import { StyleSheet, FlatList, View, Dimensions } from "react-native"
import { connect } from "react-redux"
import { myJournalsQuery } from "graphql/queries/journals"
import { gql } from "agent"
import { MY_JOURNALS_LOADED, RESET_JOURNAL_TAB } from "actions/action_types"
import JournalMini from "components/journals/JournalMini"

const mapDispatchToProps = dispatch => ({
  onLoad: payload => {
    dispatch({ type: MY_JOURNALS_LOADED, payload })
  },
  resetJournal: () => {
    dispatch({ type: RESET_JOURNAL_TAB })
  }
})

const mapStateToProps = state => ({
  journals: state.myJournals.journals,
  journal: state.journal.journal
})

class MyJournals extends Component {
  constructor(props) {
    super(props)

    this.handlePress = this.handlePress.bind(this)
  }

  componentWillMount() {
    // expect this will read from local storage in #daFuture
    this.getJournals()
  }

  getJournals() {
    gql(myJournalsQuery).then(res => {
      this.props.onLoad(res.myJournals)
    })
  }

  handlePress(journalId) {
    this.props.resetJournal()
    this.props.navigation.navigate("Journal", { journalId })
  }

  render() {
    const pad = Dimensions.get("window").width * 0.035
    return (
      <View>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{
            display: "flex",
            height: "100%",
            backgroundColor: "white",
            paddingTop: 20,
            paddingLeft: pad,
            paddingRight: pad,
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}
          data={this.props.journals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <JournalMini {...item} handlePress={this.handlePress} />}
        />
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyJournals)
