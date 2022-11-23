import {update_dns_record} from "../../../../functions/cloudflare/client/update_dns_record";
import { CronJob } from "cron";
import { getIpDns } from "../../../../functions/cloudflare/getIpDns";
import { getIp } from "../../../../functions/getIp";
import { proxmoxJob } from "./proxmox";
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
                                author: {
                                    name: client.user!.username,
                                    iconURL: client.user!.displayAvatarURL()
                                },
                                title: `**Error updating DNS record:** ${name}`,
                                description: response.data.errors[0].message,
                            }).setColor("Red").setImage("https://preview.redd.it/qlbz5kaucva51.jpg?auto=webp&s=36752e06b38e90bfd94ca0186163dbd338a4d7e5")
                        ]
                    })
                } else {
                    return channel.send({
                        embeds: [
                            new EmbedBuilder({
                                author: {
                                    name: client.user!.username,
                                    iconURL: client.user!.displayAvatarURL()
                                },
                                title: `**DNS Record ${name} was updated!**`,
                                description: `Old IP: ${content}\nNew IP: ${ip}`,
                            }).setColor("Green").setImage("https://preview.redd.it/qlbz5kaucva51.jpg?auto=webp&s=36752e06b38e90bfd94ca0186163dbd338a4d7e5")
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
                        author: {
                            name: client.user!.username,
                            iconURL: client.user!.displayAvatarURL()
                        },
                        title: `**DNS Record:**`,
                        description: `The record ${name} is up to date (As of ${new Date().toLocaleString()})\nNo changes made!`,
                    }).setColor("Random").setImage("https://preview.redd.it/qlbz5kaucva51.jpg?auto=webp&s=36752e06b38e90bfd94ca0186163dbd338a4d7e5")
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

    if(job!.proxmox_updater === true) {
        const pJob = await proxmoxJob(client);
        pJob.start();
        console.log(`[Cron] > Starting job "proxmox_updater"`);
    } else {
        const pJob = await proxmoxJob(client);
        pJob.stop();
        console.log(`[Cron] > Job "proxmox_updater" is disabled.`);
    }
}