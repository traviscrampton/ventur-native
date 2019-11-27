import React, { Component } from "react"
import { connect } from "react-redux"
import { Modal, SafeAreaView } from "react-native"
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

  static defaultProps = {
    backgroundColor: "white"
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType={"slide"}
        style={{ backgroundColor: this.props.backgroundColor, height: this.props.height }}>
        <SafeAreaView style={{backgroundColor: this.props.backgroundColor}}>
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
