import PresenceClient, { Activity } from './structures/PresenceClient.js';
import { existsSync } from 'fs';
import { EventEmitter } from 'events';
const ee = new EventEmitter();
console.log('Initiating...');

let type = <string> 'js';

if (!existsSync('./config.js') ) {
    type = 'json';
}
if (!existsSync('./config.json') && type === 'json') {
    ee.emit('exit');
    throw Error('Config file not found. Exiting.');
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(`../config.${type}`);
let conf = config;

const PClient = new PresenceClient(config);

PClient.init(config.clientId);

let prevtype = <string> type;

function updateConfig(): Promise<Activity | void | null> {
    let ntype = <string> 'js';

    if (!existsSync('./config.js') ) {
        ntype = 'json';
    }
    if (!existsSync('./config.json') && ntype === 'json') {
        ee.emit('exit');
        throw Error('Config file not found. Exiting');
    }
    delete require.cache[require.resolve(`../config.${prevtype}`)]; // eslint-disable-next-line @typescript-eslint/no-var-requires
    const file = require(`../config.${ntype}`);

    if (file.noUpdate || file === conf) {
        return Promise.resolve();
    }

    conf = file;
    prevtype = ntype;
    return PClient.setPresence(file);
}

ee.on('exit', () => {
    setTimeout(process.exit, 1000);
} );

const fivemin = 300000;

setInterval(updateConfig, fivemin);

PClient.on('ready', () => {
    console.log('Initiated!');
} );
