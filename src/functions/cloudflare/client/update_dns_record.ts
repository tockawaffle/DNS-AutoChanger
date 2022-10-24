import axios from "axios";
import "dotenv/config"

export async function update_dns_record(
    zone_id: string,
    id: string,
    type: string,
    name: string,
    content: string,
    ttl: number,
    proxied: boolean
) {
    const url = `https://api.cloudflare.com/client/v4/zones/${zone_id}/dns_records/${id}`,
        CF_KEY = process.env.CF_KEY,
        CF_MAIL = process.env.CF_MAIL,
        response = await axios({
            method: "put",
            url: url,
            headers: {
                "X-Auth-Email": CF_MAIL,
                "X-Auth-Key": CF_KEY,
                "Content-Type": "application/json",
            },
            data: {
                type,
                name,
                content,
                ttl,
                proxied,
            },
        }).catch((err) => {
            //throw the json error
            throw err.response.data;
        }) 
    return response;
}