import { CommandObject, CommandType } from "wokcommands";
import { cloudflare_updater } from "../../configs/functions/cloudflare";
import { enableJob } from "../../configs/commands/enableJob";
import jobSchema from "../../configs/db/schemas/jobSchema";
import {
    User,
    CommandInteraction,
    GuildMember,
    PermissionsBitField,
} from "discord.js";
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
        args,
        interaction,
    }: {
        args: string[];
        interaction: CommandInteraction;
    }) => {
        const jobName = args[0] as "cloudflare" | "proxmox";
        const jobStatus = args[1] as "online" | "offline";
        console.log(jobName, jobStatus);
        switch(jobName) {
            case "cloudflare": {
                if (jobStatus === "online") {
                    await enableJob(jobName, jobStatus);
                }
            }
        }

    },
} as CommandObject;