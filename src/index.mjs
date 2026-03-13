// This file is for local development only
// For Vercel deployment, use the webhook API route
import * as dotenv from 'dotenv';
dotenv.config();
import { Telegraf, session } from 'telegraf';
import neonSessionMiddleware from './middlewares/neonSessionMiddleware.mjs';
import NeonTableManager from './utils/NeonTableManager.mjs';
import stage from './scenes/index.mjs';
import { setupActions } from './actions/index.mjs';
import { setupEvents } from './events/index.mjs';
import { setupCommands } from './commands/index.mjs';
import { logError, logInfo } from "./utils/logger.mjs";

const tableManager = new NeonTableManager();
const client = new Telegraf(process.env.TELEGRAM_TOKEN);

client.use(session());
client.use(neonSessionMiddleware());
client.use(stage.middleware());

client.command('collect', (ctx) => {
    ctx.scene.enter('nameScene');
});

client.on('new_chat_members', async (ctx) => {
    // console.log(ctx);
});
client.on('left_chat_member', async (ctx) => {
    // console.log(ctx);
});

setupActions(client);
setupCommands(client, tableManager);
setupEvents(client, tableManager);

client.catch((error) => {
    logError('An error occurred:', error);
});

client.launch();
logInfo('Bot is running...');

process.once('SIGINT', () => {
    logInfo('Received SIGINT, stopping bot...');
    client.stop('SIGINT');
    logInfo('Bot stopped gracefully.');
    process.exit();
});

process.once('SIGTERM', () => {
    logInfo('Received SIGTERM, stopping bot...');
    client.stop('SIGTERM');
    logInfo('Bot stopped gracefully.');
    process.exit();
});
