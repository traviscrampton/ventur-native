import React, { Component } from "react"
import { StyleSheet, FlatList, View, Text, List } from "react-native"
import { connect } from "react-redux"

const mapStateToProps = state => {

}

const mapDispatchToProps = state => {

}

class Journal extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		let journalID = this.props.navigation.getParam("journalId", "NO-ID")
		console.log("journalId", journalID)
	}
	render() {
		return null
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Journal)
