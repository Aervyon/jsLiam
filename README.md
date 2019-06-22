# jsLiam 2.0

jsLiam is a discord rich presence application that is very lightweight.


jsLiam 2.0 is handled by its own special client that works as a compatability layer between discord-rpc and the developer.

# Config

You can use either js or json for configs now. Yay!

**If it is in <code>[]</code> it is optional**

| Param | Type(s) | Description

[config.largeImageKey] | <code>Array</code> | <code>String</code> | The presence largeImageKey
[config.largeImageText] | <code>Array</code> | <code>String</code> | The presence largeImageText
[config.lsmallImageKey] | <code>Array</code> | <code>String</code> | The presence smallImageKey
[config.smallImageText] | <code>Array</code> | <code>String</code> | The presence smallImageText
[config.state] | <code>Array</code> | <code>String</code> | The presences state.
[config.details] | <code>Array</code> | <code>String</code> | The presence details
[config.timestamp] | <code>Boolean</code> | <code>String</code> | <code>False</code> | Whether or not to have a timestamp. "now" will reset the timestamp.
[config.partySize] | <code>Number</code> | The party size. Max: 1000.
[config.partyMax] | <code>Number</code> | The maximum party size. Max: 100
[config.noUpdate] <code>Boolean</code> | Whether or not to update the config.
config.clientId | <code>String</code> | The client ID for the app you will be using with the presence.

# How strict is jsLiam?

This new version is fairly strict compared to the old one. You can take a look at most of the code in [src/structures/PresenceClient.js](./src/structures/PresenceClient.js).

# Example configs

You can view a JS and a JSON example config under [example.config.json](./example.config.json) (json) or [example.config.js](./example.config.js) (JS)

# Setup

Requiremennts

- Nodejs (8+)
- NPM/YARN
- Discord
- Internet access

# Notes

jsLiam NO LONGER comes pre setup. You have to build your own app. Kthx bai. Might change my mind on this.

# Copyright

Copyright VoidNulll 2018-2019
