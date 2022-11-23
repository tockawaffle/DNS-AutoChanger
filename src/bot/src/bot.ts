import "dotenv/config"
import { clientOptions, wokOptions } from "./configs/bot/client";
import { startJobOnInit } from "./configs/functions/cloudflare";
import { connectMongoDB } from "./configs/db/db";
import { Client } from "discord.js";
import { connectProxmox } from "./configs/functions/proxmox";
import WOK from "wokcommands";

export const client = new Client(clientOptions); wokOptions.client=client;

import {getProxmoxDNS} from "./configs/functions/proxmox";

(async () => {
    await connectMongoDB();
    client.on("ready", async () => {
        new WOK(wokOptions);
        console.log(
            `[Bot] > Bot started as "${
                client.user!.tag
            }"`
        );
        client.proxmox = connectProxmox();
        await startJobOnInit(client);
    });

    client.login(process.env.BOT_TOKEN);
})();
