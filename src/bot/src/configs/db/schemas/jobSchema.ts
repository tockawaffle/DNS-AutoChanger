import { Schema, model, Document } from "mongoose";

interface jobs extends Document {
    jobs: {
        cloudflare_updater: boolean;
    proxmox_updater: boolean;
    }
}

const jobs = new Schema<jobs>({
    jobs: {
        cloudflare_updater: {
            type: Boolean,
            required: true,
            default: false,
        },
        proxmox_updater: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
});

export default model<jobs>("jobs", jobs);
