# Dyno Member Presence

A simple rich presence i made for the people of the dyno server. Repurpose it if you wish.

## Required things

- NodeJS 8.0.0+
- A text editor that can handle JSON files (if you want to set it up differently), i think notepad wouldd work just fine.
- Terminal access

## Getting started

- First install all dependencies (one) by running `npm install`

- Then check if it works by doing `npm start`

- You can config it by using a file named `config.json` in the root of the application.

## Things to not do

- Do not use pm2. It makes it so you cannot reload, load, or unload (depending on if the config file exists) the config once the app is started

## Features

- A hot reloadable configuration file. If you want to reload the configuration file, just type `refresh` into your terminal

- Easy configuration. The configuration keys are below, and are easy to understand (most of the time).

## Configuration keys

`clientId` - (optional) The clientId of the discord developers application you want to use (Cannot be changed once app is running)

`timestamp` - (optional) Whether or not you want a beginning timestamp. Allowed values: `true`, or `'true'` - Makes sure the timestamp is on. Default: `true`

`defaultQuotes` - (optional) Whether or not you want the default quotes on. Allowed values: `'false'` - Disables the default quotes. Default: `true`

`quotes` - (optional) Additional quotes (unless `defaultQuotes` is `'false'`). Example: `[ "ping", "pong" ]`

`largeImageKey` - (optional) The large image of the presence. Example: `"largeImageKey": "trees"`. Default: `"dyno"`

`largeImageText` - (optional) The large images text. Example: `"largeImageText": "Oh hey, some trees!"`. Default: `null`/Does not exist

`smallImageKey` - (optional) The small image of the presence. Will not work if no large image! Example: `"smallImageKey": "ice"`. Default: `"dynoglitch"`

`smallImageText` - (optional) The small images text. Example: `"smallImageText": "Your as cold as ice."`. Default: `null`/Does not exist

### There is a example configuration file called `example.config.json`.

 If you are going to set something as `false`, `undefined`, `0`, or `null`, just remove the key. It is useless anyways if you set it to one of those.
