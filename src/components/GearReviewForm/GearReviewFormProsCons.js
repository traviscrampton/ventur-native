import React, { Component } from "react"
import { ScrollView, TextInput, View, Modal, Dimensions, Text, FlatList, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  width: state.common.width,
  pros: state.gearReviewForm.pros,
  cons: state.gearReviewForm.cons
})

const mapDispatchToProps = dispatch => ({})

class GearReviewFormProsCons extends Component {
  constructor(props) {
    super(props)
  }

  renderPros = () => {
    return this.props.pros.map((pro, i) => {
      return (
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
          <TextInput
            style={{
              marginTop: 5,
              marginBottom: 5,
              fontSize: 16,
              borderWidth: 1,
              fontFamily: "open-sans-regular",
              padding: 5,
              borderRadius: 5,
              borderColor: "#d3d3d3"
            }}
            selectionColor="#FF5423"
            onChangeText={text => console.log("text", text)}
            value={pro.text}
          />
          <MaterialIcons name="delete" size={20} />
        </View>
      )
    })
  }

  renderCons = () => {
    return this.props.cons.map((con, i) => {
      return (
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
          <TextInput
            style={{
              marginTop: 5,
              marginBottom: 5,
              fontSize: 16,
              borderWidth: 1,
              fontFamily: "open-sans-regular",
              padding: 5,
              borderRadius: 5,
              borderColor: "#d3d3d3"
            }}
            selectionColor="#FF5423"
            onChangeText={text => console.log("text", text)}
            value={con.text}
          />
          <MaterialIcons name="delete" size={20} />
        </View>
      )
    })
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Pros</Text>
          {this.renderPros()}
          <View>
            <Text>+ Add Pro</Text>
          </View>
        </View>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Cons</Text>
          {this.renderCons()}
          <View>
            <Text>+ Add Con</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormProsCons)
