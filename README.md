
# CloudFlare DNS AutoUpdate

Well, this might seem something rather useless if you have a fixed IP address.
If you don't, then this might actually help someone in the future.

This script is quite simple, it doesn't really handle all errors that could happen, but it works the way it's supposed to (Most of the times).

## Disclaimer

License can be found at the root directory of this project.

I am not responsible for how you'll use this or how you'll modify it.

The startup commands are mainly for linux machines (tested with CentOS 7). It'll use PM2 to manage it, you can see if this is working by using the command "pm2 list" with sudo permissions.

You'll also need typescript, ts-node and obviously, NodeJS v16 installed globally.

## FAQ

#### Why did I create this?:

Well, since I don't have a fixed IP address (they're quite expensive lol), I thought that instead of manually changing my ip address on cloudflare, I could create something that automates it for me.
First, you'd need to understand my usecase of this:
I have an A type, unproxied (DNS Only) that leads to my public ip (As shown in the image below.), that redirects all of my other addresses (Like a main directory kinda thing).

#### Why would I use this?

You might not have to.
Like I said before, this script is really simples, it only looks for your ip, tries to match it against your cloudflare dns ip, and if they're not equal, it'll update it, else it won't do anything till it detects a different ip address.
It is quite useful for people that don't have a fixed ip address, like myself.


### How do I use this?
It's really simple, being honest, all you'll need is to fill all environment variables and then run the script, and that's it, really.

This won't be noticed by anyone, so I'm not going to make a detailed wiki on it.

## Environment Variables

### Envs that you'll absolutely need for this to work:

CF_MAIL: Your cloudflare e-mail

CF_KEY: Your cloudflare API key

CF_ZONE_ID: The id of your DNS zone

DNS_NAME: The name you're using for the DNS

PROXMOX_ENABLE: "yes" or "no", not needed if you're going to use it as a Discord Bot

### Envs for the Discord Bot:

DISCORD_BOT: "yes" or "no", you'll use "no" or leave it blank if you're not using it as a Discord Bot

BOT_TOKEN: The discord bot's token. You can get it at: https://discord.com/developers/applications 

SERVER_ID: Your server's id

LOG_CHANNEL_ID: The channel that'll be used as log

CLIENT_ID: The bot's ID

OWNER_ID: Your id

MONGODB_URI: The mongoDB URI that you'll use as database, you can use this one as local: mongodb://localhost:27017/dns

### Envs for Proxmox

PROXMOX_HOST: Your FQDN or IP that you use with your proxmox.

PROXMOX_TOKEN_ID: Your Proxmox API Token ID

PROXMOX_TOKEN_SECRET: Your Proxmox API Token Secret

### Envs for the Discord Webhook:

DISCORD_WEBHOOK_URL: This one's optional, you don't have to use it if you don't want to, but if you want to get notified when the DNS you want to change, actually changes, you'll need to use this env. You'll need an Discord Webhook URL

WEBHOOK_NAME: You'll only use this one if you have a webhook setup

## Roadmap

- [X] Create some sort of messaging system where it'll send you a notification when it updates the DNS. Presumably, this is going to be made using the Discord API.
- [ ] Give it a better error handling.
- [ ] Custom timing for the CronJobs (The user will be able to choose between default set of timings or use a custom one for each job)
- [ ] Give more options of notifications, such as Telegram, WhatsApp and etc.
- [X] Idk?
