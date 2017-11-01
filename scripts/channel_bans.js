// Commands:
//   hubot set_superuser @user - superuser can use all commands
//
//   hubot set_channel_owner #channel @user
//   hubot set_moderation_channel #channel - bot will log moderation messages in this channel
//   hubot kill_yourself - robot process terminates (and hopefully restarts)
//
//   hubot ban_local #channel @user - ban @user in #channel
//   hubot unban_local #channel @user
//
//   hubot get_superuser - get current superuser
//   hubot get_channel_owner #channel

const assert = require("assert");

const Channel = class Channel {
    constructor(obj) {
        Object.assign(this, obj);
    }

    static newChannel(name, ownerId, bannedPeople) {
        const obj = {
            name: name,
            ownerId: ownerId,
        }
        if (bannedPeople !== undefined) {
            obj.bannedPeople = bannedPeople;
        }
        else {
            obj.bannedPeople = [];
        }
        return new Channel(obj);
    }

    isBanned(userId) {
        return this.bannedPeople.indexOf(userId) !== -1;
    }

    unban(userId) {
        // returns true if successful
        // otherwise (if the user was not found) returns false
        const index = this.bannedPeople.indexOf(userId);
        if (index === -1) {
            return false;
        }
        this.bannedPeople.splice(index, 1);
        return true;
    }

    ban(userId) {
        // returns true if successful
        // otherwise (if the user is already banned) returns false
        if (this.isBanned(userId)) {
            return false;
        }
        this.bannedPeople.push(userId);
        return true;
    }
}; 

