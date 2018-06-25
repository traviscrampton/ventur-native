import React, { Component } from "react"
import { Stylesheet, FlatList, View, Text } from "react-native"

import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import request from "superagent"
import ql from "superagent-graphql"
import { JOURNAL_FEED_LOADED } from "actions/action_types"
import { allJournalsQuery } from "graphql/queries/journals"

const Promise = global.Promise

const mapDispatchToProps = dispatch => ({
	onLoad: payload => {
		dispatch({ type: JOURNAL_FEED_LOADED, payload })
	}
})

class JournalFeed extends Component {
	componentWillMount() {
		request
			.post("http://localhost:3000/graphql")
			.use(ql(allJournalsQuery))
			.end((err, res) => {
				this.props.onLoad(res.body.data.allJournals)
			})
	}

	render() {
		return <Text>Hello World</Text>
	}
}

export default JournalFeed
