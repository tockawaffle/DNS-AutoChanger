import { dns_records } from "./client/dns_records";
import "dotenv/config"

export async function getIpDns(dns_name: string) {
    const CF_ZONE: string = process.env.CF_ZONE_ID as string;
    const dns = await dns_records(CF_ZONE);
    const dnsRecords = dns.result;
    const dnsRecordsFiltered = dnsRecords.filter((record: any) => record.name === dns_name);
    const dnsRecord = dnsRecordsFiltered[0];
    return dnsRecord;
}
