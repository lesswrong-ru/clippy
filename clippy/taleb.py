from clippy.bot import bot

@bot.listen_to('.*талеб')
def reply_taleb(msg):
    msg.react('taleb')
