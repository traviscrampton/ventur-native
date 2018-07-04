import React, { Component } from "react"
import { journalQuery, journalChaptersQuery, journalGearItems } from "graphql/queries/journals"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions } from "react-native"
import ChapterList from "components/chapters/chapter_list"
import GearList from "components/gear/gear_list"
import Tabs from "components/shared/tabs"
import ql from "superagent-graphql"
import request from "superagent"
import { SINGLE_JOURNAL_LOADED, SWITCH_JOURNAL_TAB } from "actions/action_types"
import { connect } from "react-redux"

const mapStateToProps = state => ({
	journal: state.journal.journal,
	user: state.journal.journal.user,
	chapters: state.journal.chapters,
	gearItems: state.journal.gearItems,
	tabs: state.journal.tabs,
	selectedTabFlag: state.journal.selectedTabFlag
})

const mapDispatchToProps = dispatch => ({
	onLoad: payload => {
		dispatch({ type: SINGLE_JOURNAL_LOADED, payload })
	},

	onTabSwitch: payload => {
		dispatch({ type: SWITCH_JOURNAL_TAB, payload })
	}
})

const bannerImageWidth = Dimensions.get("window").width
const bannerImageHeight = Math.round(bannerImageWidth * (150 / 300))

class Journal extends Component {
	constructor(props) {
		super(props)

		this.handleTabPress = this.handleTabPress.bind(this)
	}

	componentWillMount() {
		this.requestForJournal()
		this.handleTabPress(this.props.selectedTabFlag)
	}

	requestForJournal() {
		let journalId = this.props.navigation.getParam("journalId", "NO-ID")

		request
			.post("http://localhost:3000/graphql")
			.use(ql(journalQuery, { id: journalId }))
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

	handleTabPress(pressedTabKey) {
		const query = this.setQuery(pressedTabKey)
		this.requestTabData(pressedTabKey, query)
	}

	setQuery(pressedTabKey) {
		switch (pressedTabKey) {
			case "chapters":
				return journalChaptersQuery
			case "gearItems":
				return journalGearItems
			case "map":
				return null
			default:
				return null
		}
	}

	requestTabData(pressedTabKey, queryString) {
		if (queryString === null) return
		let journalId = this.props.navigation.getParam("journalId", "NO-ID")

		request
			.post("http://localhost:3000/graphql")
			.use(ql(queryString, { id: journalId }))
			.end((err, res) => {
				let payload = {
					[pressedTabKey]: res.body.data.journal[pressedTabKey],
					selectedTabFlag: pressedTabKey
				}
				this.props.onTabSwitch(payload)
			})
	}

	renderTabs() {
		return (
			<Tabs tabs={this.props.tabs} handleTabPress={this.handleTabPress} selectedTabFlag={this.props.selectedTabFlag} />
		)
	}

	renderChapters() {
		return <ChapterList chapters={this.props.chapters} />
	}

	renderGear() {
		return <GearList gearItems={this.props.gearItems} />
	}

	renderMap() {
		return <Text>Here is map tab</Text>
	}

	renderActiveTab() {
		return <View style={styles.activeTabContainer}>{this.renderActiveTabContent()}</View>
	}

	renderActiveTabContent() {
		switch (this.props.selectedTabFlag) {
			case "chapters":
				return this.renderChapters()
			case "gearItems":
				return this.renderGear()
			case "map":
				return this.renderMap()
			default:
				return this.renderChapters()
		}
	}

	render() {
		return (
			<ScrollView>
				{this.renderHeader()}
				{this.renderTabs()}
				{this.renderActiveTab()}
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
		padding: 16,
		backgroundColor: "white"
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
		justifyContent: "center",
		marginTop: 20,
		marginBottom: 20
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
	wideFlex: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10
	},
	stats: {
		letterSpacing: 1
	},
	activeTabContainer: {
		padding: 16,
		backgroundColor: "rgb(245,245,245)"
	}
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Journal)
