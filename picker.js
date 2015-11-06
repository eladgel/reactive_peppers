/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * @flow
 */
'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var uuid = require('uuid'); // uuid.v4()

var {
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} = React;

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var { Icon, } = require('react-native-icons');
var ParseReact = require('parse-react/react-native');

var localConfig = require('./local-config.json');

const PARSE_APP_ID = localConfig.PARSE_APP_ID;
const PARSE_JS_KEY = localConfig.PARSE_JS_KEY;
const PARSE_REST_KEY = localConfig.PARSE_REST_KEY;

Parse.initialize(
  PARSE_APP_ID,
  PARSE_JS_KEY
);

var LocationsListView = React.createClass({
	mixins: [ParseReact.Mixin],
  getInitialState: function() {
    var locationsDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      locationsDataSource: locationsDataSource,//ds.cloneWithRows(this._genRows({})),
    };
  },

	observe: function(props, state) {
	  var locationsQuery = (new Parse.Query('Location')).ascending('city');
	  // var locationsQuery = (new Parse.Query('User')).ascending('city');
	  return { 
	  	locations: locationsQuery,
	  	user: ParseReact.currentUser,
	  };
	},

  _pressData: ({}: {[key: number]: boolean}),

  componentWillMount: function() {
    this._pressData = {};
  },

  render: function() {
  	// var currentUserPromise = Parse.User.currentAsync();
  	// console.log('ParseReact is: ', ParseReact);
  	// console.log('ParseReact.currentUser is: ', ParseReact.currentUser);
  	// currentUserPromise.then(function(user) {
  		// console.log('user in render is: ', this.data.user);
  	// });
    return (
        <ListView
          dataSource={this.state.locationsDataSource.cloneWithRows(this._genRows({}))}
          renderRow={this._renderRow}
          scrollEnabled={true}
          contentContainerStyle={styles.list}
          style={styles.list}
        />
    );
  },

/* @flow */
  _renderRow: function(rowData: Object, sectionID: number, rowID: number) {
    var rowHash = Math.abs(hashCode(rowData));
    var imgSource = {
      uri: THUMB_URLS[rowHash % THUMB_URLS.length],
    };
    // {/*rowData.selected ? '#aaaaff' : '#dddddd'*/}
    return (
      <TouchableHighlight onPress={() => this._pressRow(rowID)}>
        <View>
          <View style={styles.row}>
            <Icon 
            	name="fontawesome|check"
            	size={30}
            	color={rowData.selected ? '#5555ff' : '#dddddd'}
            	style={styles.checkIcon}
            	/>
            {/*<Image style={styles.thumb} source={imgSource} />*/}
            <Text style={styles.text}>
              {rowData.city + ' - '}
            </Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  },

  _genRows: function(pressData: {[key: number]: boolean}): Array<Object> {
  	// console.log(this.data.locations);
  	return this.data.locations;
    var dataBlob = [];
    for (var ii = 0; ii < 100; ii++) {
    	var isSelected = pressData[ii] ? true : false;
      var pressedText = pressData[ii] ? ' (pressed)' : '';
      var rowData = {title: 'Row ' + ii, selected: isSelected};
      dataBlob.push(rowData);
    }
    return dataBlob;
  },

  _pressRow: function(rowID: number) {
    this._pressData[rowID] = !this._pressData[rowID];
    this.setState({locationsDataSource: this.state.locationsDataSource.cloneWithRows(
      this._genRows(this._pressData)
    )});
  },
});

var THUMB_URLS = [
'https://avatars0.githubusercontent.com/u/12009179?v=3&s=96', 
	'https://avatars1.githubusercontent.com/u/1254783?v=3&s=96', 
	'https://avatars2.githubusercontent.com/u/2464966?v=3&s=96'
];
// var LOREM_IPSUM = 'Lorem ipsum dolor sit amet, ius ad pertinax oportere accommodare, an vix civibus corrumpit referrentur. Te nam case ludus inciderint, te mea facilisi adipiscing. Sea id integre luptatum. In tota sale consequuntur nec. Erat ocurreret mei ei. Eu paulo sapientem vulputate est, vel an accusam intellegam interesset. Nam eu stet pericula reprimique, ea vim illud modus, putant invidunt reprehendunt ne qui.';

/* eslint no-bitwise: 0 */
var hashCode = function(str) {
  var hash = 15;
  for (var ii = str.length - 1; ii >= 0; ii--) {
    hash = ((hash << 5) - hash) + str.charCodeAt(ii);
  }
  return hash;
};

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    width: windowSize.width,
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 10
  },
  checkIcon: {
    // flex: 1,
    // justifyContent: 'flex-start',
    // flexDirection: 'row',
    // flexWrap: 'nowrap',
    width: 20,
    height: 20,
    // backgroundColor: 'green',
    padding: 14
  },
});

module.exports = LocationsListView;
