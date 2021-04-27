const Discord = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class EmbedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'embed',
			group: 'admin',
			memberName: 'embed',
			description: 'Post embed in #channel',
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling:{
                usages: 2,
                duration: 10,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'channel',
                    prompt: 'Target channel.',
                    type: 'channel',
                },
                {
                    key: 'color',
                    prompt: 'Embed color. Must be an hexadecimal value.',
                    type: 'string'
                },
                {
                    key: 'body',
                    prompt: 'Message to be displayed.',
                    type: 'string',
                    default: '',
                },
            ],
		});
	}

    async run(message, {channel, color, body}){
        let isHex = /\#[0-9A-Fa-f]{6}/g;
        if(isHex.test(color)){
            let e = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(body);
            let image = message.attachments.first();
            if(image){
                e.setImage(image.url);
            }
            return channel.send(e);
        }else{
            message.say("Color must be expressed using a hexadecimal value. Example: `#ff00ff`.");
        }
    }
};