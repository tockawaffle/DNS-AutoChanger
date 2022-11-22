import {update_dns_record} from "../../../../functions/cloudflare/client/update_dns_record";
import { dns_records } from "../../../../functions/cloudflare/client/dns_records";
import { CronJob } from "cron";
import { getIpDns } from "../../../../functions/cloudflare/getIpDns";
import { getIp } from "../../../../functions/getIp";
import { Client, EmbedBuilder, GuildChannel, TextChannel } from "discord.js";
import jobSchema from "../db/schemas/jobSchema";

export async function cfJob(client: Client) {
    const cfJob = new CronJob("*/30 * * * *", async () => {
        const ip = await getIp()
        const { id, name, type, content, proxied, ttl, zone_id } = await getIpDns(process.env.DNS_NAME as string)
        const channel = client.guilds.cache.get(process.env.SERVER_ID as string)?.channels.cache.get(process.env.LOG_CHANNEL_ID as string) as GuildChannel as TextChannel
        if(ip !== content) {
            try {
                const response = await update_dns_record(zone_id, id, type, name, ip, ttl, proxied)
                if(response.data.success !== true) {
                    return channel.send({
                        embeds: [
                            new EmbedBuilder({
                                title: `**Error updating DNS record:** ${name}`,
                                description: response.data.errors[0].message,
                            }).setColor("Red")
                        ]
                    })
                } else {
                    return channel.send({
                        embeds: [
                            new EmbedBuilder({
                                title: `**DNS Record ${name} was updated!**`,
                                description: `Old IP: ${content}\nNew IP: ${ip}`,
                            }).setColor("Green")
                        ]
                    })
                }
            } catch(err) {
                console.log(err)
            }
        } else {
            return channel.send({
                embeds: [
                    new EmbedBuilder({
                        title: `**DNS record is up to date as of ${new Date().toLocaleString()}**`,
                        description: `No changes made!`,
                    }).setColor("Random")
                ]
            })
        }
    })
    return cfJob
}

export async function startJobOnInit(client: Client) {
    const job = await jobSchema.findOne({ _id: "cron", },);
    if(job!.cloudflare_updater === true) {
        const cJob = await cfJob(client);
        console.log(`[Cron] > Starting job "cloudflare_updater"`);
        cJob.start();
    } else {
        const cJob = await cfJob(client);
        cJob.stop();
        console.log(`[Cron] > Job "cloudflare_updater" is disabled.`);
    }
}