module.exports = robot => {
  robot.hear(/талеб/i, (res) => {
    robot.adapter.client.web.reactions.add(
      'taleb',
      {
        channel: res.message.room,
        timestamp: res.message.id,
      }
    );
  });
};
