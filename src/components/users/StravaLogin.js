import React, { Component } from "react"
import { connect } from "react-redux"
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native"
import { WebBrowser } from "expo"
import { AuthSession } from "expo"
import { encodeQueryString } from "../../agent"

const mapStateToProps = state => ({
  stravaClientId: state.common.stravaClientId,
  stravaClientSecret: state.common.stravaClientSecret
})

const mapDispatchToProps = dispatch => ({})

class StravaLogin extends Component {
  constructor(props) {
    super(props)
  }

  handleAsyncCall = async () => {
    const redirect = await Linking.getInitialURL("/")
    const clientId = "37236"
    const params = Object.assign(
      {},
      {
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirect,
        scope: "activity:read_all",
        approval_prompt: "force"
      }
    )
    let url = "https://www.strava.com/oauth/authorize" + encodeQueryString(params)

    const result = await WebBrowser.openAuthSessionAsync(url)
    //Now if the user authorized the app result will store the code you can perform the handshake with to get an access token for that user
    // I have a simple check to see if the user already exists in my backend and then send info to the store with a helper function
    const code = this.getCodeFromUrl(result)
    this.validateUser(code)
    // this._getCodeFromUrl(result)
  }

  getCodeFromUrl = result => {
    // const { url } = result
    const url =
      "exp://127.0.0.1:19000?state=&code=94af141e4bd98e02ceaf14df977f14257b37f9ce&scope=read,activity:read_all"
    const params = this.getUrlParams(url)
    this.validateUser(params.code)
  }

  validateUser = code => {
    let url = "https://www.strava.com/oauth/token"

    const params = Object.assign(
      {},
      {
        client_id: this.props.stravaClientId,
        client_secret: this.props.stravaClientSecret,
        grant_type: "authorization_code",
        code: code
      }
    )

    url = url + encodeQueryString(params)

    fetch(url, {
      method: "POST"
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log("data", data)
        return data
      })
      .catch(err => {
        console.log("error!", err)
        if (err.status === 401) {
          console.log("error 401")
          // return logout()
        }
      })
  }

  getUrlParams(url) {
    let hashes = url.slice(url.indexOf("?") + 1).split("&")
    let params = {}
    hashes.map(hash => {
      let [key, val] = hash.split("=")
      params[key] = decodeURIComponent(val)
    })

    return params
  }

  getActivities = () => {
    const url = "https://www.strava.com/api/v3/athlete/activities?per_page=60"
    const accessToken = "caeaf06fd8bfffd3d6d3a245ce9519ca0de889b7"

    fetch(url, {
      method: "GET",
      headers: {
      Authorization: `Bearer ${accessToken}`
    },

    }).then(response => {
      return response.json()
    }).then(data => {
      console.log("DADA", data)
      return data
    }).catch(err => {
        console.log("error!", err)
        if (err.status === 401) {
          console.log("error 401")
          // return logout()
        }
      })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.getActivities}>
        <View style={{ marginTop: 50 }}>
          <Text>StravaLogin</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StravaLogin)
