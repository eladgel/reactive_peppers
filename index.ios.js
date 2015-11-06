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

  render: function() {
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
