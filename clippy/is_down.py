import requests
import re
from urllib.parse import urlparse

from clippy.bot import bot

CHECKER = 'https://downforeveryoneorjustme.com'

def check_domain(msg, domain):
    url = f'{CHECKER}/{domain}'
    r = requests.get(url)

    up = f'Странно. {url} говорит, что всё работает.'
    down = f'Паника! {url} подтверждает, всё сломалось.'

    if "It's just you." in r.text:
        answer = up
    else:
        answer = down

    msg.reply(answer)

def recognize_domain_by_name(name):
    name = name.strip()
    if name.lower() in ['лв', 'лв.ру', 'лвру', 'lw.ru', 'lesswrong.ru']:
        return 'lesswrong.ru'
    if name.lower() in ['сайт кочерги']:
        return 'kocherga-club.ru'

    match = re.match(r'<([^>]+?)(?:\|[^>]+?)?>$', name)
    if not match:
        return

    url = match.group(1)
    return urlparse(url).netloc

def reply(msg, name):
    domain = recognize_domain_by_name(name)
    if not domain:
        return

    check_domain(msg, domain)

@bot.listen_to('(.*)\s+не\s+(?:грузится|открывается)')
def reply_version1(msg, name):
    reply(msg, name)

@bot.listen_to('не\s+(?:грузится|открывается)\s+(.*)')
def reply_version2(msg, name):
    reply(msg, name)
