module.exports = robot => {
  robot.hear(/талеб/i, (res) => {
    console.log(res.message);
    robot.adapter.client.web.reactions.add(
      'taleb',
      {
        channel: res.message.room,
        timestamp: res.message.id,
      }
    );
  });
};
