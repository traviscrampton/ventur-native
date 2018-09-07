import React from "react"
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, Dimensions } from "react-native"
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
    <View style={{ padding: 10, display: "flex", flexDirection: "column" }}>
      <View style={{ marginBottom: "auto" }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <SimpleLineIcons name="location-pin" style={{ marginRight: 5 }} size={14} color="black" />
          <Text style={{ fontFamily: "open-sans-regular" }}>{props.description}</Text>
        </View>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View
        style={{
          marginTop: "auto",
          display: "flex"
        }}>
        <Text>
          {`${props.status}`.toUpperCase()} {`\u2022`} {`${props.distance} miles`.toUpperCase()}
        </Text>
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
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontFamily: "playfair"
  }
})

export default JournalCard
