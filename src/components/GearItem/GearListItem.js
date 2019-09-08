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
      shadowColor="#323941"
      shadowOffset={{ width: 0, height: 0 }}
      shadowOpacity={0.6}
      style={{
        width: width,
        height: 120,
        display: "flex",
        marginLeft: 20,
        marginTop: 15,
        backgroundColor: "white",
        borderRadius: 5
      }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => props.gearItemPress(id)}>
        <View style={{ display: "flex", flexDirection: "row", backgroundColor: "white" }}>
          <View style={{ width: 120, height: 120, backgroundColor: "gray" }}>
            <ProgressiveImage style={{ width: 120, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, height: 120 }} source={imageUrl} />
          </View>
          <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 10 }}>
            <Text style={{ fontSize: 16, width: textWidth, fontFamily: "open-sans-regular" }} numberOfLines={2}>
              {name}
            </Text>
            <StarRating rating={rating} size={20}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({})

export default GearListItem
