import { Client } from 'discord-rpc';
import EventEmitter from 'eventemitter3';
export interface conf {
    details?: string | string[];
    largeImageKey?: string | string[];
    smallImageKey?: string | string[];
    largeImageText?: string | string[];
    smallImageText?: string | string[];
    state?: string | string[];
    maxPartySize?: number;
    partySize?: number;
    timestamp?: string | boolean;
}
export interface sConf extends conf {
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
    };
    party?: {
        id: string;
        size: number[];
    };
    instance?: boolean;
}
export declare class PresenceClient extends EventEmitter {
    client: Client;
    config?: conf;
    aConf: conf;
    oldTimestamp?: Date;
    cID?: string;
    private readonly _arrays;
    constructor(config?: conf);
    private _verifyConf;
    genRandom(array: any[] | string): any;
    private _getConf;
    setPresence(newConf?: conf): Promise<Activity | null>;
    init(clientID: string): void;
    private _onReady;
}
export default PresenceClient;
