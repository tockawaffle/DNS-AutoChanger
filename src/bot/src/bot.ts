import "dotenv/config"
import { clientOptions, wokOptions } from "./configs/bot/client";
import { connectMongoDB } from "./configs/db/db";
import { Client } from "discord.js";
import WOK from "wokcommands";

export const client = new Client(clientOptions); wokOptions.client=client;

(async () => {
    await connectMongoDB();
    client.on("ready", async () => {
        new WOK(wokOptions);
        console.log(
            `[Bot] > Bot started as "${
                client.user!.tag
            }"`
        );
    });

    client.login(process.env.BOT_TOKEN);
})();
