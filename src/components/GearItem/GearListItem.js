import React from "react"
import _ from "lodash"
import { StyleSheet, View, Dimensions, Text, Image, Button, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import ProgressiveImage from "../shared/ProgressiveImage"
import StarRating from "../shared/StarRating"

const renderRatingStars = props => {
  return [...Array(props.rating)].map((e, i) => {
    return <MaterialIcons name="star" color="gold" size={props.size} key={i} />
  })
}

const GearListItem = props => {
  const { id, gearItemId, name, imageUrl, rating } = props.gearItem
  const width = Dimensions.get("window").width - 40
  const textWidth = width - 135

  return (
    <View
      shadowColor="gray"
      shadowOffset={{ width: 0, height: 0 }}
      shadowOpacity={0.5}
      shadowRadius={2}
      style={{
        width: width,
        height: 100,
        display: "flex",
        marginLeft: 20,
        marginTop: 15,
        backgroundColor: "white",
        borderRadius: 5
      }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => props.gearItemPress(id)}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "white",
            overflow: "hidden",
            borderRadius: 5
          }}>
          <View style={{ width: 100, height: 100, backgroundColor: "white" }}>
            <ProgressiveImage
              style={{ width: 100, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, height: 100 }}
              source={imageUrl}
            />
          </View>
          <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 10 }}>
            <Text style={{ fontSize: 16, width: textWidth, fontFamily: "open-sans-regular" }} numberOfLines={2}>
              {name}
            </Text>
            <StarRating rating={rating} size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({})

export default GearListItem
