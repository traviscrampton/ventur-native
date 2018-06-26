import React, { Component } from "react"
import { Stylesheet, FlatList, View, Text, List } from "react-native"
import { connect } from "react-redux"
import request from "superagent"
import ql from "superagent-graphql"
import { JOURNAL_FEED_LOADED } from "actions/action_types"
import { allJournalsQuery } from "graphql/queries/journals"
import JournalCard from "components/journals/journal_card"

const Promise = global.Promise

const mapDispatchToProps = dispatch => ({
	onLoad: payload => {
		dispatch({ type: JOURNAL_FEED_LOADED, payload })
	}
})

const mapStateToProps = state => ({
	journals: state.journals.allJournals
})

class JournalFeed extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		request
			.post("http://localhost:3000/graphql")
			.use(ql(allJournalsQuery))
			.end((err, res) => {
				const { allJournals } = res.body.data
				this.props.onLoad(allJournals)
			})
	}

	render() {
		return (
			<FlatList
				contentContainerStyle={{
					flex: 1,
					alignItems: "center"
				}}
				data={this.props.journals}
				keyExtractor={item => item.id}
				renderItem={({ item }) => <JournalCard {...item} />}
			/>
		)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(JournalFeed)
