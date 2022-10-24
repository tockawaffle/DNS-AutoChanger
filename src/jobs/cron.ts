//await update_dns_record(process.env.CF_ZONE_ID as string,"e29b7711942a126a6798cfc5ea11c37e", "A", "ip.guarufix.com", "200.200.200.200", 1, false)
import { CronJob } from "cron";

import { update_dns_record } from "../functions/cloudflare/client/update_dns_record";
import { getIp } from "../functions/getIp";
import { getIpDns } from "../functions/cloudflare/getIpDns";
import { sendWebhook } from "../functions/discord/webhook";

import "dotenv/config";



console.log("Starting DNS update job");
const job = new CronJob("* * * * *", async () => {
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
                        `Error updating DNS record: ${response.data.errors[0].message}`
                    );
                } else {
                    console.log(`DNS record updated successfully!`);
                    await sendWebhook("UPDATED", {dns_name: name, old_content: content, new_content: ip});
                }
            } catch (error: any) {
                console.log(`Error updating DNS record: ${error}`);
                await sendWebhook("ERROR", {dns_name: name, error: error});
            }
        } else {
            console.log("DNS record is up to date");
        }
    } catch (error: any) {
        if (error.message.includes("ENOTFOUND")) {
            console.log(
                "Error getting IP: You might be offline, retrying next minute"
            );
        } else {
            console.log(`Error getting IP: ${error.message}`);
            await sendWebhook("ERROR", {error: error});
        }
    }
});
job.start();
