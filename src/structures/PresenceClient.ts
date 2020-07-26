import { Client } from 'discord-rpc';

import { EventEmitter } from 'events';

export interface conf {
    details?: string | string[];
    largeImageKey?: string | string[];
    smallImageKey?: string | string[];
    largeImageText?: string | string[];
    smallImageText?: string | string[];
    state?: string | string[];
    partyMax?: number;
    partySize?: number;
    timestamp?: string | boolean;
}

export interface sConf extends conf {
    startTimestamp?: Date;
}

export interface ActConf {
    details?: string;
    largeImageKey?: string;
    smallImageKey?: string;
    largeImageText?: string;
    smallImageText?: string;
    state?: string;
    partyMax?: number;
    partySize?: number;
    startTimestamp?: Date;
}

export interface Activity {
    timestamps?: {
        start?: Date;
        end?: Date;
    };
    secrets?: {
        match?: string;
        join?: string;
        spectate?: string;
    };
    details?: string;
    assets?: {
        large_image?: string;
        small_image?: string;
        small_text?: string;
        large_text?: string;
    }
    party?: {
        id?: string;
        size: number[];
    }
    instance?: boolean;
}

class PResenceClient extends EventEmitter {
    public client: Client;

    public config!: conf;

    public aConf: conf;

    public oldTimestamp?: Date;

    public cID?: string;

    private readonly _arrays: string[];

    constructor(config: conf) {
        super();
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

    private _verifyConf(newConf?: conf): conf {
        const arrays = this._arrays;
        const nConf = newConf || this.config;
        const conf = newConf || this.config;
        for (const key in this.config) {
            // @ts-ignore
            if (arrays.includes(key) ) {
                // @ts-ignore
                if (!Array.isArray(nConf[key] ) && typeof nConf[key] === 'string') conf[key] = Array(nConf[key] ); // @ts-ignore
                else if (Array.isArray(nConf[key] ) && typeof nConf[key] === 'string') delete conf[key];
            } else if (key === 'timestamp' && ![
                true,
                false,
                'now',
                // @ts-ignore
            ].includes(nConf[key] ) ) {
                delete conf[key];
            } else if (key === 'partySize') { // @ts-ignore

                if (isNaN(nConf[key] ) && isNaN(Number(nConf[key]) ) ) {
                    delete conf[key];
                    delete conf.partyMax;
                } else if (!nConf.partyMax) {
                    delete conf[key];
                } else if (isNaN(nConf.partyMax) && isNaN(Number(nConf.partyMax) ) ) {
                    delete conf[key];
                    delete conf.partyMax;
                } else {
                    // @ts-ignore
                    if (isNaN(nConf[key] ) ) {
                        nConf[key] = Number(nConf[key] );
                    } // @ts-ignore
                    if (isNaN(nConf.partyMax) ) {
                        nConf.partyMax = Number(nConf[key] );
                    }
                    // @ts-ignore
                    if (nConf[key] > 100) {
                        conf[key] = 100;
                    } else {
                        conf[key] = nConf[key];
                    }
                    if (nConf.partyMax > 100) {
                        conf.partyMax = 100;
                    } else {
                        conf.partyMax = nConf.partyMax;
                    }
                }
            } else if (key !== 'partyMax') { // @ts-ignore
                delete conf[key];
            }
        }
        this.config = conf;
        return this.config;
    }

    _toActivity(newConf?: conf): ActConf {
        const conf = this._verifyConf(newConf);
        const activity = <ActConf> {};

        const actMap = {
            largeImageKey: 'large_image',
            largeImageText: 'large_text',
            smallImageText: 'small_text',
            smallImageKey: 'small_image',
        }

        for (const key in conf) { // @ts-ignore
            if (actMap[key]) {
                // @ts-ignore
                activity[key] = Array.isArray(conf[key] ) ? this.genRandom(conf[key] ) : conf[key]; // @ts-ignore
            } else if (Array.isArray(conf[key] ) ) { // @ts-ignore
                activity[key] = this.genRandom(conf[key] );
            } else if (key === 'timestamp') {
                if (conf.timestamp === 'now') {
                    this.oldTimestamp = new Date();
                    activity.startTimestamp = this.oldTimestamp;
                } else if (conf.timestamp) {
                    activity.startTimestamp = this.oldTimestamp;
                } else {
                    activity.startTimestamp = undefined;
                }
            } else { // @ts-ignore
                activity[key] = conf[key];
            }
        }
        return <ActConf> activity;
    }

    public genRandom(array: any[] | string): any {
        if (!Array.isArray(array) ) array = Array(array);
        const item = array[Math.floor(Math.random() * array.length)];

        return item;
    }

    public async setPresence(newConf?: conf): Promise<Activity|null> {
        this.config = this._verifyConf(newConf);
        const eh = this._toActivity(this.config);
        console.log(eh);
        return this.client.setActivity(eh);
    }

    public init(clientID: string): void {
        this.cID = clientID;
        this.client.login( { clientId: this.cID } );
        this.client.once('ready', this._onReady.bind(this) );
    }

    private _onReady(): Promise<Activity|null> {
        this.emit('ready');
        return this.setPresence();
    }
}

export default PResenceClient;