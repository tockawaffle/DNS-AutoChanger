import "dotenv/config";

const envs = [
    process.env.CF_MAIL ? null : "CF_MAIL",
    process.env.CF_KEY ? null : "CF_KEY",
    process.env.DNS_NAME ? null : "DNS_NAME",
    process.env.CF_ZONE_ID ? null : "CF_ZONE_ID",
    process.env.PROXMOX_HOST ? null : "PROXMOX_HOST",
    process.env.PROXMOX_TOKEN_ID ? null : "PROXMOX_TOKEN_ID",
    process.env.PROXMOX_TOKEN_SECRET ? null : "PROXMOX_TOKEN_SECRET",
    process.env.PROXMOX_ENABLE ? null : "PROXMOX_ENABLE",
];
let missingEnvs = envs.filter((env) => env !== null);
if (missingEnvs.length > 0) {
    console.log(
        "\n[HANDLER] > \x1b[31m%s\x1b[0m",
        `The following envs are missing either a value or the env is not set:`,
        `\x1b[33m${missingEnvs.join(", ")}\n\x1b[0m`
    );
    process.exit(1);
}

const BOT: "yes" | "no" = process.env.DISCORD_BOT as "yes" | "no",
    WEBHOOK: "yes" | "no" = process.env.DISCORD_WEBHOOK as "yes" | "no";

if (BOT !== "yes" && WEBHOOK !== "yes") {
    console.log(
        "\n[HANDLER] > \x1b[32m%s\x1b[0m",
        "No bot or webhook was found in the .env file, the cronjob will run by itself\n"
    );
    import("./src/jobs/cloudflare");
}
if (BOT === "yes" && WEBHOOK === "yes") {
    console.log(
        "\n[HANDLER] > \x1b[31m%s\x1b[0m",
        "You can't have both a bot and a webhook enabled at the same time. Please disable one of them in the .env file\n"
    );
    process.exit(1);
}
if (BOT === "yes") {
    const botEnvs = [
        process.env.BOT_TOKEN ? null : "BOT_TOKEN",
        process.env.SERVER_ID ? null : "SERVER_ID",
        process.env.OWNER_ID ? null : "OWNER_ID",
        process.env.MONGODB_URI ? null : "MONGODB_URI",
    ];
    let missingBotEnvs = botEnvs.filter((env) => env !== null);
    if (missingBotEnvs.length > 0) {
        console.log(
            "\n[HANDLER] > \x1b[31m%s\x1b[0m",
            `The following envs are missing either a value or the env is not set:`,
            `\x1b[33m${missingBotEnvs.join(", ")}\n\x1b[0m`
        );
        process.exit(1);
    }

    console.log("\n[HANDLER] > \x1b[32m%s\x1b[0m", "Starting the bot...\n");
    //@ts-ignore
    return import("./src/bot/src/bot.js");
}
if (WEBHOOK === "yes") {
    const webhookEnvs = [
        process.env.DISCORD_WEBHOOK ? null : "DISCORD_WEBHOOK",
        process.env.WEBHOOK_NAME ? null : "WEBHOOK_NAME",
    ];
    let missingWebhookEnvs = webhookEnvs.filter((env) => env !== null);
    if (missingWebhookEnvs.length > 0) {
        console.log(
            "\n[HANDLER] > \x1b[31m%s\x1b[0m",
            `The following envs are missing either a value or the env is not set:`,
            `\x1b[33m${missingWebhookEnvs.join(", ")}\n\x1b[0m`
        );
        process.exit(1);
    }

    console.log(
        "\n[HANDLER] > \x1b[32m%s\x1b[0m",
        "Starting the cronjob with webhook...\n"
    );
    //@ts-ignore
    import("./src/jobs/cloudflare.js");
}
if (process.env.PROXMOX_ENABLE === "yes") {
    const proxmoxEnvs = [
        process.env.PROXMOX_HOST ? null : "PROXMOX_HOST",
        process.env.PROXMOX_TOKEN_ID ? null : "PROXMOX_TOKEN_ID",
        process.env.PROXMOX_TOKEN_SECRET ? null : "PROXMOX_TOKEN_SECRET",
    ];
    let missingProxmoxEnvs = proxmoxEnvs.filter((env) => env !== null);
    if (missingProxmoxEnvs.length > 0) {
        console.log(
            "\n[HANDLER] > \x1b[31m%s\x1b[0m",
            `The following envs are missing either a value or the env is not set:`,
            `\x1b[33m${missingProxmoxEnvs.join(", ")}\n\x1b[0m`
        );
        process.exit(1);
    }

    console.log(
        "\n[HANDLER] > \x1b[32m%s\x1b[0m",
        "Starting Proxmox CronJob...\n"
    );
    //@ts-ignore
    import("./src/jobs/proxmox.js");
}
