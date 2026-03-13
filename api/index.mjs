export default async function handler(req, res) {
    const webhookUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/webhook`;
    
    res.status(200).json({
        status: 'Islamic Bot is running!',
        message: 'بوت إسلامي يعمل بنجاح على Vercel',
        webhook_url: webhookUrl,
        setup_instructions: {
            ar: 'قم بزيارة /api/set-webhook لتفعيل الـ Webhook',
            en: 'Visit /api/set-webhook to activate the webhook'
        }
    });
}
