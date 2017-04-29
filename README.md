# micro-app-notify-client

Simple client to send notifications through SMS and other
means.

The client currently supports sending notifications through
the following:

* [MqttSMSBridge](https://github.com/mhdawson/MqttSMSBridge)
  : SMS notifications
* [Voip.ms](https://voip.ms/): SMS notifications
* [Twilio](https://www.twilio.com/): SMS notifications

The option of using the bridge through the MqttSMSBridge
server is nice because access control is handled by limiting
access to the mqtt server and you don't need to have
SMS provider information (ex Twilio auth info) deployed
with your application. It also means you can centralize
control over how you get notifications. For example, if
you want to change the number to which notificaitons are
sent you only have to change the configuration for the bridge
as opposed to having to reconfigure all applications that
send notifications.

# Usage

To send a notification simply call `sendNotification`.
For example:

```
notify.sendNotification(config, "Hello through SMS");
```

where config is an object with the configuration elements
as specified in the configuration setion and the second
parameter is the message to be sent.

# Configuration

Configuration for the notify client is done through a
`notify` element within the configuration object.
That element can optionally include:

* mqttSmsBridge
* voipms
* twilio

provider entries. If an entry is absent, then that provider
is not used for notifications. If the entry is present
then it should have a field called `enabled`.  If the
value for this field is `true` then a notification
will be send using that provider.

The options for each of the provider entries are:

* mqttSmsBridge
  * enabled - set to true if you want notifications to
    be sent using this provider.
  * serverUrl - url for the mqtt server to which the
    bridge is connected.
  * topic - topic on which the bridge listens for
    notification requests.
  * certs - directory which contains the keys/certs
    required to connect to the mqtt server if the
    url is of type `mqtts`.

* voipms
  * enabled - set to true if you want notifications to
    be sent using this provider.
  * user - voip.ms API userid.
  * password - voip.ms API password.
  * did - voip.ms did(number) from which the SMS will be sent.
  * dst - number to which the SMS will be sent.

* twilio
  * enabled - set to true if you want notifications to
    be sent using this provider.
  * accountSID - twilio account ID.
  * accountAuthToken - twilio auth token.
  * toNumber - number to which the SMS will be sent.
  * fromNumber - number from which the SMS will be sent.

An example of a json file that can be read in to make the
configuration object (with the sensitive bits masked):

```
{
  "notify": {
    "mqttSmsBridge": { "enabled": true,
                       "serverUrl": "mqtts:xxxxxxxxxxxxx:8883",
                       "topic": "house/sms",
                       "certs": "certs-outside" },
    "voipms": { "enabled": false,
                "user": "xxxxxxxxxxx",
                "password": "xxxxxxxx",
                "did": "xxxxxxxxxx",
                "dst": "xxxxxxxxxx" },
    "twilio": { "enabled": false,
                "accountSID": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "accountAuthToken": "XXXXXXXXXXXXXXXXXXX",
                "toNumber": "XXXXXXXXXXX" ,
                "fromNumber": "XXXXXXXXXX" }
  }
}

```

# Installation

Install by running:

```
npm install micro-app-notify-client
```

or

```
npm install https://github.com/mhdawson/micro-app-notify-client.git
```
