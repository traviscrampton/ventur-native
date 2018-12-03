import React, { Component } from "react"
import { StyleSheet, View, Text, Image, Dimensions, DatePickerIOS, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class DatePickerDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: props.date
    }
  }

  handleDateChange = (date) => {
    this.setState({ date: date})
  }

  persistMetadata = () => {
    this.props.persistMetadata(this.state.date)
    this.props.toggleDatePicker()
  }

  renderConfirmOptions() {
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
        <TouchableWithoutFeedback onPress={this.props.toggleDatePicker}>
          <View>
            <Text>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.persistMetadata}>
          <View>
            <Text>Submit</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    let { date } = this.state
    
    if (typeof date === "number") {
      date = new Date(this.state.date)
    }

    return (
      <View style={{ borderWidth: 1, borderRadius: 4, borderColor: "#f8f8f8"}}>
        <DatePickerIOS style={{ color: "white" }} mode={"date"} date={date} onDateChange={this.handleDateChange} />
        {this.renderConfirmOptions()}
      </View>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatePickerDropdown)
