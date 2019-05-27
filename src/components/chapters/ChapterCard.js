import React from "react"
import { StyleSheet, View, Dimensions, Text, Image, Button, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import ProgressiveImage from "components/shared/ProgressiveImage"

const distanceString = distance => {
  const { distanceType, kilometerAmount, mileAmount, readableDistanceType } = distance
  switch (distanceType) {
    case "kilometer":
      return `${kilometerAmount} ${readableDistanceType}`

    case "mile":
      return `${mileAmount} ${readableDistanceType}`

    default:
      return ""
  }
}

const ChapterCard = props => {
  let publishedStatus
  let { imageUrl, title, distance, readableDate, thumbnailSource } = props
  console.log(thumbnailSource)

  distance = distanceString(distance)

  if (props.currentUser && !props.published && props.user.id == props.currentUser.id) {
    publishedStatus = <Text style={{ color: "orange" }}>Draft</Text>
  }

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => props.handleSelectChapter(props.id)}>
      <View style={styles.chapterCardContainer}>
        <View style={{ maxWidth: Dimensions.get("window").width - 140 }}>
          {publishedStatus}
          <Text numberOfLines={1} style={styles.chapterTitle}>
            {title}
          </Text>
          <View style={styles.allIcons}>
            <View style={styles.individualIconTextContainer}>
              <MaterialCommunityIcons name="calendar" size={18} style={styles.iconMargin} />
              <Text style={styles.textStats}>{`${readableDate}`.toUpperCase()}</Text>
            </View>
            <View style={styles.individualIconTextContainer}>
              <MaterialIcons style={styles.iconMargin} name="directions-bike" size={16} />
              <Text style={styles.textStats}>{`${distance}`.toUpperCase()}</Text>
            </View>
            <View style={styles.individualIconTextContainer}>
              <Feather style={styles.iconMargin} name="camera" size={16} />
              <Text style={styles.textStats}>{props.blogImageCount} Photos</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 80 }}>
          <ProgressiveImage style={styles.chapterImage} source={imageUrl} thumbnailSource={thumbnailSource} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  chapterCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    alignItems: "top"
  },
  chapterTitle: {
    maxWidth: Dimensions.get("window").width - 140,
    fontFamily: "open-sans-regular",
    color: "#323941",
    fontSize: 20,
    marginBottom: 10
  },
  allIcons: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  individualIconTextContainer: {
    display: "flex",
    flexDirection: "row"
  },
  textStats: {
    fontFamily: "overpass",
    fontSize: 14
  },
  chapterImage: {
    width: 80,
    height: 100,
    borderRadius: 5
  },
  iconMargin: {
    marginRight: 5
  }
})

export default ChapterCard
