import React, { Component } from "react"
import { StyleSheet, FlatList, View, Text, List, ScrollView } from "react-native"
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

		this.handle_press = this.handle_press.bind(this)
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

	handle_press(journalId) {
		this.props.navigation.navigate("Journal", {journalId})
	}

	render() {
		return (
			<ScrollView>
				<FlatList
					scrollEnabled={true}
					contentContainerStyle={styles.container}
					data={this.props.journals}
					keyExtractor={item => item.id}
					renderItem={({ item }) => <JournalCard {...item} handle_press={this.handle_press} />}
				/>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white"
	}
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(JournalFeed)
