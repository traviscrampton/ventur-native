import React from "react"
import { StyleSheet, View, Text, ImageBackground, Image, TouchableWithoutFeedback, Dimensions } from "react-native"

const imageWidth = Dimensions.get("window").width
const imageHeight = Math.round(imageWidth * (210/350))
const JournalCard = props => {
	return (
		<TouchableWithoutFeedback
			onPress={() => props.handle_press(props.id)}>
			<View style={styles.card}>
			<ImageBackground style={styles.journalImage} source={{ uri: props.cardImageUrl }}>
				<View style={styles.userInfo}>
					<Image style={styles.userImage} source={{ uri: props.user.avatarImageUrl }} />
					<Text style={styles.userName}>{props.user.fullName}</Text>
				</View>
			</ImageBackground>
			<View style={styles.metaData}>
				<View>
					<Text style={styles.title}>{props.title}</Text>
					<Text style={styles.subTitle}>{props.description}</Text>
				</View>
				<View style={styles.wideFlex}>
					<Text style={styles.stats}>{`Status:`.toUpperCase()}</Text>
					<Text style={styles.stats}>{`${props.status}`.toUpperCase()}</Text>
				</View>
				<View style={styles.wideFlex}>
					<Text style={styles.stats}>{`Stats:`.toUpperCase()}</Text>
					<Text style={styles.stats}>{`${props.distance}`.toUpperCase()}</Text>
				</View>
			</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	card: {
		marginTop: 20
	},
	journalImage: {
		width: imageWidth,
		height: imageHeight,
		position: "relative"
	},
	userInfo: {
		position: "absolute",
		bottom: 10,
		left: 10,
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	userImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10
	},
	userName: {
		color: "white"
	},
	metaData: {
		backgroundColor: "rgb(245,245,245)",
		padding: 8,
		paddingBottom: 16
	},
	title: {
		fontSize: 24,
		marginBottom: 10
	},
	wideFlex: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	subTitle: {
		fontSize: 16,
		marginBottom: 10
	},
	stats: {
		letterSpacing: 1
	}
})

export default JournalCard
