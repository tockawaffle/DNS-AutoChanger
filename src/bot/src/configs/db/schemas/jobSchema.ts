import { Schema, model, Document } from "mongoose";

interface jobs extends Document {
    _id: string;
    cloudflare_updater: boolean;
    proxmox_updater: boolean;
}

const jobs = new Schema<jobs>({
    _id: { type: String, required: true },
    cloudflare_updater: { type: Boolean, required: true, default: false },
    proxmox_updater: { type: Boolean, required: true, default: false },
});

export default model<jobs>("jobs", jobs);