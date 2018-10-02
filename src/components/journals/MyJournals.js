import React, { Component } from "react"
import { StyleSheet, FlatList, View, Dimensions, Text, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { Feather } from "@expo/vector-icons"
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
            bottom: 20,
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
      <View style={{ position: "relative", height: "100%", backgroundColor: "white" }}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={styles.flatListContainer}
          data={this.props.journals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <JournalMini {...item} handlePress={this.handlePress} />}
        />
        {this.renderCreateJournalCta()}
      </View>
    )
  }
}

const pad = Dimensions.get("window").width * 0.035
const styles = StyleSheet.create({
  flatListContainer: {
    display: "flex",
    backgroundColor: "white",
    paddingTop: 20,
    paddingLeft: pad,
    paddingRight: pad,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyJournals)
