module.exports = robot => {

  const checkUrl = (res, domain) => {
    robot.http(`http://downforeveryoneorjustme.com/${domain}`).get()(
      (err, response, body) => {
        const up = `Странно. http://downforeveryoneorjustme.com/${domain} говорит, что всё работает.`;
        const down = `Паника! http://downforeveryoneorjustme.com/${domain} подтверждает, всё сломалось.`;
        let answer;
        if (body.indexOf("It's just you.") > 0) {
          answer = up;
        } else {
          answer = down;
        }
        res.send(answer);
      }
    );
  };

  const recognizeDomainByName = name => {
    if (name.match(RegExp('(?:^|\\s+)(?:lesswrong\\.ru|http://lesswrong\\.ru|https://lesswrong\\.ru|лв|лв\\.ру|лвру|lw\\.ru)\\s*$', 'i'))) {
      return 'lesswrong.ru';
    }
    if (name.match(RegExp('(?:^|\\s+)(?:сайт\\s+кочерги|http://kocherga-club\\.ru|kocherga-club\\.ru)\\s*$', 'i'))) {
      return 'kocherga-club.ru';
    }
    return;
  };

  const cb = (res) => {
    const url = recognizeDomainByName(res.match[1]);
    if (!url) {
      return;
    }

    checkUrl(res, url);
  };

  robot.hear(/(.*)\s+не\s+(?:грузится|открывается)/i, cb);
  robot.hear(/не\s+(?:грузится|открывается)\s+(.*)/i, cb);
};
