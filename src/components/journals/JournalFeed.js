import React, { Component } from "react"
import { StyleSheet, ScrollView, Dimensions, View } from "react-native"
import { connect } from "react-redux"
import { get } from "agent"
import { loadJournalFeed, resetJournalShow } from "actions/journals"
import JournalCard from "components/journals/JournalCard"
import LoadingScreen from "components/shared/LoadingScreen"

const mapDispatchToProps = dispatch => ({
  loadJournalFeed: () => dispatch(loadJournalFeed()),
  resetJournalShow: () => dispatch(resetJournalShow())
})

const mapStateToProps = state => ({
  journals: state.journalFeed.allJournals,
  currentUser: state.common.currentUser,
  isLoading: state.common.isLoading
})

class JournalFeed extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    Expo.ScreenOrientation.allow("PORTRAIT_UP")
    this.props.loadJournalFeed()
  }

  handlePress = journalId => {
    this.props.resetJournalShow()
    this.props.navigation.navigate("Journal", { journalId })
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />
    }

    return (
      <ScrollView style={{ backgroundColor: "white", paddingBottom: 20 }}>
        {this.props.journals.map((journal, index) => {
          return (
            <JournalCard
              {...journal}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height}
              handlePress={this.handlePress}
            />
          )
        })}
        <View style={{marginBottom: 60}}/>
      </ScrollView>
    )
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
