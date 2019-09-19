import React, { Component } from "react"
import { Modal, SafeAreaView } from "react-native"
import { connect } from "react-redux"
import DropdownAlert from "react-native-dropdownalert"
import DropDownHolder from "../../utils/DropdownHolder"

const mapStateToProps = state => ({
  width: state.common.width,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({})

class FormModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType={"slide"}
        style={{ backgroundColor: "white", height: this.props.height }}>
        <SafeAreaView>
          {this.props.children}
          <DropdownAlert ref={ref => DropDownHolder.setDropDown(ref)} closeInterval={4000} />
        </SafeAreaView>
      </Modal>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormModal)
