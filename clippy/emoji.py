from clippy.bot import bot

registry = [
    {
        'title': 'Количественные шкалы',
        'items': [
            { 'code': '+1', 'description': 'хочу видеть больше таких сообщений' },
            { 'code': 'thumb_sideways', 'description': 'мне всё равно, пишут такие сообщения или нет' },
            { 'code': '-1', 'description': 'хочу видеть меньше таких сообщений' },
            { 'code': 'plus', 'description': 'согласен' },
            { 'code': 'kinda_plus', 'description': 'примерно согласен' },
            { 'code': 'minus', 'description': 'не согласен\nНапример, сообщение, содержащее честную, но неудачную попытку разобраться, можно отмечать одновременно :+1:  и :minus:.' },
            { 'code': 'same', 'description': 'у меня так же' },
            { 'code': 'approx', 'description': 'у меня примерно так же' },
            { 'code': 'not-same', 'description': 'у меня не так' },
            { 'code': 'yes', 'description': 'да' },
            { 'code': 'no', 'description': 'нет' },
        ],
    },
    {
        'title': 'Важные эмоджи',
        'items': [
            { 'code': 'delta', 'description': 'новая существенная информация, изменил свое мнение, ...' },
            { 'code': 'mod_removed', 'description': 'сообщение следует считать удаленным модератором (в том числе, на него не надо отвечать). Не-модераторам использовать нельзя.' },
            { 'code': 'possible_illegal', 'description': 'по моим представлениям, такие сообщения недопустимы в этом канале' },
            { 'code': 'rotating_coin', 'description': 'я готов поставить деньги на какую-то позицию / ты готов поставить деньги на то, что твое утверждение верно?' },
            { 'code': 'unpack', 'description': 'я не понимаю, распиши подробнее' },
            { 'code': 'owl', 'description': 'какую задачу мы решаем?' },
        ]
    },
    {
        'title': 'Сложность сообщений',
        'items': [
            { 'code': 'alien', 'description': 'непонятно настолько, что даже не знаю, как уточнять, как будто написано для инопланетян' },
            { 'code': 'complicated', 'description': 'слишком запутанно, можно было бы передать ту же информацию проще' },
            { 'code': 'mindblown', 'description': 'сломал мозг, пока разбирался' },
        ],
    },
    {
        'title': 'Эмодзи факультетов Хогвартса',
        'subtitle': 'Ставятся на посты, в которых присутствуют яркие проявления качеств, характерных для того или иного факультета, а именно:',
        'items': [
            { 'code': 'gryffindor', 'description': 'смелость, отвага' },
            { 'code': 'hufflepuff', 'description': 'трудолюбие, лояльность' },
            { 'code': 'ravenclaw', 'description': 'любопытство, ум' },
            { 'code': 'slytherin', 'description': 'хитрость, рассчетливость' },
        ],
    },
    {
        'title': 'Прочее',
        'items': [
            { 'code': 'bayan', 'description': 'Было А Я Не Знал (:captain-obvious:)' },
            { 'code': 'bayes', 'description': 'тут нужна/похоже на/.. теорема Байеса' },
            { 'code': 'captain-obvious', 'description': 'спасибо, Кэп' },
            { 'code': 'deal_with_it', 'description': 'ты тут ничего не можешь сделать, смирись / прими как есть' },
            { 'code': 'delta_dolphin', 'description': 'новая информация, которую бы лучше не узнавал' },
            { 'code': 'dumb-owl', 'description': 'хмм, какая у тебя странная задача' },
            { 'code': 'double_facepalm', 'description': 'я не понимаю, как написавший такое сообщение человек смог научиться писать' },
            { 'code': 'facepalm', 'description': 'я не понимаю, как можно было написать такую чушь' },
            { 'code': 'glory_of_satan', 'description': 'данное сообщение угодно богам Хаоса' },
            { 'code': 'i-quit', 'description': 'мне надоело, я выхожу из обсуждения' },
            { 'code': 'noise', 'description': 'сообщение является злостным оффтопиком [рекомендуется к употреблению только в содержательных обсуждениях и тематичных каналах]' },
            { 'code': 'raised_eyebrow', 'description': 'скептицизм' },
            { 'code': 'shrug', 'description': '\"ну и что?\"' },
            { 'code': 'slowpoke', 'description': 'тормозишь / медленно соображаешь / принес как новость то, что было известно еще динозаврам' },
            { 'code': 'steelman', 'description': 'антоним :fallacy_strawman:' },
            { 'code': 'taleb', 'description': 'это сообщение в стиле популярных книг про бизнес и успех' },
            { 'code': 'typo', 'description': 'сообщение написано с таким количеством орфографических или грамматических ошибок, что его неудобно читать' },
            { 'code': 'x', 'description': 'удали превью' },
            { 'code': 'vanga', 'description': 'интуитивно предсказываю, что ... / интересное непонятно как полученное предсказание / неожиданно точное предсказание' },
            { 'code': 'heavy_check_mark', 'description': 'прочитал / принял к сведению' },
            { 'code': 'yudkowsky', 'description': 'как Боженька смолвил' },
        ]
    },
]

def item_as_slack_text(item):
    return f":{item['code']}:  - {item['description']}"

def group_as_slack_text(group):
    items = map(item_as_slack_text, group['items'])

    subtitle = group.get('subtitle', '')
    if subtitle:
        subtitle = '\n' + subtitle

    header = f"*{group['title']}*{subtitle}"
    main = '\n'.join(items)
    return header + '\n' + main

def registry_as_slack_text(registry):
    return '\n\n'.join(
        map(group_as_slack_text, registry)
    )

def item_as_mediawiki_code(item, slack_data):
    (code, description) = (item['code'], item['description'])
    return f"""|-
| <code>:{code}:</code>
| <div class="emoji-image">{slack_data.get(code, 'нет картинки')}</div>
| style="text-align:left;" | {description}
"""

def group_as_mediawiki_code(group, slack_data):
    f = lambda item: item_as_mediawiki_code(item, slack_data)
    items = map(f, group['items'])

    subtitle = group.get('subtitle', '')
    if subtitle:
        subtitle = f"""
|-
! colspan="3" | {subtitle}"""

    return f"""
{{| class="wikitable" style="width: 100%; text-align: center"
|+ colspan="3" | {group['title']}{subtitle}
|-
! Код
! Иконка
! Описание
{''.join(items)}
|}}
"""

def registry_as_mediawiki_code(registry, slack_data):
    f = lambda group: group_as_mediawiki_code(group, slack_data)
    return '\n'.join(
        map(f, registry)
    )

@bot.respond_to('.*(?:emoji|эмоджи|эмодзи)')
def reply_emoji(msg):
    text = f"""{registry_as_slack_text(registry)}

А ещё есть пара десятков специальных реакций с префиксом fallacy_ про разные логические ошибки (http://fallacymania.com/).

Смотри также: http://lesswrong.ru/slack/emoji."""

    if msg.body['channel_type'] == 'channel':
        msg.reply('Ответил в личку. А ещё про них можно почитать тут: http://lesswrong.ru/slack/emoji.')
    msg.sc.api_call(
        'chat.postMessage',
        channel=msg.user_id,
        text=text,
    )

@bot.respond_to('код для вики')
def reply_wiki_code(msg):
    response = msg.sc.api_call('emoji.list')
    if not response['ok']:
        raise Exception(response['error'])

    slack_data = response['emoji']
    mediawiki_code = registry_as_mediawiki_code(registry, slack_data);
    msg.reply(f'```{mediawiki_code}```')
