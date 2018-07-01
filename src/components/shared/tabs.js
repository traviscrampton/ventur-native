import React from "react"
import {
	StyleSheet,
	View,
	FlatList,
	Text,
	ImageBackground,
	Image,
	TouchableWithoutFeedback,
	Dimensions
} from "react-native"

const { height, width } = Dimensions.get("window")

const Tabs = props => {
	return (
		<View style={styles.flatList}>
			{props.tabs.map((tab, index) => {
				return <Tab key={index} title={tab.title} />
			})}
		</View>
	)
	// console.log("PROPS PROPS", props)
	// return (
	// 	<View>
	// 		<FlatList data={props.tabs} style={styles.flatList} renderItem={({ item }) => <Tab title={item.title} />} />
	// 	</View>
	// )
}

const Tab = props => {
	return (
		<TouchableWithoutFeedback>
			<View style={styles.tab}>
				<Text style={styles.tabFont}>{`${props.title}`.toUpperCase()}</Text>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	flatList: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E5E5E5"
	},
	tab: {
		width: width / 3,
		borderRightColor: "black",
		borderRightWidth: 1,
		paddingTop: 10,
		paddingBottom: 10
	},
	tabFont: {
		textAlign: "center",
		fontSize: 20
	}
})

export default Tabs
