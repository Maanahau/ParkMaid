const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

module.exports = class EnableReportsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enablereports',
			group: 'owner',
			memberName: 'enablereports',
			description: 'Set this server to be the one receiving reports in the specified channel.',
            guildOnly: true,
            ownerOnly: true,
            argsPromptLimit: 0,
            args:[
                {
                    key: 'channel',
                    prompt: 'Channel where you want to receive anonymous reports.',
                    type: 'channel'
                },
            ]
		});
	}

    async run(message, {channel}){
        try{
            let channelId = channel.id;
            let configPath = path.resolve(__dirname, '../../config.json');
            let config = JSON.parse(fs.readFileSync(configPath).toString());
            config.REPORT_CHANNEL = channelId;
            fs.writeFileSync(configPath, JSON.stringify(config));
            return message.say(`${message.guild.name} will now receive anonymous reports in <#${channelId}>.`);
        }catch(error){
            console.log(error);
        }
    }
};