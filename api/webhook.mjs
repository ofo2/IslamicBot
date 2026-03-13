import { getBot } from '../src/bot.mjs';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const bot = getBot();
            await bot.handleUpdate(req.body);
            res.status(200).json({ ok: true });
        } else if (req.method === 'GET') {
            // Health check endpoint
            res.status(200).json({ 
                status: 'Bot is running',
                webhook: 'active'
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
