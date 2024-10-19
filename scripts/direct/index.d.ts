interface BridgeEvent {
    subscribe(callback: () => void): () => void;
    unsubscribe(callback: () => void): void;
    readonly name: string;
}
/**Event fired when the connection is ready and messages can be sent to discord.*/
interface DirectInitializeEventSignal extends BridgeEvent {
}
interface BridgeDirectEvents {
    directInitialize: DirectInitializeEventSignal;
}
/**
 * Embed object, according to discord format.
 * For more details @see https://discord.com/developers/docs/resources/message#embed-object
 */
interface DirectEmbed {
    title?: string;
    description?: string;
    color?: number;
}
declare class BridgeDirect {
    #private;
    constructor();
    /**Returns true if the connection is ready and messages can be sent to discord*/
    get ready(): boolean;
    /**
     * Send a message to discord
     * @throws {Error} throws if the initialize event hasn't been fired yet
     * @param message body of the message
     * @param author title of the message
     * @param picture url to a picture to be displayed as discord pfp for the message
     */
    sendMessage(message: string, author?: string, picture?: string): void;
    /**
     * Send a custom embed to discord.
     * @param embed embed object, according to discord API
     * @param author title of the message
     * @param picture url to a picture to be displayed as discord pfp for the message
     */
    sendEmbed(embed: DirectEmbed, author?: string, picture?: string): void;
    events: BridgeDirectEvents;
}
export declare const bridgeDirect: BridgeDirect;
export {};
