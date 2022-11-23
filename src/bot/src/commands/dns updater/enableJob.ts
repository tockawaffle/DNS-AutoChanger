import { CommandObject, CommandType } from "wokcommands";
import { enableJob } from "../../configs/commands/enableJob";
import { CommandInteraction, Client } from "discord.js";

export default {
    description: "Enables a job from the /jobs list.",
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        {
            name: "job",
            description:
                "The job to be activated/deactivated. Use the command /jobs to see the available jobs.",
            type: 3,
            choices: [
                {
                    name: "cloudflare",
                    value: "cloudflare",
                },
                {
                    name: "proxmox",
                    value: "proxmox",
                },
            ],
            required: true,
        },
        {
            name: "status",
            description: "The status of the job, either true or false.",
            type: 3,
            choices: [
                {
                    name: "online",
                    value: "online",
                },
                {
                    name: "offline",
                    value: "offline",
                },
            ],
            required: true,
        },
    ],
    ownerOnly: true,
    callback: async ({
        client,
        args,
        interaction,
    }: {
        client: Client;
        args: string[];
        interaction: CommandInteraction;
    }) => {
        const jobName = args[0] as "cloudflare" | "proxmox";
        const jobStatus = args[1] as "online" | "offline";
        switch (jobName) {
            case "cloudflare": {
                const upd = await enableJob(
                    "cloudflare_updater",
                    jobStatus,
                    client
                );
                return interaction.reply(upd);
            }
            case "proxmox": {
                const upd = await enableJob(
                    "proxmox_updater",
                    jobStatus,
                    client
                );
                return interaction.reply(upd);
            }
        }
    },
} as CommandObject;
