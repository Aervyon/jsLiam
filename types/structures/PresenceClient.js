import { Client } from 'discord-rpc';
import EventEmitter from 'eventemitter3';
export class PresenceClient extends EventEmitter {
    constructor(config) {
        super();
        this.client = new Client({ transport: 'ipc' });
        this.config = config;
        this.aConf = {};
        this._arrays = [
            'details',
            'largeImageKey',
            'smallImageKey',
            'largeImageText',
            'smallImageText',
            'state',
        ];
    }
    _verifyConf(newConf) {
        const arrays = this._arrays;
        const nConf = newConf || this.config;
        const conf = newConf || this.config;
        for (const key in this.config) {
            if (arrays.includes(key)) {
                if (!Array.isArray(nConf[key]) && typeof nConf[key] === 'string')
                    conf[key] = Array(nConf[key]);
                else if (Array.isArray(nConf[key]) && typeof nConf[key] === 'string')
                    delete conf[key];
            }
            else if (key === 'timestamp' && ![
                true,
                false,
                'now',
            ].includes(nConf[key])) {
                delete conf[key];
            }
            else if (key === 'partySize') {
                if (isNaN(nConf[key])) {
                    delete conf[key];
                    delete conf.maxPartySize;
                }
                else if (!conf.maxPartySize) {
                    delete conf[key];
                    delete conf.maxPartySize;
                }
                else if (nConf[key] > 100) {
                    conf[key] = 100;
                }
                else if (nConf[key] > conf.maxPartySize)
                    conf[key] = conf.maxPartySize;
            }
            else if (key === 'partyMax' && conf.partySize) {
                if (isNaN(nConf[key])) {
                    delete conf[key];
                    delete conf.partySize;
                }
                else if (nConf[key] > 100) {
                    conf[key] = 100;
                }
            }
            else if (key !== 'timestamp') {
                delete conf[key];
            }
        }
        this.config = conf;
        return this.config;
    }
    genRandom(array) {
        if (!Array.isArray(array))
            array = Array(array);
        const item = array[Math.floor(Math.random() * array.length)];
        return item;
    }
    _getConf(newConf) {
        const nConf = {};
        const arrays = this._arrays;
        for (const key in newConf) {
            if (arrays.includes(key)) {
                nConf[key] = this.genRandom(newConf[key]);
            }
            else if (key === 'timestamp') {
                if (newConf[key] === 'now') {
                    nConf.startTimestamp = new Date();
                    this.oldTimestamp = new Date();
                }
                else if (newConf[key] === true) {
                    if (!this.oldTimestamp)
                        this.oldTimestamp = new Date();
                    nConf.startTimestamp = this.oldTimestamp;
                }
                else {
                    delete this.oldTimestamp;
                }
            }
            else
                nConf[key] = newConf[key];
        }
        this.aConf = nConf;
        return this.aConf;
    }
    setPresence(newConf) {
        this.config = this._verifyConf();
        if (!newConf) {
            const eh = this._getConf(this.config);
            return this.client.setActivity(eh);
        }
        newConf = this._verifyConf(newConf);
        const conf = this.config;
        for (const key in newConf) {
            if (newConf[key] !== conf[key]) {
                conf[key] = newConf[key];
            }
        }
        for (const key in conf) {
            if (!newConf[key]) {
                delete conf[key];
            }
        }
        this.config = conf;
        this.aConf = this._getConf(this.config);
        return this.client.setActivity(this.aConf);
    }
    init(clientID) {
        this.cID = clientID;
        this.client.login({ clientId: this.cID });
        this.client.once('ready', this._onReady.bind(this));
    }
    _onReady() {
        this.emit('ready');
        return this.setPresence();
    }
}
export default PresenceClient;