module.exports = (robot) => {
    const modifyChannels = (func) => {
        // func should take one argument, that is the channel list
        // modify it and return anything
        const channels = robot.brain.get("channels");
        const retValue = func(channels);
        robot.brain.set("channels", channels);
        return retValue;
    };

    const findChannelByName = (channelName) => {
        // returns channel object or undefined
        const channels = robot.brain.get("channels");
        return channels.find((channel) => channel.name === channelName);
    };

    const findOrCreateChannel = (channelName) => {
        let channel = findChannelByName(channelName);
        if (channel === undefined) {
            modifyChannels((channels) => {
                channel = Channel.newChannel(channelName);
                channels.push(channel);
            });
        }
        return channel;
    };
    
    const setChannelOwner = (channelName, userId) => {
        // If the channel already exists, modifies its owner
        // otherwise creates it and sets owner
        const channel = findOrCreateChannel(channelName);
        modifyChannels((channels) => {
            channel.ownerId = userId;
        });
    };

    const getChannelOwner = (channelName) => {
        // returns owner as instance of User
        // or undefined if there is no such channel or has no owner
        assert(typeof channelName === "string");
        const channel = findChannelByName(channelName);
        if (channel !== undefined && channel.ownerId !== undefined) {
            return robot.brain.userForId(channel.ownerId);
        }
    };

    const mentionUser = (user) => {
        // takes an instance of User as the argument
        // returns a string that should look like a mention in slack
        if (user === undefined || user === null) {
            return "[no such user]";
        }
        return `<@${user.id}>`;
    };

    const mentionSuperuser = () => {
        // returns a string always
        const uid = getSuperuserId();
        if (uid === undefined) {
            return mentionUser(undefined);
        }
        return mentionUser(robot.brain.userForId(uid));
    };

    const getSuperuserId = () => {
        // returns the id of superuser of undefined if there is no superuser
        const superuserId = robot.brain.get("superuserId");
        if (superuserId !== null && superuserId !== undefined) {
            return superuserId;
        }
    };

    const setSuperuserId = (userId) => {
        // returns true if set
        // returns false otherwise (if they are already set as superuser)
        const superuserId = robot.brain.get("superuserId");
        if (superuserId !== userId) {
            robot.brain.set("superuserId", userId);
            return true;
        }
        return false;
    };

    const isSuperuser = (userId) => {
        const superuserId = robot.brain.get("superuserId");
        return superuserId === userId;
    };

    const findSlackApiChannel = (predicate) => {
        // returns either a Channel object
        // (not Channel defined by me, but by node-slack-sdk)
        // or undefined if it does not exist
        const channels = Object.values(
            robot.adapter.client.rtm.dataStore.channels
        );
        return channels.find(predicate);
    };

    const getSlackApiChannelByName = (channelName) => {
        return findSlackApiChannel((channel) => channel.name === channelName);
    };

    const getSlackApiChannelById = (id) => {
        return findSlackApiChannel((channel) => channel.id === id);
    };

    const channelExistsInSlack = (channelName) => {
        return getSlackApiChannelByName(channelName) !== undefined;
    };

    const allowedForSuperuserOrPrimaryOwner = (res, func) => {
        // Does something only if the user is the superuser
        // or the primary owner
        // otherwise replies with an error and does nothing
        // func can return anything
        // if successful, returns the return value of func
        // otherwise returns undefined
        const allowed = (
            res.message.user.is_primary_owner ||
                isSuperuser(res.message.user.id)
        );
        if (allowed) {
            return func();
        }
        res.reply(
            `This command is allowed only for the superuser ` +
                `(${mentionSuperuser()}) and the primary owner.`
        );
        return undefined;
    };
    
    const allowedForChannelOwnerAndSuperuser = (res, channelName, func) => {
        // Does something only if the user is the superuser
        // or the channel's owner
        // otherwise replies with an error and does nothing
        // func can return anything
        // if successful, returns the return value of func
        // otherwise returns undefined
        const channelOwner = getChannelOwner(channelName); // instance of User or undefined
        const superuserId = getSuperuserId();
        const allowed = (
            (
                channelOwner !== undefined &&
                res.message.user.id === channelOwner.id
            ) ||
            isSuperuser(res.message.user.id)
        );
        if (allowed) {
            return func();
        }
        res.reply(
            `This command is only allowed for the owner of #${channelName} ` +
            `(${mentionUser(channelOwner)}) and for the superuser ` +
            `(${mentionSuperuser()}).`
        );
        return undefined;
    };

    const logInModeration = (message) => {
        const channelName = robot.brain.get("moderationLogChannel");
        if (
            channelExistsInSlack(channelName) &&
            getSlackApiChannelByName(channelName).is_member
        ){
            robot.messageRoom(channelName, message);
        }
        else {
            robot.logger.info(
                `Wanted to log in #${channelName}, but I can't. ` +
                `Logging here instead: ` +
                message
            );
        }
    };

    const messageSuperuser = (message) => {
        // returns true on success
        // false on fail (if there is no superuser)
        let superuserId = getSuperuserId();
        if (superuserId !== undefined) {
            robot.messageRoom(superuserId, message);
            return true;
        }
        else {
            return false;
        }
    };

    robot.brain.on("connected", () => {
        // this event is emitted when hubot-redis-brain
        // loads brain state from redis or initializes it
        // if it was empty before
        // see https://goo.gl/4PK56K
        const channels = robot.brain.get("channels");
        if (channels === undefined || channels === null) {
            robot.logger.debug("Setting channels to a new empty array");
            robot.brain.set("channels", []);
        }
        else {
            // when brain is saved to redis, objects' prototypes
            // are lost, everything is converted to plain js objects
            // so we must convert channels to instances of Channel
            robot.brain.set("channels", channels.map((obj) => new Channel(obj)));
        }
        if (
            robot.brain.get("moderationLogChannel") === null ||
            robot.brain.get("moderationLogChannel") === undefined
        ) {
            robot.brain.set("moderationLogChannel", "moderation");
            robot.logger.info(
                `Set moderationLogChannel to ` +
                `#${robot.brain.get("moderationLogChannel")}.`
            );
        }
        if (! channelExistsInSlack(robot.brain.get("moderationLogChannel"))) {
            // the moderation log channel is set but does not exist in slack
            robot.logger.warning(
                `moderationLogChannel is set to ` +
                `#${robot.brain.get("moderationLogChannel")}, ` +
                `but it doesn't exist in slack. ` +
                `Moderation actions logging won't work.`
            );
        }
    });

    robot.respond(/set_superuser @(.+)/, (res) => {
        allowedForSuperuserOrPrimaryOwner(res, () => {
            const user = robot.brain.userForName(res.match[1]);
            const success = setSuperuserId(user.id);
            if (success) {
                res.reply(`Set ${mentionUser(user)} as the superuser.`);
            }
            else {
                res.reply(`${mentionUser(user)} is already the superuser.`);
            }
        });
    });

    robot.respond(/get_superuser/, (res) => {
        const superuserId = getSuperuserId();
        let message;
        if (superuserId !==  undefined) {
            message = `${mentionUser(robot.brain.userForId(superuserId))} is the superuser.`;
        }
        else {
            message = "Superuser is not set."
        }
        res.reply(message);
    });
    
    robot.respond(/set_channel_owner #(.+) @(.+)/, (res) => {
        const channelName = res.match[1];
        allowedForChannelOwnerAndSuperuser(res, channelName, () => {
            const user = robot.brain.userForName(res.match[2]);
            const uid = user.id;
            setChannelOwner(channelName, uid);
            res.reply(`Set #${channelName}'s owner to ${mentionUser(user)}`);
        });
    });

    robot.respond(/get_channel_owner #(.+)/, (res) => {
        const channel = res.match[1];
        const owner = getChannelOwner(res.match[1]);
        let message;
        if (owner === undefined) {
            message = `#${channel} has no owner`;
        }
        else {
            message = `#${channel}'s owner is ${mentionUser(owner)}`;
        }
        res.reply(message);
    });

    robot.respond(/ban_local #(.+) @(.+)/, (res) => {
        const channelName = res.match[1];
        allowedForChannelOwnerAndSuperuser(res, channelName, () => {
            const user = robot.brain.userForName(res.match[2]);
            robot.logger.debug(
                `Executing ban_local, channelName = '${channelName}' ` +
                `user = '${user}'`
            );
            if (user === undefined || user === null) {
                res.reply(`There is no such user: '@${res.match[2]}'`);
                return;
            }
            const channel = findOrCreateChannel(channelName);
            if (channel.ban(user.id)) {
                res.reply(`Banned ${mentionUser(user)} in #${channelName}`);
                robot.messageRoom(user.id, `Вас забанили в #${channelName}. Так как в слаке технически невозможно забанить пользователя в определенном канале, если вы там что-нибудь напишете или поставите эмодзи, я (бот) сообщу об этом админу, и он временно забанит вас глобально в наказание. Такая система нужна, чтобы у пользователей была причина соблюдать локальные баны.`);
                logInModeration(`${mentionUser(user)} забанен в #${channelName}.`);
            }
            else {
                res.reply(
                    `${mentionUser(user)} is already banned in #${channelName}`
                );
            }
        });
    });

    robot.respond(/unban_local #(.+) @(.+)/, (res) => {
        const channelName = res.match[1];
        allowedForChannelOwnerAndSuperuser(res, channelName, () => {
            const user = robot.brain.userForName(res.match[2]);
            const channel = findChannelByName(channelName);
            let message;
            if (channel !== undefined && channel.unban(user.id)) {
                res.reply(`Unbanned ${mentionUser(user)} in #${channelName}`);
                robot.messageRoom(
                    user.id,
                    `Вас разбанили в #${channelName}. Теперь вы можете туда ` +
                    `писать, и вас за это не забанят.`
                );
                logInModeration(`${mentionUser(user)} разбанен в #${channelName}.`);
            }
            else {
                res.reply(`${mentionUser(user)} isn't banned in #${channelName}`);
            }
        });
    });

    robot.respond(/set_moderation_channel #(.+)/, (res) => {
        allowedForSuperuserOrPrimaryOwner(res, () => {
            const channelName = res.match[1];
            if (channelExistsInSlack(channelName)) {
                robot.brain.set("moderationLogChannel", "moderation");
                const message = `Set moderationLogChannel to #${moderationLogChannel}.`
                robot.logger.info(message);
                res.reply(message);
            }
            else {
                res.reply(`Didn't set, because #${moderationLogChannel} doesn't exist in slack.`);
            }
        });
    });

    robot.hear(/[\s\S]*/, (res) => { // regex matches everything
        if (
            res.message === undefined || res.message.room === undefined ||
            res.message.user === undefined
        ) {
            return;
        }
        const channelId = res.message.room;
        //robot.logger.debug(`heard message in channel with id ${channelId}.`);
        const channelSlackApi = getSlackApiChannelById(channelId);
        if (channelSlackApi === undefined || channelSlackApi === null) {
            // it may be undefined if it's a direct message
            return;
        }
        const channelName = channelSlackApi.name;
        robot.logger.debug(`Heard something in #${channelName}`);
        const userId = res.message.user.id;
        const channel = findChannelByName(channelName);
        if (channel !== undefined && channel.isBanned(userId)) {
            robot.messageRoom(
                userId,
                `Вы оставили сообщение в #${channelName}. ` +
                `Ранее вас там забанили, вам запрещено туда писать. ` +
                `Администратор будет уведомлен.`
            );
            // WARN SUPERUSER OR PRIMARY OWNER
            const message = `${mentionUser(robot.brain.userForId(userId))} ` +
                `что-то написал в #${channelName}. Он там забанен.`;
            const warnedSuperuser = messageSuperuser(message);
            const owner = getChannelOwner(channel.name);
            robot.logger.debug(`owner = ${mentionUser(owner)}`);
            if (owner !== undefined) {
                robot.messageRoom(
                    owner.id,
                    message + ` Уведомил ли я суперюзера? ` +
                    `Ответ = ${warnedSuperuser}.`
                );
            }
        }
    });

    robot.respond(/kill_yourself/, (res) => {
        allowedForSuperuserOrPrimaryOwner(res, () => {
            const userId = res.message.user.id;
            res.reply("Делаю харакири");
            robot.logger.info("Rebooting as requested by ${userId}");
            const timeMilliseconds = 1000;
            setTimeout(() => process.exit(0), timeMilliseconds);
        });
    });
};
