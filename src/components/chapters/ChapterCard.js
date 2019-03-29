import React from "react"
import { StyleSheet, View, Dimensions, Text, Image, Button, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"

const ChapterCard = props => {
  let publishedStatus
  let { imageUrl, title, distance, readableDate } = props

  if (props.currentUser && !props.published && props.user.id == props.currentUser.id) {
    publishedStatus = <Text style={{color: "orange"}}>Draft</Text>
  }

  return (
    <TouchableWithoutFeedback onPress={() => props.handleSelectChapter(props.id)}>
      <View style={styles.chapterCardContainer}>
        <View>
          {publishedStatus}
          <Text numberOfLines={1} style={styles.chapterTitle}>{title}</Text>
          <View style={styles.allIcons}>
            <View style={styles.individualIconTextContainer}>
              <MaterialCommunityIcons name="calendar" size={18} style={styles.iconMargin} />
              <Text style={styles.textStats}>{`${readableDate}`.toUpperCase()}</Text>
            </View>
            <View style={styles.individualIconTextContainer}>
              <MaterialIcons style={styles.iconMargin} name="directions-bike" size={16} />
              <Text style={styles.textStats}>{`${distance} kilometers`.toUpperCase()}</Text>
            </View>
            <View style={styles.individualIconTextContainer}>
              <Feather style={styles.iconMargin} name="camera" size={16} />
              <Text style={styles.textStats}>{props.blogImageCount} Photos</Text>
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
  chapterTitle: {
    maxWidth: Dimensions.get('window').width - 140,
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
    borderRadius: 5,
    marginLeft: 20
  },
  iconMargin: {
    marginRight: 5
  }
})

export default ChapterCard
