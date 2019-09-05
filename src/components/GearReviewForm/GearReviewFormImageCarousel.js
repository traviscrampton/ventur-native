import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Text, FlatList, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  width: state.common.width,
  images: state.gearReviewForm.images
})

const mapDispatchToProps = dispatch => ({})

class GearReviewFormImageCarousel extends Component {
  constructor(props) {
    super(props)
  }

  renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: 120,
          height: 120,
          backgroundColor: "white",
          marginRight: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around"
        }}>
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MaterialIcons name={"file-upload"} size={32} />
          <View>
            <Text style={{ fontSize: 20 }}>Upload</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Photos</Text>
        </View>
        <FlatList horizontal={true} data={[{ key: "a" }]} renderItem={this.renderItem} />
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormImageCarousel)
