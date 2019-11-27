import React from "react"
import { StyleSheet, View, Dimensions, Text, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import ProgressiveImage from "../shared/ProgressiveImage"

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

const ChapterImage = props => {
  if (props.imageUrl) {
    return (
      <View style={{ width: 80 }}>
        <ProgressiveImage style={styles.chapterImage} source={props.imageUrl} thumbnailSource={props.thumbnailSource} />
      </View>
    )
  } else {
    return <View />
  }
}

const PublishedStatus = props => {
  const icon = props.published ? "done" : "publish"
  const color = props.published ? "#3F88C5" : "#FF5423"
  const text = props.published ? "PUBLISHED" : "UNPUBLISHED"

  if (props.isCurrentUser) {
    return (
      <View style={styles.publishedStatusContainer}>
        <MaterialIcons name={icon} color={color} size={12} />
        <Text style={[styles.publishedStatusText, { color: color }]}>{text}</Text>
      </View>
    )
  } else {
    return <View />
  }
}

const ChapterCard = props => {
  let publishedStatus
  let { imageUrl, title, distance, readableDate, thumbnailSource } = props

  distance = distanceString(distance)
  const isCurrentUser = props.currentUser && props.user.id == props.currentUser.id

  return (
    <TouchableWithoutFeedback key={props.id} style={{ flex: 1 }} onPress={() => props.handleSelectChapter(props.id)}>
      <View style={styles.chapterCardContainer}>
        <View
          style={[
            styles.flexColumn,
            {
              maxWidth: Dimensions.get("window").width - 140
            }
          ]}>
          <View>
            <Text numberOfLines={1} style={styles.chapterTitle}>
              {title}
            </Text>
            <PublishedStatus isCurrentUser={isCurrentUser} published={props.published} />
          </View>
          <View style={styles.allIcons}>
            <View style={styles.individualIconTextContainer}>
              <MaterialCommunityIcons name="calendar" size={18} style={styles.iconMargin} />
              <Text style={styles.textStats}>{`${readableDate}`.toUpperCase()}</Text>
            </View>
            <View style={styles.individualIconTextContainer}>
              <MaterialIcons style={styles.iconMargin} name="directions-bike" size={16} />
              <Text style={styles.textStats}>{`${distance}`.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <ChapterImage imageUrl={imageUrl} thumbnailSource={thumbnailSource} />
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
    minHeight: 120
  },
  publishedStatusContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  chapterTitle: {
    maxWidth: Dimensions.get("window").width - 140,
    fontFamily: "open-sans-regular",
    color: "#323941",
    fontSize: 20
  },
  allIcons: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  publishedStatusText: {
    fontSize: 10,
    marginLeft: 5
  },
  individualIconTextContainer: {
    display: "flex",
    flexDirection: "row"
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
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
