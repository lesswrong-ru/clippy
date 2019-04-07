#!/usr/bin/env python
from clippy.bot import bot

import clippy.basic
import clippy.emoji
import clippy.is_down
import clippy.random
import clippy.taleb
import clippy.voice
import clippy.welcome
import clippy.gpt2

import os

def main():
    bot.run(port=os.getenv('PORT'))

if __name__ == "__main__":
    main()
