import logging
logger = logging.getLogger(__name__)

import re

from clippy.bot import bot

import slappy.helpers

def extract_channel_id(maybe_channel_markup):
    match = re.match(r'<#(\w+)\|[^>]+>', maybe_channel_markup)
    if match:
        return match.group(1)


@bot.respond_to('скажи ["“](.*?)[”"] в (.*)')
def reply_voice(msg, saying, channel_name):
    channel_id = extract_channel_id(channel_name)

    if not channel_id:
        channel = slappy.helpers.get_channel_by_name(msg.sc, channel_name)
        channel_id = channel.channel_id

    response = msg.sc.api_call(
        'chat.postMessage',
        text=saying,
        channel=channel_id,
    )

    if not response['ok']:
        logger.error(response)
        raise Exception(response['error'])

    msg.react('heavy_check_mark')
