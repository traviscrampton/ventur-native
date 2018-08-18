import React from "react"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions, TouchableWithoutFeedback } from "react-native"

const ChapterCard = props => {
  const { imageUrl, title, distance, dateCreated, description } = props
  return (
    <TouchableWithoutFeedback>
      <View style={styles.chapterCardContainer}>
        <View>
          <Text style={styles.chapterTitle}>{title}</Text>
          <Text style={{ fontFamily: "overpass", fontSize: 12, marginBottom: -4 }}>
            {`miles: ${distance}`.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: "overpass", fontSize: 12 }}>{`date: ${dateCreated}`.toUpperCase()}</Text>
        </View>
        <View>
          <Image style={styles.chapterImage} source={{ uri: imageUrl }} />
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
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 15,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#C8C8C8"
  },
  chapterImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginLeft: 20
  },
  chapterTitle: {
    fontFamily: "open-sans-bold",
    color: "#666",
    fontSize: 16,
    marginBottom: 10
  }
})

export default ChapterCard
