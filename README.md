
# CloudFlare DNS AutoUpdate

Well, this might seem something rather useless if you have a fixed IP address.
If you don't, then this might actually help someone in the future.

This script is quite simple, it doesn't really handle all errors that could happen, but it works the way it's supposed to.



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
You might want to change the time of the cronjob since the default for it is to check the DNS every minute.

This won't be noticed by anyone, so I'm not going to make a detailed wiki on it.

## Environment Variables

To run this project, you'll need a dotenv file (.env) in your root directory with the following envs:

`CF_MAIL`

`CF_KEY`

`CF_ZONE_ID`

`DNS_NAME`

## Roadmap

- [] Create some sort of messaging system where it'll send you a notification when it updates the DNS. Presumably, this is going to be made using the Discord API.
- [] Give it a better error handling.
- [X] Idk?