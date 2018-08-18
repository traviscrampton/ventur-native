import React from "react"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions, TouchableWithoutFeedback } from "react-native"

const ChapterCard = props => {
  const { imageUrl, title, distance, dateCreated, description } = props
  return (
    <TouchableWithoutFeedback>
      <View style={styles.chapterCardContainer}>
        <View>
          <Image style={styles.chapterImage} source={{ uri: imageUrl }} />
        </View>
        <View>
          <Text style={styles.chapterTitle}>{title}</Text>
          <Text style={{ fontFamily: "overpass", fontSize: 12, marginBottom: -4 }}>
            {`miles: ${distance}`.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: "overpass", fontSize: 12 }}>{`date: ${dateCreated}`.toUpperCase()}</Text>
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
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20
  },
  chapterTitle: {
    fontFamily: "playfair",
    fontSize: 16,
    marginBottom: 10
  }
})

export default ChapterCard
