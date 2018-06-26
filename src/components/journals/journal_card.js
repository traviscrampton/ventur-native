import React from "react"
import { Stylesheet, FlatList, View, Text, ImageBackground, Image } from "react-native"

const JournalCard = props => {
	return (
		<View style={{marginTop: 20}}>
			<ImageBackground style={{ width: 350, height: 210 }} source={{ uri: props.cardImageUrl }}>
				<Text>{props.user.fullName}</Text>
			</ImageBackground>
			<View>
				<Text style={{ fontSize: 24 }}>{props.title}</Text>
				<Text style={{ fontSize: 16 }}>{props.description}</Text>
			</View>
			<View>
				<Text>Status: {props.status}</Text>
				<Text>Stats: {props.distance}</Text>
			</View>
		</View>
	)
}

export default JournalCard
