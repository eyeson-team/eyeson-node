declare module "client" {
    export = Client;
    /**
     * Eyeson API provides communication with the video conferencing service.
     */
    class Client {
        constructor({ apiKey, hostname }: {
            apiKey: any;
            hostname: any;
        });
        options: {
            hostname: any;
            headers: {
                'Content-Type': string;
            };
        };
        _request(params: any, data: any): Promise<any>;
        /**
         * GET request
         * @param {string} path - API endpoint
         * @returns {Promise}
         */
        get(path: string): Promise<any>;
        /**
         * POST request
         * @param {string} path - API endpoint
         * @param {object} data - Payload
         * @returns {Promise}
         */
        post(path: string, data: object): Promise<any>;
        /**
         * PUT request
         * @param {string} path - API endpoint
         * @param {object} data - Payload
         * @returns {Promise}
         */
        put(path: string, data: object): Promise<any>;
        /**
         * DELETE request
         * @param {string} path - API endpoint
         * @returns {Promise}
         */
        delete(path: string): Promise<any>;
    }
}
declare module "user" {
    export = User;
    /**
     * User wraps the meeting access and information, and provides methods to
     * interact with a meeting.
     * @param {object} data
     * @param {Client} client
     */
    class User {
        constructor(data: any, client: any);
        /**
         * Raw data from the create/join request
         */
        data: any;
        api: any;
        /**
         * @returns {string} accessKey
         */
        get accessKey(): string;
        /**
         * @returns {string} roomId
         */
        get roomId(): string;
        /**
         * @returns {boolean} ready
         */
        get ready(): boolean;
        /**
         * Using async promise here to shorten the code a lot... ensuring everything
         * is in a try catch block is a must-have here.
         * @returns {Promise}
         */
        waitReady(): Promise<any>;
        /**
         * Send chat message
         * @param {string} content
         * @returns {Promise}
         */
        chat(content: string): Promise<any>;
        /**
         * Start recording
         * @returns {Promise}
         */
        startRecording(): Promise<any>;
        /**
         * Stop recording
         * @returns {Promise}
         */
        stopRecording(): Promise<any>;
        /**
         * Start broadcast
         * @param {string} url - Stream URL
         * @returns {Promise}
         */
        startBroadcast(url: string): Promise<any>;
        /**
         * Stop broadcast
         * @returns {Promise}
         */
        stopBroadcast(): Promise<any>;
        /**
         * Set layout
         * @see https://docs.eyeson.com/docs/rest/references/layout
         * @param {object} options - Layout options
         * @returns {Promise}
         */
        setLayout(options: object): Promise<any>;
        /**
         * Set layer
         * @see https://docs.eyeson.com/docs/rest/references/layers
         * @param {object} options - Layer options
         * @returns {Promise}
         */
        setLayer(options: object): Promise<any>;
        /**
         * Clear layer
         * @param {1|-1|'1'|'-1'} [index] - Foreground = 1, background = -1, default: 1
         * @returns {Promise}
         */
        clearLayer(index?: 1 | -1 | '1' | '-1'): Promise<any>;
        /**
         * Start playback
         * @see https://docs.eyeson.com/docs/rest/references/playbacks
         * @param {object} options - Playback options
         * @returns {Promise}
         */
        startPlayback(options: object): Promise<any>;
        /**
         * Stop meeting
         * @returns {Promise}
         */
        stopMeeting(): Promise<any>;
    }
}
declare module "observer" {
    export = Observer;
    class Observer {
        constructor({ hostname, apiKey }: {
            hostname: any;
            apiKey: any;
        });
        url: string;
        options: {
            headers: {
                Authorization: any;
            };
        };
        /**
         * Create new connection to a room/meeting
         * @param {string} roomId - Specific room/meeting identifier
         * @returns {Connection}
         */
        connect(roomId: string): Connection;
    }
    /**
     * Observer room/meeting connection, extends EventEmitter
     * emits connected, disconnected, event events
     * @param {string} url
     * @param {object} options
     * @returns {Connection}
     */
    class Connection extends EventEmitter {
        constructor(url: any, options: any);
        state: string;
        ready: boolean;
        _cable: import("@anycable/core").Cable;
        _init(url: any, options: any): Promise<void>;
        _onConnected(): void;
        _onDisconnected(reason: any): void;
        _onMessage(message: any): void;
        /**
         * Close connection
         */
        close(): void;
    }
    import EventEmitter = require("events");
}
declare module "eyeson-node" {
    export = Eyeson;
    class Eyeson {
        constructor(config: any);
        api: Client;
        /**
         * Meeting observer
         * emits "connected", "disconnected", and "event"
         * Events can be found here:
         * @see https://docs.eyeson.com/docs/category/meeting-observer
         */
        observer: Observer;
        /**
         * Create a new meeting or join an existing by roomId
         * @see https://docs.eyeson.com/docs/rest/references/room
         * @param {string} username - Display name of the user
         * @param {string} [roomId] - If not set, a random id will be returned
         * @param {object} [params] - { name: ..., user: {...}, options: {...} }
         * @returns {Promise<User>}
         */
        join(username: string, roomId?: string, params?: object): Promise<User>;
    }
    import Client = require("client");
    import Observer = require("observer");
    import User = require("user");
}
