declare module "client" {
    export = Client;
    /**
     * Eyeson API provides communication with the video conferencing service.
     */
    class Client {
        /**
         * @typedef {object} ClientOptions
         * @prop {string} hostname
         * @prop {string} [apiKey]
         */
        /**
         * @param {ClientOptions} clientOptions
         */
        constructor({ apiKey, hostname }: {
            hostname: string;
            apiKey?: string;
        });
        options: {
            hostname: string;
            headers: {
                'Content-Type': string;
            };
        };
        /** @private */
        private _request;
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
     */
    class User {
        /**
         * @typedef {import('./client')} Client
         */
        /**
         * @param {object} data
         * @param {Client} client
         */
        constructor(data: object, client: import("client"));
        /**
         * Raw data from the create/join request
         */
        data: any;
        api: import("client");
        /**
         * @returns {string} accessKey
         */
        get accessKey(): string;
        /**
         * @returns {string} guestToken
         */
        get guestToken(): string;
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
         * @returns {Promise<void>}
         */
        waitReady(): Promise<void>;
        /**
         * Send chat message
         * @see https://docs.eyeson.com/docs/rest/references/messages
         * @param {string} content
         * @returns {Promise}
         */
        chat(content: string): Promise<any>;
        /**
         * Send custom message
         * @see https://docs.eyeson.com/docs/rest/references/messages
         * @param {string} content
         * @returns {Promise}
         */
        sendCustomMessage(content: string): Promise<any>;
        /**
         * Start recording
         * @see https://docs.eyeson.com/docs/rest/references/recording
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
         * @see https://docs.eyeson.com/docs/rest/references/broadcast
         * @param {string} stream_url - Stream URL
         * @returns {Promise}
         */
        startBroadcast(stream_url: string): Promise<any>;
        /**
         * Stop broadcast
         * @returns {Promise}
         */
        stopBroadcast(): Promise<any>;
        /**
         * @typedef {Array<number|string>} MapEntry
         * @prop {number} x
         * @prop {number} y
         * @prop {number} width
         * @prop {number} height
         * @prop {'auto'|'contain'|'cover'} [objectFit]
         *
         * @typedef {object} AudioInsertPosition
         * @prop {number} [x]
         * @prop {number} [y]
         *
         * @typedef {object} LayoutOptions
         * @prop {'auto'|'custom'} [layout]
         * @prop {string} [name]
         * @prop {string|Array<MapEntry>} [map]
         * @prop {Array<string>} [users]
         * @prop {boolean} [show_names]
         * @prop {boolean} [voice_activation]
         * @prop {'enabled'|'disabled'|'audio_only'} [audio_insert]
         * @prop {AudioInsertPosition} [audio_insert_position]
         */
        /**
         * Set layout
         * @see https://docs.eyeson.com/docs/rest/references/layout
         * @param {LayoutOptions} options - Layout options
         * @returns {Promise}
         */
        setLayout(options: {
            layout?: 'auto' | 'custom';
            name?: string;
            map?: string | Array<(string | number)[]>;
            users?: Array<string>;
            show_names?: boolean;
            voice_activation?: boolean;
            audio_insert?: 'enabled' | 'disabled' | 'audio_only';
            audio_insert_position?: {
                x?: number;
                y?: number;
            };
        }): Promise<any>;
        /**
         * @typedef {object} LayerInsert
         * @prop {string} [icon] - url of icon
         * @prop {string} [title]
         * @prop {string} [content]
         *
         * @typedef {object} LayerOptions
         * @prop {string} [url]
         * @prop {LayerInsert} [insert]
         * @prop {1|-1|'1'|'-1'} [z-index] - "-1" for background or "1" (default) for foreground position
         */
        /**
         * Set layer
         * @see https://docs.eyeson.com/docs/rest/references/layers
         * @param {LayerOptions} options - Layer options
         * @returns {Promise}
         */
        setLayer(options: {
            url?: string;
            insert?: {
                /**
                 * - url of icon
                 */
                icon?: string;
                title?: string;
                content?: string;
            };
            /**
             * - "-1" for background or "1" (default) for foreground position
             */
            "z-index"?: 1 | -1 | '1' | '-1';
        }): Promise<any>;
        /**
         * @typedef {object} EyesonLayer
         * @prop {Function} createBuffer
         */
        /**
         * Send layer
         * @see https://docs.eyeson.com/docs/rest/references/layers
         * @param {Buffer|EyesonLayer} buffer - Layer object or image file buffer
         * @param {1|-1|'1'|'-1'} [zIndex] - Foreground = 1, background = -1, default: 1
         * @param {'png'|'jpg'} [imageType] - image type of buffer, default "png"
         * @returns {Promise}
         */
        sendLayer(buffer: Buffer | {
            createBuffer: Function;
        }, zIndex?: 1 | -1 | '1' | '-1', imageType?: 'png' | 'jpg'): Promise<any>;
        /**
         * Clear layer
         * @param {1|-1|'1'|'-1'} [zIndex] - Foreground = 1, background = -1, default: 1
         * @returns {Promise}
         */
        clearLayer(zIndex?: 1 | -1 | '1' | '-1'): Promise<any>;
        /**
         * @typedef {object} PlaybackEntry
         * @prop {string} url - Hosted MP4/WEBM video or MP3 audio file
         * @prop {boolean} [audio] - default false
         * @prop {string} [play_id] - identifier, e.g. current timestamp or use a custom layout position identifier
         * @prop {string} [replacement_id] - User-id of the participant's video to be replaced
         * @prop {string} [name] - Custom readable name for identification
         * @prop {number} [loop_count] - Number of repetitions. Set -1 for infinite loop. Default: 0
         *
         * @typedef {object} PlaybackOptions
         * @prop {PlaybackEntry} playback
         */
        /**
         * Start playback
         * @see https://docs.eyeson.com/docs/rest/references/playbacks
         * @param {PlaybackOptions|PlaybackEntry} options - Playback options
         * @returns {Promise}
         */
        startPlayback(options: {
            /**
             * - Hosted MP4/WEBM video or MP3 audio file
             */
            url: string;
            /**
             * - default false
             */
            audio?: boolean;
            /**
             * - identifier, e.g. current timestamp or use a custom layout position identifier
             */
            play_id?: string;
            /**
             * - User-id of the participant's video to be replaced
             */
            replacement_id?: string;
            /**
             * - Custom readable name for identification
             */
            name?: string;
            /**
             * - Number of repetitions. Set -1 for infinite loop. Default: 0
             */
            loop_count?: number;
        } | {
            playback: {
                /**
                 * - Hosted MP4/WEBM video or MP3 audio file
                 */
                url: string;
                /**
                 * - default false
                 */
                audio?: boolean;
                /**
                 * - identifier, e.g. current timestamp or use a custom layout position identifier
                 */
                play_id?: string;
                /**
                 * - User-id of the participant's video to be replaced
                 */
                replacement_id?: string;
                /**
                 * - Custom readable name for identification
                 */
                name?: string;
                /**
                 * - Number of repetitions. Set -1 for infinite loop. Default: 0
                 */
                loop_count?: number;
            };
        }): Promise<any>;
        /**
         * Stop playback by play_id
         * @see https://docs.eyeson.com/docs/rest/references/playbacks#stop-playback
         * @param {string} play_id
         * @returns {Promise}
         */
        stopPlayback(play_id: string): Promise<any>;
        /**
         * Create snapshot
         * @see https://docs.eyeson.com/docs/rest/references/snapshot
         * @returns {Promise}
         */
        snapshot(): Promise<any>;
        /**
         * Lock meeting
         * @see https://docs.eyeson.com/docs/rest/references/lock
         * @returns {Promise}
         */
        lockMeeting(): Promise<any>;
        /**
         * Stop meeting
         * @returns {Promise}
         */
        stopMeeting(): Promise<any>;
    }
}
declare module "observer" {
    export class Observer {
        /**
         * @typedef {object} ObserverOptions
         * @prop {string} hostname
         * @prop {string} apiKey
         */
        /**
         * @param {ObserverOptions} observerOptions
         */
        constructor({ hostname, apiKey }: {
            hostname: string;
            apiKey: string;
        });
        url: string;
        options: {
            headers: {
                Authorization: string;
            };
        };
        /**
         * Create new connection to a room/meeting
         * @param {string} roomId - Specific room/meeting identifier
         * @returns {ObserverConnection}
         */
        connect(roomId: string): ObserverConnection;
    }
    /**
     * Observer room/meeting connection, extends EventEmitter
     * emits connected, disconnected, event events
     * @extends EventEmitter
     */
    export class ObserverConnection extends EventEmitter<[never]> {
        /**
         * @param {string} url
         * @param {object} [websocketOptions] - pass additional connection options supported by ws
         */
        constructor(url: string, websocketOptions?: object);
        state: string;
        ready: boolean;
        /** @private */
        private _cable;
        /** @private */
        private _init;
        /** @private */
        private _onConnected;
        /** @private */
        private _onDisconnected;
        /** @private */
        private _onMessage;
        /**
         * Close connection
         */
        close(): void;
    }
    import EventEmitter = require("events");
}
declare module "eyeson-node" {
    export = Eyeson;
    /**
     * Class Eyeson
     */
    class Eyeson {
        /**
         * @typedef {object} EyesonConfig
         * @prop {string} apiKey
         */
        /**
         * @param {EyesonConfig} config
         */
        constructor(config: {
            apiKey: string;
        });
        api: Client;
        /**
         * Meeting observer
         * emits "connected", "disconnected", and "event"
         * Events can be found here:
         * @see https://docs.eyeson.com/docs/category/meeting-observer
         */
        observer: observer.Observer;
        /**
         * @typedef {object} UserParameters
         * @prop {string} [id] - custom user id, if empty, a random id will be assigned
         * @prop {string} [avatar] - url
         *
         * @typedef {object} AudioInsertPosition
         * @prop {number} [x]
         * @prop {number} [y]
         *
         * @typedef {object} CustomFieldOptions
         * @prop {string} [locale] - User preferred language code ('en', 'de', 'fr').
         * @prop {string} [logo] - URL to custom logo.
         * @prop {boolean} [hide_chat] - Hide chat in GUI. Default: false
         * @prop {boolean} [virtual_background] - Enable Virtual Background selection. Default: false
         * @prop {boolean} [virtual_background_allow_guest] - Enable Virtual Background selection for Guest users. Default: false
         * @prop {string} [virtual_background_image] - Provide a custom Virtual Background image for selection.
         *
         * @typedef {object} MeetingOptions
         * @prop {boolean} [show_names] - Show display names in video. Default: true
         * @prop {boolean} [show_label] - Show Eyeson logos in GUI. Default: true
         * @prop {string} [exit_url] - Exit destination, URL for exit button in GUI
         * @prop {boolean} [recording_available] - Allow recordings. Default: true
         * @prop {boolean} [broadcast_available] - Allow broadcasting. Default: true
         * @prop {boolean} [reaction_available] - Show gif media inserts in GUI. Default: true
         * @prop {boolean} [layout_available] - Allow layout updates. Default: true
         * @prop {boolean} [guest_token_available] - Provide guest token. Default: true
         * @prop {boolean} [lock_available] - Enable meeting lock. Default: false
         * @prop {boolean} [kick_available] - Allow participant kick. Default: true
         * @prop {'disabled'|'screencast'|'ptp'} [sfu_mode] - Set a desired sfu mode. Default: 'ptp'
         * @prop {boolean} [widescreen] - Run meeting in widescreen mode (16:9 aspect ratio). Default: false
         * @prop {string} [background_color] - Set meeting background color as hex RGB. Default: '#121212'
         * @prop {'enabled'|'disabled'|'audio_only'} [audio_insert] - Show audio insert. Default: 'audio_only'
         * @prop {AudioInsertPosition} [audio_insert_position] - Position of the audio insert.
         * @prop {CustomFieldOptions & Record<string, any>} [custom_fields]
         *
         * @typedef {object} MeetingParameters
         * @prop {string} [name] - room name
         * @prop {UserParameters} [user]
         * @prop {MeetingOptions} [options]
         */
        /**
         * Create a new meeting or join an existing by roomId
         * @see https://docs.eyeson.com/docs/rest/references/room
         * @param {string} username - Display name of the user
         * @param {string|null} [roomId] - If not set, a random id will be returned
         * @param {MeetingParameters} [params] - { name: ..., user: {...}, options: {...} }
         * @returns {Promise<User>}
         */
        join(username: string, roomId?: string | null, params?: {
            /**
             * - room name
             */
            name?: string;
            user?: {
                /**
                 * - custom user id, if empty, a random id will be assigned
                 */
                id?: string;
                /**
                 * - url
                 */
                avatar?: string;
            };
            options?: {
                /**
                 * - Show display names in video. Default: true
                 */
                show_names?: boolean;
                /**
                 * - Show Eyeson logos in GUI. Default: true
                 */
                show_label?: boolean;
                /**
                 * - Exit destination, URL for exit button in GUI
                 */
                exit_url?: string;
                /**
                 * - Allow recordings. Default: true
                 */
                recording_available?: boolean;
                /**
                 * - Allow broadcasting. Default: true
                 */
                broadcast_available?: boolean;
                /**
                 * - Show gif media inserts in GUI. Default: true
                 */
                reaction_available?: boolean;
                /**
                 * - Allow layout updates. Default: true
                 */
                layout_available?: boolean;
                /**
                 * - Provide guest token. Default: true
                 */
                guest_token_available?: boolean;
                /**
                 * - Enable meeting lock. Default: false
                 */
                lock_available?: boolean;
                /**
                 * - Allow participant kick. Default: true
                 */
                kick_available?: boolean;
                /**
                 * - Set a desired sfu mode. Default: 'ptp'
                 */
                sfu_mode?: 'disabled' | 'screencast' | 'ptp';
                /**
                 * - Run meeting in widescreen mode (16:9 aspect ratio). Default: false
                 */
                widescreen?: boolean;
                /**
                 * - Set meeting background color as hex RGB. Default: '#121212'
                 */
                background_color?: string;
                /**
                 * - Show audio insert. Default: 'audio_only'
                 */
                audio_insert?: 'enabled' | 'disabled' | 'audio_only';
                /**
                 * - Position of the audio insert.
                 */
                audio_insert_position?: {
                    x?: number;
                    y?: number;
                };
                custom_fields?: {
                    /**
                     * - User preferred language code ('en', 'de', 'fr').
                     */
                    locale?: string;
                    /**
                     * - URL to custom logo.
                     */
                    logo?: string;
                    /**
                     * - Hide chat in GUI. Default: false
                     */
                    hide_chat?: boolean;
                    /**
                     * - Enable Virtual Background selection. Default: false
                     */
                    virtual_background?: boolean;
                    /**
                     * - Enable Virtual Background selection for Guest users. Default: false
                     */
                    virtual_background_allow_guest?: boolean;
                    /**
                     * - Provide a custom Virtual Background image for selection.
                     */
                    virtual_background_image?: string;
                } & Record<string, any>;
            };
        }): Promise<User>;
        /**
         * Get user object by accessKey
         * @param {string} accessKey
         * @returns {Promise<User>}
         */
        getUser(accessKey: string): Promise<User>;
        /**
         * @typedef {object} GuestUserParamsCustomFields
         * @prop {string} locale - User preferred language code (en, de, fr)
         *
         * @typedef {object} GuestUserParams
         * @prop {string} [id] - User identifier
         * @prop {string} [avatar] - 	URL to a user avatar
         * @prop {GuestUserParamsCustomFields & Record<string, any>} custom_fields
         */
        /**
         * Register guest user
         * @see https://docs.eyeson.com/docs/rest/references/user#register-guest-user
         * @param {string} username - Users name to be displayed in participants list
         * @param {string} guestToken - guest token of the meeting
         * @param {GuestUserParams} [params]
         * @returns {Promise<User>}
         */
        registerGuest(username: string, guestToken: string, params?: {
            /**
             * - User identifier
             */
            id?: string;
            /**
             * - 	URL to a user avatar
             */
            avatar?: string;
            custom_fields: {
                /**
                 * - User preferred language code (en, de, fr)
                 */
                locale: string;
            } & Record<string, any>;
        }): Promise<User>;
        /**
         * Get snapshot data
         * @see https://docs.eyeson.com/docs/rest/references/snapshot#retrieve-snapshot
         * @param {string} snapshotId
         * @returns {Promise<object>}
         */
        getSnapshot(snapshotId: string): Promise<object>;
        /**
         * Retrieve list of all snapshots of a certain room
         * @see https://docs.eyeson.com/docs/rest/references/snapshot#retrieve-list-of-all-snapshots-of-a-certain-room
         * @param {string} room_id
         * @param {number} [page] - Fetch next set of recordings (limit is 25)
         * @param {string} [started_at] - ISO8601 Timestamp. Filter for a certain room instance (compare to started_at in room response)
         * @returns {Promise<Array<object>>}
         */
        getRoomSnapshots(room_id: string, page?: number, started_at?: string): Promise<Array<object>>;
        /**
         * Delete snapshot
         * @param {string} snapshotId
         * @returns {Promise}
         */
        deleteSnapshot(snapshotId: string): Promise<any>;
        /**
         * Get recording data
         * @see https://docs.eyeson.com/docs/rest/references/recording#retrieve-recording
         * @param {string} recordingId
         * @returns {Promise<object>}
         */
        getRecording(recordingId: string): Promise<object>;
        /**
         * Retrieve list of all recordings of a certain room
         * @see https://docs.eyeson.com/docs/rest/references/recording#retrieve-list-of-all-recordings-of-a-certain-room
         * @param {string} room_id
         * @param {number} [page] - Fetch next set of recordings (limit is 25)
         * @param {string} [started_at] - ISO8601 Timestamp. Filter for a certain room instance (compare to started_at in room response)
         * @returns {Promise<Array<object>>}
         */
        getRoomRecordings(room_id: string, page?: number, started_at?: string): Promise<Array<object>>;
        /**
         * Delete recording
         * @param {string} recordingId
         * @returns {Promise}
         */
        deleteRecording(recordingId: string): Promise<any>;
    }
    import Client = require("client");
    import observer = require("observer");
    import User = require("user");
}
