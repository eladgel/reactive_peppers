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

// var User = Parse.Object.extend("User");
// var _User = Parse.Object.extend("_User");

var LocationsListView = React.createClass({
	mixins: [ParseReact.Mixin],
  getInitialState: function() {
    var locationsDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      locationsDataSource: locationsDataSource,//ds.cloneWithRows(this._genRows({})),
      userLocations: undefined,
    };
  },

	observe: function(props, state) {
	  var locationsQuery = Parse.User.current().relation('channels').query();//(new Parse.Query('Location')).ascending('city');
    var userQuery = (new Parse.Query('_User')).include('locations').equalTo('objectId', Parse.User.currentAsync().id)
	  // var locationsQuery = (new Parse.Query('User')).ascending('city');
	  return { 
	  	locations: locationsQuery,
	  	localUser: ParseReact.currentUser,
      user: userQuery
	  };
	},

  _pressData: ({}: {[key: number]: boolean}),

  componentWillMount: function() {
    this._pressData = {};
  },

  render: function() {
    if (this.data.localUser === undefined) {
      return (
          <Text>Loading...</Text>
        );
      // Still waiting
    } else if (this.data.localUser === null) {
      // Show log in screen
      return (
          <Text>Loading...</Text>
        );
    } else {
      if (this.state.userLocations === undefined) {
        var that = this;
        var currentUser = Parse.User.current();
        // console.log('currentUser is ', currentUser);

        var q = new Parse.Query('User');
        q.equalTo('objectId', currentUser.id);
        q.find().then(function(user) {
          if (user.length > 0) {
            user = user[0];
          } else {
            return;
          }
          // console.log('searched for user and found: ', user);

          var relation = user.relation('locations');
          // console.log('found user` locations relation: ', relation);

          return relation.query().find();
        }, function() {console.log('error: ', arguments);}).then(function(locations) {

          that.setState({userLocations: locations})
          // console.log('user` locations: ', locations);
        });

        var relation = new Parse.Relation(currentUser, 'locations');//currentUser.relation('locations');
        relation.query().find({
          success: function(results) {
            console.log('results from relation: ', results);
            this.setState({userLocations: results});
          }.bind(this),
          error: function() {
            console.log('blach; ', arguments[0]);
          }
        });
        return (
          <Text>Loading...</Text>
        );
      } else {

      }
      // Show the app
    }
  	// var currentUserPromise = Parse.User.currentAsync();
  	// console.log('ParseReact is: ', ParseReact);
  	// console.log('ParseReact.currentUser is: ', ParseReact.currentUser);
  	// currentUserPromise.then(function(user) {
  		// console.log('user in render is: ', this.data.localUser);
  	// });
// console.log('locations is ', this.data.locations);
    // var flattenedLocations = this.data.locations.forEach(function(location) {console.log('flattening location, location is - ', location);});// location.toPlainObject()});
    return (
        <ListView
          dataSource={this.state.locationsDataSource.cloneWithRows(this.data.locations)}
          renderRow={this._renderRow}
          scrollEnabled={true}
          contentContainerStyle={styles.list}
          style={styles.list}
        />
    );
  },

/* @flow */
  _renderRow: function(rowData: Parse.Object, sectionID: number, rowID: number) {
// console.log('renderRow - rowID is ', rowID);
// console.log('renderRow - rowData.objectId is ', rowData.objectId);
    var rowHash = Math.abs(hashCode(rowData));
    var imgSource = {
      uri: THUMB_URLS[rowHash % THUMB_URLS.length],
    };
    // {/*rowData.selected ? '#aaaaff' : '#dddddd'*/}
    return (
      <TouchableHighlight onPress={() => this._pressRow(rowData.objectId)}>
        <View>
          <View style={styles.row}>
            <Icon 
            	name="fontawesome|check"
            	size={30}
            	color={(this.state.userLocations.indexOf(rowData) !== -1) ? '#5555ff' : '#dddddd'}
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

  // _genRows: function(pressData: {[key: number]: boolean}): Array<Object> {
  // 	// console.log(this.data.locations);
  // 	return this.data.locations;
  //   var dataBlob = [];
  //   for (var ii = 0; ii < 100; ii++) {
  //   	var isSelected = pressData[ii] ? true : false;
  //     var pressedText = pressData[ii] ? ' (pressed)' : '';
  //     var rowData = {title: 'Row ' + ii, selected: isSelected};
  //     dataBlob.push(rowData);
  //   }
  //   return dataBlob;
  // },

  _pressRow: function(locationID: string) {
    // this._pressData[rowID] = !this._pressData[rowID];
console.log('Parse.User.current() is ', Parse.User.current());
console.log('Parse.User.current().relation is ', Parse.User.current().relation);
console.log('Parse.User.current().relation("locations") is ', Parse.User.current().relation('locations'));
var location = new Parse.Object.extend('Location');
location.id = locationID;
var relation = Parse.User.current().relation('locations');
var filteredLocations = this.state.userLocations.filter(function(filteredLocation) {
  return (filteredLocation.id == locationID)
});
if (filteredLocations.length > 0) {
  relation.remove(location);
} else {
  relation.add(location)  
}
Parse.User.current().save();
debugger;
return;
    var userLocations = this.data.localUser.relation('locations');
    console.log('user relations: ', userLocations);
    // userLocations.
    // this.setState({chosenLocations: })

    // this.setState({locationsDataSource: this.state.locationsDataSource.cloneWithRows(
      // this._genRows(this._pressData)
    // )});
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
