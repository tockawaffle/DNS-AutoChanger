import { CronJob } from "cron";

import { update_dns_record } from "../functions/cloudflare/client/update_dns_record";
import { getIp } from "../functions/getIp";
import { getIpDns } from "../functions/cloudflare/getIpDns";
import { sendWebhook } from "../functions/discord/webhook";

import "dotenv/config";

console.log("[CronJob] > Starting DNS update job");
const job = new CronJob("0 * * * *", async () => {
    try {
        const ip = await getIp();
        const { id, name, type, content, proxied, ttl, zone_id } =
            await getIpDns(process.env.DNS_NAME as string);
        if (content !== ip) {
            try {
                const response = await update_dns_record(
                    zone_id,
                    id,
                    type,
                    name,
                    ip,
                    ttl,
                    proxied
                );
                if (response.data.success !== true) {
                    console.log(
                        `[CronJob] > Error updating DNS record: ${response.data.errors[0].message}`
                    );
                } else {
                    console.log(
                        `[CronJob] > The DNS Record ${name} was updated at ${new Date().toLocaleString()}!`
                    );
                    if (process.env.DISCORD_WEBHOOK_URL) {
                        return await sendWebhook("UPDATED", {
                            dns_name: name,
                            old_content: content,
                            new_content: ip,
                        });
                    }
                }
            } catch (error: any) {
                console.log(`[CronJob] > Error updating DNS record: ${error}`);
                if (!process.env.DISCORD_WEBHOOK) return;
                await sendWebhook("ERROR", { dns_name: name, error: error });
            }
        } else {
            console.log(
                `[CronJob] > DNS record is up to date as of ${new Date().toLocaleString()}`
            );
        }
    } catch (error: any) {
        if (error.message.includes("ENOTFOUND")) {
            console.log(
                "[CronJob] > Error getting IP: You might be offline, retrying next minute"
            );
        } else {
            console.log(`[CronJob] > Something went wrong: ${error.message}\nFull error: ${error}`);
            await sendWebhook("ERROR", { error: error });
        }
    }
});
job.start();
