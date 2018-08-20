import React from "react"
import { StyleSheet, View, Text, ImageBackground, Image, TouchableWithoutFeedback, Dimensions } from "react-native"
import { SimpleLineIcons } from "@expo/vector-icons"

const imageWidth = Dimensions.get("window").width - 20
const imageHeight = Math.round(imageWidth * (240 / 350))
const JournalCard = props => {
  return (
    <TouchableWithoutFeedback onPress={() => props.handlePress(props.id)}>
      <View
        shadowColor="gray"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.card}>
        <Image style={styles.journalImage} source={{ uri: props.cardBannerImageUrl }} />
        <View>{tripMetaData(props)}</View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const tripMetaData = props => {
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontFamily: "overpass" }}>
        {`${props.status}`.toUpperCase()} {`\u2022`} {`${props.distance} miles`.toUpperCase()}
      </Text>
      <Text style={styles.title}>{props.title}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          left: 8,
          bottom: -40
        }}>
        <SimpleLineIcons name="location-pin" style={{ marginRight: 5 }} size={18} color="black" />
        <Text style={{ fontFamily: "open-sans-regular" }}>{props.description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: imageWidth,
    backgroundColor: "white",
    height: imageHeight + 150,
    marginTop: 20,
    position: "relative"
  },
  journalImage: {
    width: imageWidth,
    height: imageHeight,
    position: "relative"
  },
  userInfo: {
    position: "absolute",
    bottom: 10,
    left: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  userName: {
    color: "white"
  },
  metaData: {
    backgroundColor: "rgb(245,245,245)",
    padding: 8,
    paddingBottom: 16
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "playfair"
  },
  wideFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10
  },
  stats: {
    letterSpacing: 1
  }
})

export default JournalCard
