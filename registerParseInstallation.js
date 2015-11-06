/* @flow */
"use strict";
// Not published on npm! use this fork https://github.com/gpbl/react-native-device-info
var DeviceInfo = require('react-native-device-info');

const PARSE_URL = "https://api.parse.com/1/installations";

var localConfig = require('./local-config.json');

const PARSE_APP_ID = localConfig.PARSE_APP_ID;//"JpbyZnZrf0nrlL0093X6bk5HUBzIGRdQ6By7OrsR";
const PARSE_JS_KEY = localConfig.PARSE_JS_KEY;//"leXA88bUoh9GhvNMHFyY6MNUi2sOXsVDGjLuUA7a";
const PARSE_REST_KEY = localConfig.PARSE_REST_KEY;//"y8rkVSTxfL3RyE8dhWc97QlhYsstrTKMcMwLPS6h";

function registerParseInstallation(pushToken) {
  console.log('registering device token in parse: ', pushToken);
  const data = {

    appIdentifier: DeviceInfo.appIdentifier,
    appName: DeviceInfo.appName,
    // appVersion: DeviceInfo.appBuildNumber,
    appShortVersion: DeviceInfo.appVersion,
    deviceToken: pushToken,
    deviceType: "ios",
    installationId: DeviceInfo.installationId,
    localeIdentifier: DeviceInfo.localeIdentifier,
    parseVersion: "1.9.0",
    timeZone: DeviceInfo.timeZone

  };
// debugger;
  return fetch(PARSE_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "X-Parse-Application-Id": PARSE_APP_ID,
      "X-Parse-REST-API-Key": PARSE_REST_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  })
  .then(objectId => {
    console.log("Parse Installation registered successfully with objectId=%s", objectId);
    return objectId;
  })

}

module.exports = registerParseInstallation;
