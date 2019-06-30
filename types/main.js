import PresenceClient from './structures/PresenceClient.js';
import fs from 'fs';
import Events from 'eventemitter3';
const ee = new Events;
console.log('Initiating...');
let type = 'js';
if (!fs.existsSync('./config.js'))
    type = 'json';
if (!fs.existsSync('./config.json') && type === 'json') {
    ee.emit('exit');
    throw Error('Config file not found. Exiting.');
}
const config = require(`../config.${type}`);
let conf = config;
const PClient = new PresenceClient(config);
PClient.init(config.clientId);
let prevtype = type;
function updateConfig() {
    let ntype = 'js';
    if (!fs.existsSync('./config.js'))
        ntype = 'json';
    if (!fs.existsSync('./config.json') && ntype === 'json') {
        ee.emit('exit');
        throw Error('Config file not found. Exiting');
    }
    delete require.cache[require.resolve(`../config.${prevtype}`)];
    const file = require(`../config.${ntype}`);
    if (file.noUpdate || file === conf)
        return;
    conf = file;
    prevtype = ntype;
    return PClient.setPresence(file);
}
ee.on('exit', () => {
    setTimeout(process.exit, 1000);
});
const fivemin = 300000;
setInterval(updateConfig, fivemin);
PClient.on('ready', () => {
    console.log('Initiated!');
});
