from clippy.bot import bot

@bot.respond_to(r'привет')
def react_hello(message):
    return 'Привет!'
