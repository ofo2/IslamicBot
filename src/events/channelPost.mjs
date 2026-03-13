import { logInfo } from "../utils/logger.mjs";

export default async function channelPost(ctx, tableManager) {
    const chatId = ctx.chat.id;        

    // تأكد من وجود الدردشة في جدول 'chats'
    const existingChat = await tableManager.dbManager.fetchData('chats', ['chat_id'], { chat_id: chatId });
    if (existingChat.length === 0) {
        await tableManager.dbManager.updateData('chats', { status: 'active' }, { chat_id: chatId });
        const chatData = {
            chat_id: chatId,
            chat_title: ctx.chat.title || 'Channel Chat',
            chat_type: ctx.chat.type || 'channel',
            chat_username: ctx.chat.username || null,
            status: 'active',
        };
        const insertChatResult = await tableManager.dbManager.insertData('chats', chatData);
        if (!insertChatResult) {
            logInfo(`Failed to insert chat ${chatId} into 'chats'.`);
        } else {
            logInfo(`Chat ${chatId} has been inserted into 'chats'.`);
        }
    }
}
