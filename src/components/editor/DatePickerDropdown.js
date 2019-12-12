import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  DatePickerIOS,
  TouchableWithoutFeedback
} from "react-native";

class DatePickerDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.date
    };
  }

  handleDateChange = date => {
    this.setState({ date: date });
  };

  persistMetadata = () => {
    this.props.persistMetadata(this.state.date);
    this.props.toggleDatePicker();
  };

  renderConfirmOptions() {
    return (
      <View style={styles.confirmOptionsContainer}>
        <TouchableWithoutFeedback onPress={this.props.toggleDatePicker}>
          <View style={styles.marginRight10}>
            <Text>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.persistMetadata}>
          <View style={styles.submitButtonContainer}>
            <Text style={styles.colorWhite}>SUBMIT</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let { date } = this.state;

    if (typeof date === "number") {
      date = new Date(this.state.date);
    }

    return (
      <View style={styles.container}>
        <DatePickerIOS
          style={styles.datePicker}
          mode={"date"}
          date={date}
          onDateChange={this.handleDateChange}
        />
        {this.renderConfirmOptions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "gray",
    justifyContent: "center"
  },
  datePicker: {
    backgroundColor: "gray",
    marginBottom: 5,
    overflow: "hidden",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  confirmOptionsContainer: {
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  marginRight10: {
    marginRight: 10
  },
  submitButtonContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: "#3F88C5",
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3F88C5"
  },
  colorWhite: {
    color: "white"
  }
});

export default DatePickerDropdown;
