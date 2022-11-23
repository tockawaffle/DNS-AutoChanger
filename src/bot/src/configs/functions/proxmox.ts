import proxmoxApi, { ProxmoxEngine } from "proxmox-api";
import { Client, EmbedBuilder, GuildChannel, TextChannel } from "discord.js";
import { getIp } from "../../../../functions/getIp";
import { CronJob } from "cron";

export function connectProxmox() {
    const engine = new ProxmoxEngine({
        host: process.env.PROXMOX_HOST as string,
        tokenID: process.env.PROXMOX_TOKEN_ID as string,
        tokenSecret: process.env.PROXMOX_TOKEN_SECRET as string,
    });
    const proxmox = proxmoxApi(engine);
    return proxmox;
}

async function getProxmoxNode(client: Client) {
    const nodes = await client.proxmox.nodes.$get()
    return nodes
}

export async function getProxmoxDNS(client: Client) {
    const nodes = await getProxmoxNode(client)
    const dns = await client.proxmox.nodes.$(nodes[0].node).dns.$get()
    return dns
}

export async function proxmoxJob(client: Client) {
    const ip = await getIp()
    const {search, dns1} = await getProxmoxDNS(client)
    const nodes = await getProxmoxNode(client)
    const channel = client.guilds.cache.get(process.env.SERVER_ID as string)?.channels.cache.get(process.env.LOG_CHANNEL_ID as string) as GuildChannel as TextChannel
    const proxmoxJob = new CronJob("*/30 * * * *", async() => {
        if(ip !== dns1) {
            try {
                await client.proxmox.nodes.$(nodes[0].node).dns.$put({
                    dns1: ip,
                    search: search as string
                })
                return channel.send({
                    embeds: [
                        new EmbedBuilder({
                            author: {
                                name: client.user!.username,
                                iconURL: client.user!.displayAvatarURL()
                            },
                            title: `**Proxmox Updated!**`,
                            description: `Old IP: ${dns1}\nNew IP: ${ip}`,
                        }).setColor("Red").setImage("https://preview.redd.it/qlbz5kaucva51.jpg?auto=webp&s=36752e06b38e90bfd94ca0186163dbd338a4d7e5")
                    ]
                })
            } catch (error: any) {
                return channel.send({
                    embeds: [
                        new EmbedBuilder({
                            author: {
                                name: client.user!.username,
                                iconURL: client.user!.displayAvatarURL()
                            },
                            title: `**Error updating DNS record:** ${name}`,
                            description: error.message,
                        }).setColor("Red").setImage("https://preview.redd.it/qlbz5kaucva51.jpg?auto=webp&s=36752e06b38e90bfd94ca0186163dbd338a4d7e5")
                    ]
                })
            }
        } else {
            return channel.send({
                embeds: [
                    new EmbedBuilder({
                        author: {
                            name: client.user!.username,
                            iconURL: client.user!.displayAvatarURL()
                        },
                        title: `**Proxmox DNS Record!**`,
                        description: `The DNS record is up to date as of ${new Date().toLocaleString()}`,
                    }).setColor("Red").setImage("https://preview.redd.it/qlbz5kaucva51.jpg?auto=webp&s=36752e06b38e90bfd94ca0186163dbd338a4d7e5")
                ]
            })
        }
    })
    return proxmoxJob
}