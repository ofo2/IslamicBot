import { Telegraf, session } from 'telegraf';
import neonSessionMiddleware from './middlewares/neonSessionMiddleware.mjs';
import NeonTableManager from './utils/NeonTableManager.mjs';
import stage from './scenes/index.mjs';
import { setupActions } from './actions/index.mjs';
import { setupEvents } from './events/index.mjs';
import { setupCommands } from './commands/index.mjs';

// Create bot instance (singleton)
let bot = null;
let tableManager = null;

export function getBot() {
    if (!bot) {
        bot = new Telegraf(process.env.TELEGRAM_TOKEN);
        tableManager = new NeonTableManager();
        
        // Setup middlewares
        bot.use(session());
        bot.use(neonSessionMiddleware());
        bot.use(stage.middleware());
        
        // Setup collect command
        bot.command('collect', (ctx) => {
            ctx.scene.enter('nameScene');
        });
        
        // Setup all actions, commands, and events
        setupActions(bot);
        setupCommands(bot, tableManager);
        setupEvents(bot, tableManager);
        
        // Error handling
        bot.catch((error, ctx) => {
            console.error('Bot error:', error);
        });
    }
    
    return bot;
}

export function getTableManager() {
    if (!tableManager) {
        tableManager = new NeonTableManager();
    }
    return tableManager;
}
