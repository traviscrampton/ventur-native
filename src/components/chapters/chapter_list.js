import React from "react"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions } from "react-native"
import ChapterCard from "components/chapters/chapter_card"

const ChapterList = props => {
	return (
		<View>
			{props.chapters.map((chapter, index) => {
				return <ChapterCard {...chapter} key={index} />
			})}
		</View>
	)
}

export default ChapterList
	