# Dyno Member Presence

A simple rich presence i made for the people of the dyno server. Repurpose it if you wish.

I built this rich presence app to be customizable and lightweight at the same time, by making it so you can just use the terminal and notepad to edit it

## Required things

- NodeJS 8.0.0+
- A text editor that can handle JSON files (if you want to set it up differently), notepad will work just fine.
- Terminal access

## Getting started

- First install all dependencies (one) by running `npm install` (in the applications directory) in the terminal or by running the `install.bat` file (windows)

- Then check if it works by doing `npm start` (in the applications directory) in the terminal or by running the `start.bat` file (windows)

- You can configure it by using a file named `config.json` in the root of the application.

## A warning for if you use pm2

Know what pm2 does, and how to use it if you want to use pm2. If you are using pm2 you should know how to reload the application, start the application, stop the application, and view the logs for the application

## Features

- A hot reloadable configuration file. If you want to reload the configuration file, just type `refresh` into your terminal (unless of course you are using pm2)

- Easy configuration. The configuration keys are below, and are easy to understand (most of the time).

- Everything is able to be disabled.

## Configuration keys

`clientId` - (optional) The clientId of the discord developers application you want to use (Can be changed once app is running by saying `refreshclient` to the terminal)

`staticQuote` - (optional) Makes the quote static, but the quote needs to be a string. If the quote is not a string, it will error out. Allowed values: `true` - Makes the quote static, `false` (useless) Does nothing, the quotes rotate (quotes must be a array for this)

`timestamp` - (optional) Whether or not you want a beginning timestamp. Allowed values: `true`, or `"true"` - Makes sure the timestamp is on. `"now"` - Resets the timestamp to the current date when you refresh, rewrites your config and makes a backup called "oldConfig.json" Default: `true`

`defaultQuotes` - (optional) Whether or not you want the default quotes on. Allowed values: `'false'` - Disables the default quotes. Default: `true`

`quotes` - (optional) Additional quotes (unless `defaultQuotes` is `'false'`). Can be a single quote if `"staticQuote"` is `true` Example: `[ "ping", "pong" ]`, `"Pong!"`

`largeImageKey` - (optional) The large image of the presence. Example: `"largeImageKey": "trees"`, `"largeImageKey": "[ "trees", "city" ]"`, `"largeImageKey": "disable"`. Default: `"dyno"`

`largeImageText` - (optional) The large images text. Example: `"largeImageText": "Oh hey, some trees!"`. Default: `null`/Does not exist

`smallImageKey` - (optional) The small image of the presence. Will not work if no large image! Example: `"smallImageKey": "ice"`, `"smallImageKey": "[ "ice", "snow" ]"`, `"smallImageKey": "disable"`. Default: `"dynoglitch"`

`smallImageText` - (optional) The small images text. Example: `"smallImageText": "Your as cold as ice."`. Default: `null`/Does not exist

`state` - (optional) A static state, must be a string. Example: `"state": "We are always lurking..."`. Default: `null`/Does not exist

## Want to git rid of the small or large image?

all you simply need to do is put `"disable"` after the key you want to disable. Example: `"smallImageKey": "disable"`

### There is a example configuration file called `example.config.json`.

 If you are going to set something as `false`, `undefined`, `0`, or `null`, just remove the key. It is useless anyways if you set it to one of those.

 - There is `altExample.config.json` to show a example of a alternate configuration

## If you want your own application that you control

- Go to [the Discord Developer Dashboard](https://discordapp.com/developers/applications/me)
- Create a new application
- Add some art assets under `Rich Presence` > `Art Assets` (you can have 150, and they must be atleast 512x512)
- Get the applications clientId
- Enter it (the clientID) into the config.json file
- Go ham with customization

Notice! Your application name will be your rich presence's name!