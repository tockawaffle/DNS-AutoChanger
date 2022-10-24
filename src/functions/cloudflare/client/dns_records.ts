import axios from "axios"

export async function dns_records(zone_id: string, type?: "A" | "AAAA" | "CNAME" | "HTTPS" | "TXT" | "SRV") {
    const url = `https://api.cloudflare.com/client/v4/zones/${zone_id}/dns_records`;
    const CF_KEY = process.env.CF_KEY;
    const CF_MAIL = process.env.CF_MAIL;
    if(type) {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'X-Auth-Email': CF_MAIL,
                'X-Auth-Key': CF_KEY,
                'Content-Type': 'application/json'
            },
            params: {
                type
            }
        })
        return response;
    }
    const response = await axios({
        method: 'get',
        url: url,
        headers: {
            'X-Auth-Email': CF_MAIL,
            'X-Auth-Key': CF_KEY,
            'Content-Type': 'application/json'
        }
    })
    return response.data
}
