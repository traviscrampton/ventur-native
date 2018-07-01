import React, { Component } from "react"
import { singleJournalQuery } from "graphql/queries/journals"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions } from "react-native"
import ql from "superagent-graphql"
import request from "superagent"
import { connect } from "react-redux"
import { SINGLE_JOURNAL_LOADED } from "actions/action_types"
import Tabs from "components/shared/tabs"

const mapStateToProps = state => ({
	journal: state.journals.journal,
	user: state.journals.journal.user,
	chapters: state.journals.journal.chapter,
	tabs: state.journals.tabs,
	selectedTabKey: state.journals.selectedTabKey
})

const mapDispatchToProps = dispatch => ({
	onLoad: payload => {
		dispatch({ type: SINGLE_JOURNAL_LOADED, payload })
	}
})

const bannerImageWidth = Dimensions.get("window").width
const bannerImageHeight = Math.round(bannerImageWidth * (150 / 300))

class Journal extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		let journalId = this.props.navigation.getParam("journalId", "NO-ID")

		request
			.post("http://localhost:3000/graphql")
			.use(ql(singleJournalQuery(journalId)))
			.end((err, res) => {
				let { journal } = res.body.data
				this.props.onLoad(journal)
			})
	}

	renderHeader() {
		const { journal, user } = this.props
		return (
			<View>
				<Image style={styles.bannerImage} source={{ uri: journal.cardImageUrl }} />
				<View style={styles.metaDataContainer}>
					<View style={styles.titleSubTitleContainer}>
						<Text style={styles.journalHeader}>{journal.title}</Text>
						<Text style={styles.journalDescription}>{journal.description}</Text>
					</View>
					<View style={styles.userInfo}>
						<Image style={styles.userImage} source={{ uri: user.avatarImageUrl }} />
						<Text style={styles.userName}>{`${user.fullName}`.toUpperCase()}</Text>
					</View>
					<View style={styles.wideFlex}>
						<Text style={styles.stats}>{`Status:`.toUpperCase()}</Text>
						<Text style={styles.stats}>{`${journal.status}`.toUpperCase()}</Text>
					</View>
					<View style={styles.wideFlex}>
						<Text style={styles.stats}>{`Stats:`.toUpperCase()}</Text>
						<Text style={styles.stats}>{`${journal.distance}`.toUpperCase()}</Text>
					</View>
				</View>
			</View>
		)
	}

	renderTabs() {
		return <Tabs tabs={this.props.tabs} />
	}

	renderDynamicContainer() {}

	render() {
		return (
			<ScrollView>
				{this.renderHeader()}
				{this.renderTabs()}
				{this.renderDynamicContainer()}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	bannerImage: {
		width: bannerImageWidth,
		height: bannerImageHeight
	},
	metaDataContainer: {
		padding: 16
	},
	journalHeader: {
		fontSize: 32
	},
	journalDescription: {
		fontSize: 24
	},
	userInfo: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginTop: 40,
		marginBottom: 40
	},
	userImage: {
		width: 60,
		height: 60,
		borderRadius: 30,
		marginRight: 10
	},
	userName: {
		fontSize: 18
	},
	metaData: {
		backgroundColor: "rgb(245,245,245)",
		padding: 8,
		paddingBottom: 16
	},
	wideFlex: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10
	},
	stats: {
		letterSpacing: 1
	}
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Journal)
