import { getBot } from '../src/bot.mjs';

export default async function handler(req, res) {
    try {
        const bot = getBot();
        
        // Get the deployment URL from Vercel
        const host = req.headers.host;
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const webhookUrl = `${protocol}://${host}/api/webhook`;
        
        // Set the webhook
        await bot.telegram.setWebhook(webhookUrl);
        
        // Get webhook info to confirm
        const webhookInfo = await bot.telegram.getWebhookInfo();
        
        res.status(200).json({
            success: true,
            message: 'Webhook set successfully',
            webhookUrl,
            webhookInfo
        });
    } catch (error) {
        console.error('Set webhook error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
