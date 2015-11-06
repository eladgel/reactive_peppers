/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  PropTypes,
} = React;

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
// var CheckBox = require('react-native-checkbox');
// var ReactNativeStore = require('react-native-store');
var Location = require('./Location.js');
var LocationsListView = require('./picker.js');
var localConfig = require('./local-config.json');
var uuid = require('uuid'); // uuid.v4()

const PARSE_APP_ID = localConfig.PARSE_APP_ID;
const PARSE_JS_KEY = localConfig.PARSE_JS_KEY;
const PARSE_REST_KEY = localConfig.PARSE_REST_KEY;

Parse.initialize(
  PARSE_APP_ID,
  PARSE_JS_KEY
);

var AwesomeProject3 = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState: function() {
    return { checked: false };
  },

  observe: function(props, state) {
    return { 
      user: ParseReact.currentUser,
    };
// undefined - still pending user status
// null - no user
// Parse.User - user exists
  },

  render: function() {

    if (this.data.user === undefined) {
      console.log('User status still in progress...');
      // Still waiting
    } else if (this.data.user === null) {
      var newUser = new Parse.User();
      newUser.set('username', uuid.v4());
      newUser.set('password', uuid.v4());
      newUser.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          console.log('WE HAVE A NEW USER!!', user)
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          console.log("Error in signup: ", error.code, ' ', error.message);
        }

      });
      // Show log in screen
    } else {
      console.log('User is already logged in');
      // Show the app
    }

    return (
      <View style={styles.container}>
        <LocationsListView />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('AwesomeProject3', () => AwesomeProject3);
