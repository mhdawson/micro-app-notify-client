// Copyright 2016-2017 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.
"use strict";

const fs = require('fs');
const https = require('https');
const mqtt = require('mqtt');
const path = require('path');
const twilio = require('twilio');

const sendSmsMessageVoipms = function(config, info) {
  if ((config.notify !== undefined) &&
      (config.notify.voipms !== undefined) &&
      (config.notify.voipms.enabled)) {
    var options = { host: 'voip.ms',
                    port: 443,
                    method: 'GET',
                    path: '/api/v1/rest.php?' + 'api_username=' + config.notify.voipms.user + '&' +
                                                'api_password=' + config.notify.voipms.password + '&' +
                                                'method=sendSMS' + '&' +
                                                'did=' + config.notify.voipms.did + '&' +
                                                'dst=' + config.notify.voipms.dst + '&' +
                                                'message=' + encodeURIComponent(info)
                   };
    var request = https.request(options, function(res) {
      if (res.statusCode !== 200) {
        console.log('Failed to send voipms sms, status:' + res.statusCode);
      }
    });
    request.end();
  }
}

const sendSmsMessageTwilio = function(config, info) {
  if ((config.notify !== undefined) &&
      (config.notify.twilio !== undefined) &&
      (config.notify.twilio.enabled)) {
    var twilioClient = new twilio.RestClient(config.notify.twilio.accountSID,
                                             config.notify.twilio.accountAuthToken);
    twilioClient.sendMessage({
      to: config.notify.twilio.toNumber,
      from: config.notify.twilio.fromNumber,
      body: info
    }, function(err, message) {
      if (err) {
       console.log('Failed to send twilio sms:' + err.message);
      }
    });
  }
};

var mqttClient;
const sendSmsMessageMqttBridge = function(config, info) {
  if ((config.notify !== undefined) &&
      (config.notify.mqttSmsBridge !== undefined) &&
      (config.notify.mqttSmsBridge.enabled)) {
    if (mqttClient === undefined) {
      let mqttOptions;
      if (config.notify.mqttSmsBridge.serverUrl.indexOf('mqtts') > -1) {
        const certsPath = config.notify.mqttSmsBridge.certs;
        mqttOptions = { key: fs.readFileSync(path.join(__dirname, certsPath, '/client.key')),
                        cert: fs.readFileSync(path.join(__dirname, certsPath, '/client.cert')),
                        ca: fs.readFileSync(path.join(__dirname, certsPath, '/ca.cert')),
                        checkServerIdentity: function() { return undefined }
        }
      }
      mqttClient = mqtt.connect(config.notify.mqttSmsBridge.serverUrl, mqttOptions);
    }
    mqttClient.publish(config.notify.mqttSmsBridge.topic, info);
  }
}

const sendNotification = function(config, info) {
  sendSmsMessageMqttBridge(config, info);
  sendSmsMessageTwilio(config, info);
  sendSmsMessageVoipms(config, info);
}

const end = function() {
  if (mqttClient !== undefined) {
    mqttClient.end();
  }
}

module.exports.sendNotification = sendNotification;
module.exports.end = end;
