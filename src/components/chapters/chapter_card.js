import React from "react"
import { StyleSheet, FlatList, View, Text, ScrollView, Image, Dimensions, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"

const ChapterCard = props => {
  const { imageUrl, title, distance, dateCreated, description } = props
  return (
    <TouchableWithoutFeedback onPress={() => props.handleSelectChapter(props.id)}>
      <View style={styles.chapterCardContainer}>
        <View>
          <Text style={styles.chapterTitle}>{title}</Text>
          <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <MaterialCommunityIcons name="calendar" size={18} style={{ marginRight: 5 }} />
              <Text style={{ fontFamily: "overpass", fontSize: 14 }}>{`${dateCreated}`.toUpperCase()}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <MaterialIcons style={{ marginRight: 5 }} name="directions-bike" size={16} />
              <Text style={{ fontFamily: "overpass", fontSize: 14 }}>{`${distance} miles`.toUpperCase()}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Feather style={{ marginRight: 5 }} name="camera" size={16} />
              <Text style={{ fontFamily: "overpass", fontSize: 14 }}>5 Photos</Text>
            </View>
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
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3"
  },
  chapterImage: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginLeft: 20
  },
  chapterTitle: {
    fontFamily: "open-sans-semi",
    color: "black",
    fontSize: 20,
    marginBottom: 10
  }
})

export default ChapterCard
