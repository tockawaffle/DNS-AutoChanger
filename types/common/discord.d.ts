import "discord.js"
import { Proxmox } from "proxmox-api";

declare module "discord.js" {
    export interface Client {
        proxmox: Proxmox.Api;
    }
}