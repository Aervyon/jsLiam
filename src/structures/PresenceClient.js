import { Client } from 'discord-rpc';

import EventEmitter from 'eventemitter3';
/**
 * @class PresenceClient
 *
 * Special compatability layer that also makes the code nicer.
 *
 * @author VoidNulll
 */
class PresenceClient extends EventEmitter {
    /**
     *
     * @param {Object} config Default configuration.
     * @param {Array|String} [config.details] Presence details
     * @param {Array|String} [config.state] Presence state
     * @param {Array|String} [config.largeImageKey] Presence large_image
     * @param {Array|String} [config.largeImageText] Presence large_text
     * @param {Array|String} [config.smallImageKey] Presence small_image
     * @param {Array|String} [config.smallImageText] Presence small_text
     * @param {Booleean|String} [config.timestamp=false] Presence startTimestamp. Either true, false, or "now"
     * @param {Number} [config.partySize] Presence partySize
     * @param {Number} [config.partyMax] Presence max party size. Max: 100.
     *
     */
    constructor(config) {
        super(config);
        this.client = new Client( { transport: 'ipc' } );
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

    /**
     * Verifys/fixed any configuration mistakes.. I hope...
     *
     * @param {Object} newConf The optional new config to compare against.
     * @returns {Object} Verified config
     */
    _verifyConf(newConf) {
        const arrays = this._arrays;
        const nConf = newConf || this.config;
        const conf = newConf || this.config;
        for (const key in this.config) {
            if (arrays.includes(key) ) {
                if (!Array.isArray(nConf[key] ) && typeof nConf[key] === 'string') conf[key] = Array(nConf[key] );
                else if (Array.isArray(nConf[key] ) && typeof nConf[key] === 'string') delete conf[key];
            } else if (key === 'timestamp' && ![
                true,
                false,
                'now',
            ].includes(nConf[key] ) ) {
                delete conf[key];
            } else if (key === 'partySize') {
                if (isNaN(nConf[key] ) ) {
                    delete conf[key];
                    delete conf.maxPartySize;
                } else if (!conf.maxPartySize) {
                    delete conf[key];
                    delete conf.maxPartySize;
                } else if (nConf[key] > 100) {
                    conf[key] = 100;
                } else if (nConf[key] > conf.maxPartySize) conf[key] = conf.maxPartySize;
            } else if (key === 'partyMax' && conf.partySize) {
                if (isNaN(nConf[key] ) ) {
                    delete conf[key];
                    delete conf.partySize;
                } else if (nConf[key] > 100) {
                    conf[key] = 100;
                }
            } else if (key !== 'timestamp') {
                delete conf[key];
            }
        }
        this.config = conf;
        return this.config;
    }

    /**
     * Picks a random spot in an array.
     *
     * @param {String|String[]} array Array to randomize
     * @returns {String}
     */
    genRandom(array) {
        if (!Array.isArray(array) ) array = Array(array);
        const item = array[Math.floor(Math.random() * array.length)];

        return item;
    }

    /**
     * Makes the config a *little* nicer...
     *
     * @param {Object} [newConf] New configuration for the app.
     * @retusn {Promise<Object>} The new config;
     */
    _getConf(newConf) {
        const nConf = {};

        const arrays = this._arrays;

        for (const key in newConf) {
            if (arrays.includes(key) ) {
                nConf[key] = this.genRandom(newConf[key] );
            } else if (key === 'timestamp') {
                if (newConf[key] === 'now') {
                    nConf.startTimestamp = new Date();
                    this.oldTimestamp = new Date();
                } else if (newConf[key] === true) {
                    if (!this.oldTimestamp) this.oldTimestamp = new Date();
                    nConf.startTimestamp = this.oldTimestamp;
                } else {
                    delete this.oldTimestamp;
                }
            } else nConf[key] = newConf[key];
        }

        this.aConf = nConf;
        return this.aConf;
    }

    /**
     * Sets/updates the presence. Also updates config.
     *
     * @param {Object} [newConf] New configuration
     * @returns {Promise<object>} The activity
     */
    setPresence(newConf) {
        this.config = this._verifyConf();
        if (!newConf) {
            const eh = this._getConf(this.config);
            return this.client.setActivity(eh);
        }
        newConf = this._verifyConf(newConf);
        const conf = this.config;

        for (const key in newConf) {
            if (newConf[key] !== conf[key] ) {
                conf[key] = newConf[key];
            }
        }
        for (const key in conf) {
            if (!newConf[key] ) {
                delete conf[key];
            }
        }
        this.config = conf;
        const eh = this._getConf(this.config);
        this.aConf = eh;
        return this.client.setActivity(this.aConf);
    }

    /**
     * Function to start the presence
     *
     * @param {String} clientID Your apps client ID
     * @returns void;
     */
    init(clientID) {
        this.cID = clientID;
        this.client.login( { clientId: this.cID } );
        this.client.once('ready', this._onReady.bind(this) );
    }

    /**
     *
     * Private ready event for PresenceClient
     *
     * @memberof PresenceClient
     * @returns void;
     */
    _onReady() {
        this.setPresence();
        this.emit('ready');
    }
}

export default PresenceClient;
