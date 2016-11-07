# Hubot documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

getChannel = (res) -> res.robot.adapter.client.rtm.dataStore.getChannelGroupOrDMById(res.message.room)

module.exports = (robot) ->
  robot.respond /.*(emoji|эмоджи|эмодзи)/i, (res) ->
    emojiHelp = "\n
 :+1: означает «хочу видеть больше таких сообщений», «спасибо», общее выражение одобрения сообщения.\n
 :-1: — наоборот.\n
 :plus: означает «я разделяю выраженную позицию».\n
 :minus: выражает несогласие.\n
 :same: означает «у меня так же», но без оценочных коннотаций.\n
 :approx: означает «у меня примерно так же».\n
 :not_equal: означает «у меня не так».\n
 :delta: означает «после прочтения этого сообщения я изменил(а) своё мнение или узнал(а) что-то новое».\n
 :unpack: означает «распакуй», то есть разверни свою мысль более подробно.\n
 :mod_removed: означает, что это сообщение следует считать удаленным модератором (в частности, не отвечать на него). Не-модераторам просьба не использовать в качестве эмоджи.
"
    channel = getChannel(res)
    if channel.is_channel
      res.reply 'Ответил в личку. А ещё про них можно почитать тут: http://lesswrong.ru/slack.'
    res.robot.messageRoom res.message.user.id, emojiHelp
