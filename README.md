# jsLiam

jsLiam is a command line Discord RPC client made in TypeScript and built on NodeJS.

## Config keys

Param          | Type(s)               | Required | Description
-------------- | --------------------- | -------- | -----------
clientID       | `String`              | Yes      | Client id of the discord app to connect to
largeImageKey  | `Array` \| `String`   | No       | Presence large image key (The big image)
largeImageText | `Array` \| `String`   | No       | Text that is shown when hovering over the large image
smallImageKey  | `Array` \| `String`   | No       | Small image that is partially inside (bottom right) the large image
smallImageText | `Array` \| `String`   | No       | Text shown when hovering over the small image
details        | `Array` \| `String`   | No       | Text shown below application name
state          | `Array` \| `String`   | No       | Text below details
timestamp      | `Boolean` \| `String` | No       | If set to true, timestamp will be set when the app starts. "now" Resets the timestamp
partySize      | `Number` (Max: 100)   | No       | Displays a number in parenthesis
partyMax       | `Number` (Max: 100)   | No       | Maximum party size.
noUpdate       | `Boolean`             | No       | Whether or not to update the config

## Example configs

Type       | Link
---------- | ----
JavaScript | [Click here](./example.config.js)
JSON       | [Click here](./example.config.json)

## Setup

### Requiremennts

Requirement | Version?
----------- | --------
NodeJS      | 8.0 or later (12.18.3 is recommended)
NPM         |
TypeScript  | Latest, recommended
Git         |
Discord     |

### Installing

- `git clone https://github.com/VoidNulll/jsLiam.js`
- `npm install -g typescript` (Linux: `sudo npm install -g typescript`)
- `npm run setup`

### Running

- `npm run`

### Updating

- `git pull`
- `npm run build`

## Copyright

Copyright VoidNulll 2018-2020
