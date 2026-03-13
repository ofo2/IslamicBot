import NeonSessionManager from '../utils/NeonSessionManager.mjs';

const sessionManager = new NeonSessionManager();

export default function neonSessionMiddleware() {
    return async (ctx, next) => {
        const sessionKey = `${ctx?.chat?.id}:${ctx?.from?.id}`;
        
        // Load session from database
        ctx.session = await sessionManager.get(sessionKey) || {};
        
        // Process the update
        await next();
        
        // Save session back to database
        await sessionManager.set(sessionKey, ctx.session);
    };
}
