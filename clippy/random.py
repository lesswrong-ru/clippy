from clippy.bot import bot

import random

QUOTES = [
    'Подбросил монетку и выпало',
    'Заглянул в хрустальный шар и увидел число:',
    'Пересчитал ворон, получилось',
    'Бросил кубик, выпало',
    'Измерил случайную величину линейкой, и она равна',
    'Оценил свою степень уверенности в случайности выдаваемых мною чисел равной',
]

@bot.respond_to(r'random\s*([\d]*)')
def reply_random(msg, n):
    quote = random.choice(QUOTES)
    if n:
        n = int(n)
        msg.reply(f'{quote} {random.randint(1, n)}')
    else:
        msg.reply(f'{quote} {random.random()}')
