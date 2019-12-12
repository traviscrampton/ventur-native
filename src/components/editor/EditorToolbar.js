import React, { Component } from "react";
import { connect } from "react-redux";
import { updateFormatBar, editEntry } from "../../actions/editor";
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

const mapStateToProps = state => ({
  toolbarOptions: state.editor.toolbarOptions,
  activeAttribute: state.editor.activeAttribute,
  activeIndex: state.editor.activeIndex,
  entries: state.editor.entries
});

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  editEntry: payload => dispatch(editEntry(payload))
});

class EditorToolbar extends Component {
  handleOnPress(option) {
    let styling = this.getProperStyling(option);
    let entry = {
      ...this.props.entries[this.props.activeIndex],
      styles: styling
    };
    let payload = { entry: entry, index: this.props.activeIndex };
    this.props.updateFormatBar(styling);
    this.props.editEntry(payload);
  }

  getProperStyling(option) {
    if (this.props.entries[this.props.activeIndex].styles === option) {
      return "";
    } else {
      return option;
    }
  }

  renderToolbarOption(option) {
    return (
      <View>
        <Text style={[styles.option, this.isSelectedStyle(option)]}>
          {this.getIcon(option)}
        </Text>
      </View>
    );
  }

  getIcon(option) {
    if (option === "H1") {
      return (
        <MaterialIcons
          color={this.isSelectedStyle(option)}
          name="text-fields"
          size={24}
        />
      );
    } else if (option === "QUOTE") {
      return (
        <Entypo name={"quote"} size={24} color={this.isSelectedStyle(option)} />
      );
    }
  }

  isSelectedStyle(option) {
    if (this.props.activeAttribute === option) {
      return "#CF5300";
    } else {
      return "black";
    }
  }

  renderTextStyler() {
    return this.props.toolbarOptions.map((option, index) => {
      return (
        <TouchableWithoutFeedback
          key={index}
          style={styles.option}
          onPress={() => this.handleOnPress(option)}
        >
          {this.renderToolbarOption(option)}
        </TouchableWithoutFeedback>
      );
    });
  }

  renderManageContent() {
    return (
      <TouchableWithoutFeedback onPress={this.props.openManageContent}>
        <View style={styles.textAlignCenter}>
          <Text style={styles.labelText}>MANAGE CONTENT</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <View
        style={styles.toolbarContainer}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.9}
      >
        <View style={styles.textEditButtons}>{this.renderTextStyler()}</View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorToolbar);

const styles = StyleSheet.create({
  toolbarContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "white",
    height: 45
  },
  textEditButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textAlignCenter: {
    textAlign: "center"
  },
  labelText: {
    fontSize: 18
  },
  option: {
    fontSize: 20,
    fontWeight: "500",
    minWidth: 50,
    textAlign: "left"
  }
});
