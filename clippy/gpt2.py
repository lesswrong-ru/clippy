import logging
logger = logging.getLogger(__name__)

import requests

from clippy.bot import bot

GPT2_HOST = os.environ['GPT2_HOST']


@bot.respond_to(r'gpt2 ([\w\.:\- ]{3,150})$')
def gpt2_respond(msg, text):
    if not GPT2_HOST:
        logger.warn('GPT2_HOST is not set up')
        return

    resp = requests.get(GPT2_HOST, {"text": text})
    msg.reply(resp.text)
