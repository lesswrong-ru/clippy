module.exports = robot => {
  robot.respond(
    /скажи ["“](.*?)[”"] в (.*)/i,
    (res) => {
      const saying = res.match[1];
      const channelName = res.match[2];
      const channel = res.robot.adapter.client.rtm.dataStore.getChannelOrGroupByName(channelName);
      if (res.message.user.id !== 'U0F6P8JAG') {
        return;
      }

      robot.adapter.client.web.reactions.add(':white_check_mark:', { channel: res.message.room, timestamp: res.message.id })
      res.robot.messageRoom(channel.id, saying);
    }
  );
}
