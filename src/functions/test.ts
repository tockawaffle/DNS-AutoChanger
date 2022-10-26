import "dotenv/config"
import { dns_records } from "./cloudflare/client/dns_records"
import {getIpDns} from "./cloudflare/getIpDns"

let envs: string[] = []

if(!process.env.CF_MAIL) {
    envs.push("CF_MAIL")
} else if(!process.env.CF_KEY) {
    envs.push("CF_KEY")
} else if(!process.env.DNS_NAME) {
    envs.push("DNS_NAME")
} else if(!process.env.CF_ZONE_ID) {
    envs.push("CF_ZONE_ID")
}

if(envs.length > 0) {
    console.log(`The following envs are missing: ${envs.join(", ")}`)
    process.exit(1)
} else {
    console.log("All envs are set!")
}