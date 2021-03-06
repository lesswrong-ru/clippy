from clippy.bot import bot

def get_intro(msg):
    user = msg.user
    return f"""Привет, {user.name}!

Добро пожаловать в онлайн-чат русскоязычного LessWrong-сообщества. Если хочешь, расскажи нам немного о себе в канале #welcome. Добро пожаловать также в любые обсуждения во всех открытых каналах (а у нас их очень много). Пожалуйста, старайся соблюдать тематику каналов (она обычно понятна из названия либо указана в описании): пиши про музыку в #sbj_music, про политику в #sbj_social_sciences, а про рациональность — в #sbj_rationality.
Если вдруг большое количество каналов может запутать, всегда можно писать в общий #open, в нём не бывает оффтопика.

Если хочешь как-то прокомментировать чьё-то сообщение, но боишься, что это уведёт основную беседу в сторону, или просто не хочешь привлекать всеобщее внимание к развитию темы, используй треды. Используй их также, если твои сообщения содержат спойлеры к чему-нибудь.

И, пожалуйста, не надо использовать опцию "отправить сообщение из треда в канал" в качестве инструмента ответа на сообщение: эта опция нужна только если затянувшееся обсуждение в треде пришло к какому-то выводу, который хочется транслировать в канал, но постоянно использовать её точно не нужно.

Обрати, пожалуйста, внимание на правила общения, существующие в нашем чате: http://lesswrong.ru/slack/rules

Если что-то осталось непонятным, не стесняйся задавать любые вопросы в #help_to_understand."""

@bot.respond_to('покажи приветственное сообщение')
def reply_show_welcome(msg):
    msg.reply(get_intro(msg))

#  robot.enter(
#    (res) => {
#      if (getChannel(res).name == 'announcements') {
#        res.robot.messageRoom(res.message.user.id, texts.intro(res));
#      }
#    }
#  );
