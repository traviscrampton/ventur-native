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

const mapStateToProps = state => ({
	journals: state.journals
})

class JournalFeed extends Component {
	componentWillMount() {
		request
			.post("http://localhost:3000/graphql")
			.use(ql(allJournalsQuery))
			.end((err, res) => {
				let { allJournals } = res.body.data
				this.props.onLoad(allJournals)
			})
	}

	render() {
		console.log(this.props.journals)
		// return this.props.journals.map((journal, index) => {
		// 	return <Text>{journal.title}</Text>	
		// })
		
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(JournalFeed)
