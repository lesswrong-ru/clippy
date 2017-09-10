module.exports = robot => {

  const checkUrl = (msg, domain) => {
    robot.http(`http://downforeveryoneorjustme.com/${domain}`).get()(
      (err, res, body) => {
        const up = `Странно. http://downforeveryoneorjustme.com/${domain} говорит, что всё работает.`;
        const down = `Паника! http://downforeveryoneorjustme.com/${domain} подтверждает, всё сломалось.`;
        let answer;
        if (body.indexOf("It's just you.") > 0) {
          console.log('up!');
          answer = up;
        } else {
          console.log('down!');
          answer = down;
        }
        msg.send(answer);
      }
    );
  };

  const recognizeDomainByName = name => {
    console.log(name);
    if (name.match(RegExp('(?:^|\\s+)(?:lesswrong\\.ru|http://lesswrong\\.ru|https://lesswrong\\.ru|лв|лв\\.ру|лвру|lw\\.ru)\\s*$', 'i'))) {
      console.log('LW');
      return 'lesswrong.ru';
    }
    if (name.match(RegExp('(?:^|\\s+)(?:сайт\\s+кочерги|http://kocherga-club\\.ru|kocherga-club\\.ru)\\s*$', 'i'))) {
      console.log('KCH');
      return 'kocherga-club.ru';
    }
    return;
  };

  const cb = (msg) => {
    const url = recognizeDomainByName(msg.match[1]);
    if (!url) {
      return;
    }

    checkUrl(msg, url);
  };

  robot.hear(/(.*)\s+не\s+(?:грузится|открывается)/i, cb);
  robot.hear(/не\s+(?:грузится|открывается)\s+(.*)/i, cb);
};
