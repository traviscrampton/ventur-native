import React, { Component } from "react"
import { connect } from "react-redux"
import { updateManageContentEntries, updateEntriesOrder } from "actions/editor"
import { Text, FlatList, TouchableWithoutFeedback, Image, Dimensions, StyleSheet, View } from "react-native"
import { Header } from "components/editor/header"
import SortableList from "react-native-sortable-list"

const mapStateToProps = state => ({
  entries: state.editor.entries
})
const mapDispatchToProps = dispatch => ({
  updateManageContentEntries: payload => dispatch(updateManageContentEntries(payload)),
  updateEntriesOrder: () => dispatch(updateEntriesOrder())
})

class ManageContent extends Component {
  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.onChangeOrder = this.onChangeOrder.bind(this)
    this.updateEntriesOrder = this.updateEntriesOrder.bind(this)
    this.handleGoBack = this.handleGoBack.bind(this)
  }

  handleGoBack() {
    this.props.navigation.goBack()
  }

  updateEntriesOrder() {
    this.props.updateEntriesOrder()
    this.props.navigation.goBack()
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.handleGoBack,
      centerCta: `Manage Content`,
      handleConfirm: this.updateEntriesOrder,
      confirmCta: "GO"
    }
    return <Header key="header" {...headerProps} />
  }

  renderText(data, active) {
    return (
      <View active={active} style={{ height: 100 }}>
        <Text>{data.content}</Text>
      </View>
    )
  }

  renderImage(data, active) {
    return (
      <View active={active}>
        <Image style={{ width: Dimensions.get("window").width, height: 100 }} source={{ uri: data.uri }} />
      </View>
    )
  }

  renderRow({ data, active }) {
    switch (data.type) {
      case "text":
        return this.renderText(data, active)
      case "image":
        return this.renderImage(data, active)
    }
  }

  onChangeOrder(indexArray) {
    let entries = [...this.props.entries]
    let newOrder = indexArray.map((num, idx) => {
      return entries[num]
    })
    this.props.updateManageContentEntries(newOrder)
  }

  renderManagableEntries() {
    return (
      <SortableList
        style={{ flex: 1 }}
        key="SortableList"
        onChangeOrder={this.onChangeOrder}
        data={this.props.entries}
        renderRow={this.renderRow}
      />
    )
  }

  render() {
    return [this.renderHeader(), this.renderManagableEntries()]
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageContent)
