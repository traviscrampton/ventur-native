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
				return (
					<Tab
						{...tab}
						key={index}
						handleTabPress={props.handleTabPress}
						isSelectedTab={props.selectedTabFlag === tab.flag}
					/>
				)
			})}
		</View>
	)
}

const Tab = props => {
	const { flag, isSelectedTab, title, handleTabPress } = props
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				handleTabPress(flag)
			}}>
			<View style={[styles.tab, isSelectedTab ? styles.selectedTab : {}]}>
				<Text style={styles.tabFont}>{`${title}`.toUpperCase()}</Text>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	flatList: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	tab: {
		width: width / 3,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: "#E5E5E5",
	},
	selectedTab: {
		backgroundColor: "rgb(245,245,245)",
		shadowColor: "#000",
		shadowOffset: { width: 3, height: 2 },
		shadowOpacity: 0.6,
		elevation: 1
	},
	tabFont: {
		textAlign: "center",
		fontSize: 20
	}
})

export default Tabs
