import { CronJob } from "cron";
import { connectProxmox } from "../bot/src/configs/functions/proxmox";
import { getPublicIp } from "../functions/getPublicIp";
import { sendWebhook } from "../functions/discord/webhook";

export async function proxmoxJob() {
    
    const ip = await getPublicIp();
    const proxmox = connectProxmox();

    const nodes = await proxmox.nodes.$get();
    const { search, dns1 } = await proxmox.nodes.$(nodes[0].node).dns.$get();

    const proxmoxJob = new CronJob("0 * * * *", async () => {
        if (ip !== dns1) {
            try {
                await proxmox.nodes.$(nodes[0].node).dns.$put({
                    dns1: ip,
                    search: search as string,
                });
                if(process.env.DISCORD_WEBHOOK_URL) {
                    console.log(`[CronJob] > Proxmox DNS record updated!`);
                    await sendWebhook("UPDATED", {
                        dns_name: `Proxmox Node "${nodes[0].node}"`,
                        old_content: dns1,
                        new_content: ip,
                    }).then(() => {
                        console.log(`[Webhook - Proxmox] > Sent "UPDATED" webhook to Discord!`);
                    });
                }
            } catch (error: any) {
                console.log(`[CronJob] > Error updating DNS record: ${error.message}`);
                if(process.env.DISCORD_WEBHOOK_URL) {
                    await sendWebhook("ERROR", {
                        dns_name: `Proxmox Node "${nodes[0].node}"`,
                        error: error.message,
                    }).then(() => {
                        console.log(`[Webhook - Proxmox] > Sent "ERROR" webhook to Discord!`);
                    });
                }
            }
        } else {
            console.log(`[CronJob] > Proxmox DNS record is up to date as of ${new Date().toLocaleString()}!`);
        }
    });
    return proxmoxJob;
}
