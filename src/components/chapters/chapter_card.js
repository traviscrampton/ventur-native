import React from "react"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions, TouchableWithoutFeedback } from "react-native"
import {MaterialIcons} from "@expo/vector-icons"

const ChapterCard = props => {
  const { imageUrl, title, distance, dateCreated, description } = props
  return (
    <TouchableWithoutFeedback>
      <View style={styles.chapterCardContainer}>
        <View>
          <Text style={styles.chapterTitle}>{title}</Text>
          <Text style={{ fontFamily: "overpass", fontSize: 14 }}>{`${dateCreated}`.toUpperCase()}</Text>
          <View style={{ display: "flex", flexDirection: "row",  marginTop: "auto", marginBottom: -4 }}>
          <MaterialIcons style={{marginRight: 5}} name="directions-bike" size={16} />
            <Text style={{fontFamily: "overpass", fontSize: 14}}>{` ${distance} miles`.toUpperCase()}</Text>
          </View>
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
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#C8C8C8"
  },
  chapterImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginLeft: 20
  },
  chapterTitle: {
    fontFamily: "open-sans-semi",
    color: "#666",
    fontSize: 20,
  }
})

export default ChapterCard
