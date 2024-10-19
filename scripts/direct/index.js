import { system, world } from "@minecraft/server";
class BridgeEventSignal {
    #name;
    #callbacks = new Map();
    constructor(event_name) {
        this.#name = event_name;
    }
    get name() {
        return this.#name;
    }
    subscribe(callback) {
        this.#callbacks.set(callback, callback);
        return callback;
    }
    unsubscribe(callback) {
        this.#callbacks.delete(callback);
    }
    async emit(params, ...args) {
        for (const callback of this.#callbacks.values()) {
            try {
                await callback(params, ...args);
            }
            catch (err) {
                throw new Error(`BridgeEvent error for ${this.#name} event:\n${err}`);
            }
        }
        return params;
    }
}
;
class BridgeDirect {
    #dimension;
    #ready = false;
    constructor() {
        this.#dimension = world.getDimension("overworld");
        system.afterEvents.scriptEventReceive.subscribe((e) => {
            if (e.id === "discord:ready") {
                this.#ready = true;
                this.events.directInitialize.emit();
            }
        });
    }
    /**Returns true if the connection is ready and messages can be sent to discord*/
    get ready() {
        return this.#ready;
    }
    /**
     * Send a message to discord
     * @throws {Error} throws if the initialize event hasn't been fired yet
     * @param message body of the message
     * @param author title of the message
     * @param picture url to a picture to be displayed as discord pfp for the message
     */
    sendMessage(message, author, picture) {
        if (this.#ready) {
            this.#dimension.runCommand("scriptevent discord:message " + JSON.stringify({ message: message, author: author, picture: picture ?? "https://i.imgur.com/9y8IvBG.png" }));
        }
        else
            throw new Error("BridgeDirect: you cannot send a message while the bridge is not ready");
    }
    /**
     * Send a custom embed to discord.
     * @param embed embed object, according to discord API
     * @param author title of the message
     * @param picture url to a picture to be displayed as discord pfp for the message
     */
    sendEmbed(embed, author, picture) {
        if (this.#ready)
            this.#dimension.runCommand("scriptevent discord:embed" + JSON.stringify({
                author: author,
                embed: embed,
                picture: picture
            }));
        else
            throw new Error("BridgeDirect: you cannot send an embed while the bridge is not ready");
    }
    events = {
        directInitialize: new BridgeEventSignal("directInitialize")
    };
}
export const bridgeDirect = new BridgeDirect();
