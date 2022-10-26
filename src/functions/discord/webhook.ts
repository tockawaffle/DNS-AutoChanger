import { EmbedBuilder, WebhookClient } from "discord.js";

export async function sendWebhook(type: "UPDATED" | "ERROR", data: {dns_name?: string, old_content?: string, new_content?: string, error?: string}) {
    let embed: EmbedBuilder,
        name: string = process.env.WEBHOOK_NAME as string || "DNS Updater";
    if(type === "UPDATED") {
        embed = new EmbedBuilder()
            .setTitle("DNS Record Updated")
            .setDescription(`The DNS record for **${data.dns_name}** was updated from **${data.old_content}** to **${data.new_content}**`)
            .setAuthor({
                name
            })
            .setColor("Random")
            .setFooter({
                text: `Updated at ${new Date().toLocaleString()}`
            })
            .setImage("https://i.imgflip.com/63yh6t.jpg")
    } else if (type === "ERROR") {
        embed = new EmbedBuilder()
            .setTitle("DNS Record Error")
            .setDescription(`An error occurred while updating the DNS record for **${data.dns_name}**`)
            .setAuthor({
                name
            })
            .setColor("Random")
            .setFooter({
                text: `Updated at ${new Date().toLocaleString()}`
            })
            .setImage("https://i.imgflip.com/63yh6t.jpg")
    } else return;

    try {
        const webhook = new WebhookClient({
            url: process.env.DISCORD_WEBHOOK as string
        })
        await webhook.edit({
            name
        })
        await webhook.send({
            embeds: [embed]
        })
    } catch (error) {
        console.log(
            `Error sending webhook: ${error}`
        )
    }

    
}

