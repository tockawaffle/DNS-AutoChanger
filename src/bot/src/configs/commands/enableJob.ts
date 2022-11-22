import { Client } from "discord.js";
import jobSchema from "../db/schemas/jobSchema";
import { cfJob } from "../functions/cloudflare";

export async function enableJob(jobName: string, jobStatus: string, client: Client) {
    console.log(jobName)
    const job = await jobSchema.findOne({ _id: "cron", },);
    console.log(job);

    let status: boolean;
    if (jobStatus === "online") status = true;
    else status = false;

    if(jobName === "cloudflare_updater") {
        job!.cloudflare_updater = status;
        await job!.save();
        if(jobStatus === "online") {
            const cJob = await cfJob(client);
            cJob.start();
        } else {
            const cJob = await cfJob(client);
            cJob.stop();
        }
        return {
            content: `Successfully set the status of the job ${jobName} to ${jobStatus}.`,
        }
    } else if(jobName === "proxmox_updater") {
        job!.proxmox_updater = status;
        await job!.save();
        return {
            content: `Successfully set the status of the job ${jobName} to ${jobStatus}.`,
        }
    } else {
        return {
            content: "The job you specified does not exist.",
        }
    }
}

export async function createCronSchema() {
    const check = await jobSchema.findOne({ _id: "cron" });
    if (!check) {
        const schema = await jobSchema.create({
            _id: "cron",
            cloudflare_updater: false,
            proxmox_updater: false,
        });
        schema.save();
    } else return;
}
