import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
  Text,
  ImageBackground
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { toggleLoginModal } from "../../actions/login";
import { toggleUserFormModal } from "../../actions/user_form";
import Login from "./Login";
import UserForm from "./UserForm";
const GabeBolivia = require("../../assets/images/Gabe_in_Bolivia.jpg");

const mapStateToProps = state => ({
  width: state.common.width,
  height: state.common.height
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: payload => dispatch(toggleLoginModal(payload)),
  toggleUserFormModal: payload => dispatch(toggleUserFormModal(payload))
});

class HomeLoggedOut extends Component {
  constructor(props) {
    super(props);
  }

  toggleLoginModal = () => {
    this.props.toggleLoginModal(true);
  };

  navigateToSignUp = () => {
    this.props.toggleUserFormModal(true);
  };

  renderTitleAndSubTitle() {
    return (
      <View style={{ marginTop: this.props.height / 7 }}>
        <View>
          <Text style={styles.headerText}>Ventur</Text>
        </View>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Bike touring built for you</Text>
        </View>
      </View>
    );
  }

  renderAgreementText() {
    return (
      <View>
        <Text style={styles.agreementText}>
          *By tapping get started, you agree to our privacy policy and service
          agreement.
        </Text>
      </View>
    );
  }

  renderSignIn() {
    return (
      <TouchableWithoutFeedback onPress={this.toggleLoginModal}>
        <View>
          <Text style={styles.signInButton}>Sign in</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderSignUp() {
    return (
      <TouchableWithoutFeedback onPress={this.navigateToSignUp}>
        <LinearGradient
          style={[styles.signUp, { width: this.props.width - 40 }]}
          colors={["#FF5423", "#E46545"]}
        >
          <Text style={styles.signUpText}>Get Started</Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }

  renderSignUpAndSignIn() {
    return (
      <View style={styles.signInAndSignUpContainer}>
        {this.renderSignIn()}
        {this.renderSignUp()}
        {this.renderAgreementText()}
      </View>
    );
  }

  render() {
    const { width, height } = this.props;
    return (
      <ImageBackground style={{ height: null, width }} source={GabeBolivia}>
        <View style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", height, width }}>
          <SafeAreaView>
            <View style={[styles.flexSpaceBetween, { height, width }]}>
              {this.renderTitleAndSubTitle()}
              {this.renderSignUpAndSignIn()}
            </View>
          </SafeAreaView>
        </View>
        <Login />
        <UserForm />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 60,
    color: "white",
    textAlign: "center"
  },
  subHeaderContainer: {
    padding: 40,
    paddingTop: 10
  },
  subHeaderText: {
    fontSize: 22,
    color: "white",
    textAlign: "center"
  },
  agreementText: {
    color: "white",
    textAlign: "center",
    fontSize: 8
  },
  signInButton: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold"
  },
  signUp: {
    marginTop: 10,
    marginBottom: 20,
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  },
  flexSpaceBetween: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  signUpText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  signInAndSignUpContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 70
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeLoggedOut);
