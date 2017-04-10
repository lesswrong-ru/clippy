// Hubot documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

const getChannel = (res) => res.robot.adapter.client.rtm.dataStore.getChannelGroupOrDMById(res.message.room);

const texts = {
  emoji: `*Количественные шкалы*
:+1:  - хочу видеть больше таких сообщений
:thumb_sideways:  - мне всё равно, пишут такие сообщения или нет
:-1:  - хочу видеть меньше таких сообщений
:plus:  - согласен
:kinda_plus:  - примерно согласен
:minus:  - не согласен
:same:  - у меня так же
:approx:  - у меня примерно так же
:not-same:   - у меня не так
Например, сообщение, содержащее честную, но неудачную попытку разобраться, можно отмечать одновременно :+1:  и :minus:.
:yes:  - да
:no:  - нет

*Важные эмоджи*
:delta:  - новая существенная информация, изменил свое мнение, ...
:mod_removed:  - сообщение следует считать удаленным модератором (в том числе, на него не надо отвечать). Не-модераторам использовать нельзя.
:possible_illegal:  - по моим представлениям, такие сообщения недопустимы в этом канале
:rotating_coin:  - я готов поставить деньги на какую-то позицию / ты готов поставить деньги на то, что твое утверждение верно?
fallacy_* - это сообщение содержит соответствующую логическую ошибку (см. табличку http://lesswrong.ru/slack и http://fallacymania.com/)
:unpack:  - я не понимаю, распиши подробноее

*Сложность сообщений*
:alien:  - непонятно настолько, что даже не знаю, как уточнять, как будто написано для инопланетян
:complicated:  - слишком запутанно, можно было бы передать ту же информацию проще
:mindblown:  - сломал мозг, пока разбирался

*Эмодзи факультетов Хогвартса*
Ставятся на посты, в которых присутствуют яркие проявления качеств, характерных для того или иного факультета, а именно:
:gryffindor:  - смелость, отвага
:hufflepuff: - трудолюбие, лояльность
:ravenclaw:  - любопытство, ум
:slytherin:  - хитрость, рассчетливость

*Прочее*
:bayan:  - Было А Я Не Знал (:captain-obvious:)
:bayes:  - тут нужна/похоже на/.. теорема Байеса
:boring:  - ничего интересного
:captain-obvious:  - спасибо, Кэп
:deal_with_it:  - ты тут ничего не можешь сделать, смирись / прими как есть
:delta_dolphin:  - новая информация, которую бы лучше не узнавал
:double_facepalm:  - я не понимаю, как написавший такое сообщение человек смог научиться писать
:facepalm:  - я не понимаю, как можно было написать такую чушь
:glory_of_satan:  - данное сообщение угодно богам Хаоса
:i-quit:  - мне надоело, я выхожу из обсуждения
:noise:  - сообщение является злостным оффтопиком [рекомендуется к употреблению только в содержательных обсуждениях и тематичных каналах]
:raised_eyebrow:  - скептицизм
:shrug:  - \"ну и что?\"
:slowpoke:  - тормозишь / медленно соображаешь / принес как новость то, что было известно еще динозаврам
:steelman:  - антоним :fallacy_strawman:
:taleb:  - это сообщение в стиле популярных книг про бизнес и успех
:typo:  - сообщение написано с таким количеством орфографических или грамматических ошибок, что его неудобно читать
:vanga:  - интуитивно предсказываю, что ... / интересное непонятно как полученное предсказание / неожиданно точное предсказание
:white_check_mark:  - прочитал / принял к сведению
:yudkowsky:  - как Боженька смолвил

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
