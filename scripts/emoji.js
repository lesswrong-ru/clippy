const registry = [
  {
    title: 'Количественные шкалы',
    items: [
      { code: '+1', description: 'хочу видеть больше таких сообщений' },
      { code: 'thumb_sideways', description: 'мне всё равно, пишут такие сообщения или нет' },
      { code: '-1', description: 'хочу видеть меньше таких сообщений' },
      { code: 'plus', description: 'согласен' },
      { code: 'kinda_plus', description: 'примерно согласен' },
      { code: 'minus', description: 'не согласен' },
      { code: 'same', description: 'у меня так же' },
      { code: 'approx', description: 'у меня примерно так же' },
      { code: 'not-same', description: "у меня не так\nНапример, сообщение, содержащее честную, но неудачную попытку разобраться, можно отмечать одновременно :+1:  и :minus:." },
      { code: 'yes', description: 'да' },
      { code: 'no', description: 'нет' },
    ],
  },
  {
    title: 'Важные эмоджи',
    items: [
      { code: 'delta', description: 'новая существенная информация, изменил свое мнение, ...' },
      { code: 'mod_removed', description: 'сообщение следует считать удаленным модератором (в том числе, на него не надо отвечать). Не-модераторам использовать нельзя.' },
      { code: 'possible_illegal', description: 'по моим представлениям, такие сообщения недопустимы в этом канале' },
      { code: 'rotating_coin', description: 'я готов поставить деньги на какую-то позицию / ты готов поставить деньги на то, что твое утверждение верно?' },
      { code: 'unpack', description: 'я не понимаю, распиши подробнее' },
      { code: 'owl', description: 'какую задачу мы решаем?' },
    ]
  },
  {
    title: 'Сложность сообщений',
    items: [
      { code: 'alien', description: 'непонятно настолько, что даже не знаю, как уточнять, как будто написано для инопланетян' },
      { code: 'complicated', description: 'слишком запутанно, можно было бы передать ту же информацию проще' },
      { code: 'mindblown', description: 'сломал мозг, пока разбирался' },
    ],
  },
  {
    title: 'Эмодзи факультетов Хогвартса',
    subtitle: 'Ставятся на посты, в которых присутствуют яркие проявления качеств, характерных для того или иного факультета, а именно:',
    items: [
      { code: 'gryffindor', description: 'смелость, отвага' },
      { code: 'hufflepuff', description: 'трудолюбие, лояльность' },
      { code: 'ravenclaw', description: 'любопытство, ум' },
      { code: 'slytherin', description: 'хитрость, рассчетливость' },
    ],
  },
  {
    title: 'Прочее',
    items: [
      { code: 'bayan', description: 'Было А Я Не Знал (:captain-obvious:)' },
      { code: 'bayes', description: 'тут нужна/похоже на/.. теорема Байеса' },
      { code: 'boring', description: 'ничего интересного' },
      { code: 'captain-obvious', description: 'спасибо, Кэп' },
      { code: 'deal_with_it', description: 'ты тут ничего не можешь сделать, смирись / прими как есть' },
      { code: 'delta_dolphin', description: 'новая информация, которую бы лучше не узнавал' },
      { code: 'dumb-owl', description: 'хмм, какая у тебя странная задача' },
      { code: 'double_facepalm', description: 'я не понимаю, как написавший такое сообщение человек смог научиться писать' },
      { code: 'facepalm', description: 'я не понимаю, как можно было написать такую чушь' },
      { code: 'glory_of_satan', description: 'данное сообщение угодно богам Хаоса' },
      { code: 'i-quit', description: 'мне надоело, я выхожу из обсуждения' },
      { code: 'noise', description: 'сообщение является злостным оффтопиком [рекомендуется к употреблению только в содержательных обсуждениях и тематичных каналах]' },
      { code: 'raised_eyebrow', description: 'скептицизм' },
      { code: 'shrug', description: '\"ну и что?\"' },
      { code: 'slowpoke', description: 'тормозишь / медленно соображаешь / принес как новость то, что было известно еще динозаврам' },
      { code: 'steelman', description: 'антоним :fallacy_strawman:' },
      { code: 'taleb', description: 'это сообщение в стиле популярных книг про бизнес и успех' },
      { code: 'typo', description: 'сообщение написано с таким количеством орфографических или грамматических ошибок, что его неудобно читать' },
      { code: 'x', description: 'удали превью' },
      { code: 'vanga', description: 'интуитивно предсказываю, что ... / интересное непонятно как полученное предсказание / неожиданно точное предсказание' },
      { code: 'heavy_check_mark', description: 'прочитал / принял к сведению' },
      { code: 'yudkowsky', description: 'как Боженька смолвил' },
    ]
  },
];

const itemAsSlackText = item => `:${item.code}:  - ${item.description}`;

const groupAsSlackText = group => {
  const items = group.items.map(itemAsSlackText);

  let subtitle = group.subtitle || '';
  if (subtitle) {
    subtitle = '\n' + subtitle;
  }

  return `*${group.title}*${subtitle}
${items.join('\n')}
`;
};

const registryAsSlackText = registry => registry.map(groupAsSlackText).join('\n\n');

const itemAsMediawikiCode = (item, slackData) => (
  `|-
| <code>:${item.code}:</code>
| <div class="emoji-image">${slackData.emoji[item.code]}</div>
| style="text-align:left;" | ${item.description}
`
);

const groupAsMediawikiCode = (group, slackData) => {
  const items = group.items.map(item => itemAsMediawikiCode(item, slackData));

  let subtitle = group.subtitle || '';
  if (subtitle) {
    subtitle = `
|-
! colspan="3" | ${subtitle}`;
  }

  return `
\{| class="wikitable" style="width: 100%; text-align: center"
|+ colspan="3" | ${group.title}${subtitle}
|-
! Код
! Иконка
! Описание
${items.join('')}
|}
`;
};

const registryAsMediawikiCode = (registry, slackData) => {
  return `
${registry.map(group => groupAsMediawikiCode(group, slackData)).join('\n')}
`;
};

exports.registry = registry;
exports.asSlackText = registryAsSlackText;
exports.asMediawikiCode = registryAsMediawikiCode;
