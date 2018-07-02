import React from "react"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions, TouchableWithoutFeedback } from "react-native"

const ChapterCard = props => {
	const {imageUrl, title, distance, dateCreated, description} = props
	return (
		<TouchableWithoutFeedback>
			<View style={styles.chapterCardContainer}>
				<View>
					<Image style={styles.chapterImage} source={{ uri: imageUrl }} />
				</View>
				<View>
					<Text style={styles.chapterTitle}>{title}</Text>
					<Text>{`miles: ${distance}`.toUpperCase()}</Text>
					<Text>{`date: ${dateCreated}`.toUpperCase()}</Text>
					<Text>{description}</Text>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	chapterCardContainer: {
		display: "flex",
		flexDirection: "row",
		marginBottom: 20,
		backgroundColor: "white",
		borderRadius: 6,
		padding: 15
	},
	chapterImage: {
		width: 90,
		height: 90,
		borderRadius: 45,
		marginRight: 20
	},
	chapterTitle: {
		fontSize: 20
	}
})

export default ChapterCard