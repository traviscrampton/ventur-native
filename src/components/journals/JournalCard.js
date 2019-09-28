import React from "react"
import { StyleSheet, View, Text, ImageBackground, TouchableWithoutFeedback } from "react-native"
import { SimpleLineIcons } from "@expo/vector-icons"
import ProgressiveImage from "../shared/ProgressiveImage"

let imageWidth
let imageHeight

const countries = names => {
  return names.map((name, index) => {
    if (index !== names.length - 1) {
      name += ","
    }

    return <Text style={styles.countryName}>{name}</Text>
  })
}

const distanceString = distance => {
  const { distanceType, kilometerAmount, mileAmount } = distance
  switch (distanceType) {
    case "kilometer":
      return `${kilometerAmount} KM`

    case "mile":
      return `${mileAmount} MI`

    default:
      return ""
  }
}

const tripMetaData = props => {
  const distance = distanceString(props.distance)

  return (
    <View style={styles.metadataContainer}>
      <View style={styles.marginBottomAuto}>
        <View style={styles.iconTextContainer}>
          <SimpleLineIcons name="location-pin" style={styles.iconPosition} size={14} color="#323941" />
          <View style={styles.countries}>{countries(props.countries)}</View>
        </View>
        <Text numberOfLines={2} style={styles.title}>
          {props.title}
        </Text>
      </View>
      <View
        style={{
          marginTop: 20,
          display: "flex"
        }}>
        <Text style={{ fontFamily: "overpass" }}>
          {`${props.status} ${"\u2022"} ${distance} ${"\u2022"} ${props.journalFollowsCount} followers`.toUpperCase()}
        </Text>
      </View>
    </View>
  )
}

const JournalCard = props => {
  imageWidth = props.width - 40
  imageHeight = Math.round(imageWidth * (240 / 350))
  const imageStyles = Object.assign({}, styles.journalImage, {
    width: imageWidth,
    height: imageHeight,
    borderRadius: 10
  })

  return (
    <TouchableWithoutFeedback key={props.id} onPress={() => props.handlePress(props.id)}>
      <View shadowColor="gray" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
        <View style={[styles.card, { width: imageWidth, borderRadius: 10, overflow: "hidden" }]}>
          <ProgressiveImage thumbnailSource={props.thumbnailImageUrl} source={props.cardImageUrl} style={imageStyles} />
          <View>{tripMetaData(props)}</View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative"
  },
  journalImage: {
    position: "relative"
  },
  metadataContainer: {
    padding: 10,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white"
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
    fontFamily: "playfair",
    color: "#323941"
  },
  marginBottomAuto: {
    marginBottom: "auto"
  },
  iconTextContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  iconPosition: {
    marginRight: 5,
    paddingBottom: 2
  },
  countries: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  countryName: {
    fontFamily: "open-sans-regular",
    marginRight: 5
  }
})

export default JournalCard
