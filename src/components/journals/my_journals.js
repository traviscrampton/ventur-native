import React, { Component } from "react"
import { StyleSheet, FlatList, View, Text, List, ScrollView } from "react-native"
import { connect } from "react-redux"
import { myJournalsQuery } from "graphql/queries/journals"
import { gql } from "agent"
import { MY_JOURNALS_LOADED } from "actions/action_types"

const mapDispatchToProps = dispatch => ({
  onLoad: payload => {
    dispatch({ type: MY_JOURNALS_LOADED, payload })
  }
})

const mapStateToProps = state => ({})

class MyJournals extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // expect this will read from local storage in #daFuture
    this.getJournals()
  }

  getJournals() {
    gql(myJournalsQuery).then(res => {
      console.log("MY JOURNALS", res.myJournals)
      this.props.onLoad(res.myJournals)
    })
  }

  render() {
    console.log("HELLO SWEET PRINCe")
    return (
      <View>
        <Text>Hello sweet prince</Text>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyJournals)
