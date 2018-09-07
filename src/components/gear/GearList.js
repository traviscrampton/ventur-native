import React from "react"
import { View } from "react-native"
import GearItem from "components/gear/GearItem"

const GearList = props => {
  return (
    <View>
      {props.gearItems.map((item, index) => {
        return <GearItem {...item} key={index} />
      })}
    </View>
  )
}

export default GearList
