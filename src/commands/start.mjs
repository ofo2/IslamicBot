export function startCommand(client) {
    client.command('start', async (ctx) => {
        const message_id = ctx?.message?.message_id;
        const firstName = ctx.from.first_name || 'المستخدم';
        const botName = process.env.BOT_NAME || 'البوت';

        let welcomeMessage = `✨ مرحبًا بك، ${firstName}! ✨\n\n`;
        welcomeMessage += `أهلاً بك في بوت ${botName}، البوت الإسلامي الذي يسعى لخدمتك. \n`;
        welcomeMessage += `يوفر لك هذا البوت مجموعة من الميزات التي تلبي احتياجاتك كمسلم، ومن أبرزها: \n\n`;

        welcomeMessage += `1. **البحث عن الآيات القرآنية:**\n`;
        welcomeMessage += `يمكنك البحث عن آية معينة بكتابة كلمة "بحث" متبوعة بموضوع الآية. على سبيل المثال: "بحث (له ما في السماوات وما في الأرض)".\n`;
        welcomeMessage += `أو يمكنك استعمال الأمر /search متبوعة بالآية.\n\n`;

        welcomeMessage += `2. **البحث عن الأحاديث النبوية:**\n`;
        welcomeMessage += `يمكنك البحث عن حديث نبوي بكتابة كلمة "حديث" متبوعة بالكلمة التي ترغب في البحث عنها في الأحاديث. على سبيل المثال: "حديث عليكم بالحبة السوداء".\n`;
        welcomeMessage += `أو يمكنك استعمال الأمر /hadith متبوعة بالكلمة.\n\n`;

        welcomeMessage += `3. **البحث عن الفتاوى:**\n`;
        welcomeMessage += `يمكنك البحث عن فتوى بكتابة كلمة "فتوى" متبوعة بالكلمة التي ترغب في البحث عنها. على سبيل المثال: "فتوى الطلاق".\n`;
        welcomeMessage += `أو يمكنك استعمال الأمر /fatwa متبوعة بالكلمة.\n\n`;

        welcomeMessage += `4. **البحث عن الخطب:**\n`;
        welcomeMessage += `يمكنك البحث عن خطبة بكتابة كلمة "خطبة" متبوعة بالموضوع الذي ترغب في البحث عنه. على سبيل المثال: "خطبة عن الصبر".\n`;
        welcomeMessage += `أو يمكنك استعمال الأمر /khutbah متبوعة بالموضوع.\n\n`;

        welcomeMessage += `5. **الأسئلة العشوائية:**\n`;
        welcomeMessage += `يمكنك اختبار معلوماتك من خلال مجموعة من الأسئلة العشوائية المتنوعة في العلوم الشرعية.\n`;
        welcomeMessage += `استخدم الأمر /quiz للبدء باختبار عشوائي.\n\n`;

        welcomeMessage += `💡 لمزيد من المعلومات حول البوت يمكنك استخدام الأمر /help.\n\n`;

        // الإضافة الجديدة
        welcomeMessage += `🛠️ تم إنشاؤه من قبل Abduallah Shoiep ❤️\n`;
        welcomeMessage += `📸 لا تنسى متابعة حساب الإنستغرام الخاص بي: @qf5.x 🌟`;

        await ctx.reply(welcomeMessage, {
            parse_mode: 'Markdown',
            reply_to_message_id: message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "تابع الآن على إنستغرام 🌟", url: "https://www.instagram.com/qf5.x/" }
                    ]
                ]
            }
        });
    });
}
