import "dotenv/config";

module.exports = {
    apps: [
        {
            name: 'DNS-Auto-Updater',
            script: 'dist/handler.js',
            instances: 1,
            autorestart: true,
            watch: true,
            node_args: '-r dotenv/config',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
}