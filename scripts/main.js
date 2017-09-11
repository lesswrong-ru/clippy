// Hubot documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

const getChannel = (res) => res.robot.adapter.client.rtm.dataStore.getChannelGroupOrDMById(res.message.room);

const emoji = require('./emoji');


const texts = {
  emoji: `${emoji.asSlackText(emoji.registry)}

А ещё есть пара десятков специальных реакций с префиксом fallacy_ про разные логические ошибки (http://fallacymania.com/).

Смотри также: http://lesswrong.ru/slack/emoji.
`,
  intro: (res) => `Привет, ${res.message.user.name}! :)

Добро пожаловать в онлайн-чат русскоязычного LessWrong-сообщества. Если хочешь, расскажи нам немного о себе в канале #welcome. Добро пожаловать также в любые обсуждения во всех открытых каналах (а у нас их очень много). Пожалуйста, старайся соблюдать тематику каналов (она обычно понятна из названия либо указана в описании): пиши про музыку в #music, про политику в #society, а про рациональность — в #rationality.
Если вдруг большое количество каналов может запутать, всегда можно писать в общий #open, в нём не бывает оффтопика.

Если хочешь как-то прокомментировать чьё-то сообщение, но боишься, что это уведёт основную беседу в сторону, или просто не хочешь привлекать всеобщее внимание к развитию темы, используй треды. Используй их также, если твои сообщения содержат спойлеры к чему-нибудь.

И, пожалуйста, не надо использовать опцию \"отправить сообщение из треда в канал\" в качестве инструмента ответа на сообщение: эта опция нужна только если затянувшееся обсуждение в треде пришло к какому-то выводу, который хочется транслировать в канал, но постоянно использовать её точно не нужно.

Обрати, пожалуйста, внимание на правила общения, существующие в нашем чате: http://lesswrong.ru/slack/rules
Они действуют везде, кроме канала #chaos, в котором царит безграничная анархия: заходи на свой страх и риск!

Если что-то осталось непонятным, не стесняйся задавать любые вопросы в #help_to_understand или в личку любому из модераторов чата: @berekuk, @alaric, @quilfe, @greenochre, @zaikman`,
}

module.exports = robot => {
  robot.respond(
    /.*(emoji|эмоджи|эмодзи)/i,
    (res) => {
      if (getChannel(res).is_channel) {
        res.reply('Ответил в личку. А ещё про них можно почитать тут: http://lesswrong.ru/slack/emoji.');
      }
      res.robot.messageRoom(res.message.user.id, texts.emoji);
    }
  );

  robot.respond(
    /код для вики/i,
    (res) => {
      robot.adapter.client.web.emoji.list().then(slackData => {
        const mediawikiCode = emoji.asMediawikiCode(emoji.registry, slackData);
        res.reply('```' + mediawikiCode + '```');
      });
    }
  );

  robot.respond(
    /покажи пригласительное сообщение/i,
    (res) => {
      if (getChannel(res).is_channel) {
        return;
      }
      res.robot.messageRoom(res.message.user.id, texts.intro(res));
    }
  );

  robot.enter(
    (res) => {
      if (getChannel(res).name == 'announcements') {
        res.robot.messageRoom(res.message.user.id, texts.intro(res));
      }
    }
  );
};
