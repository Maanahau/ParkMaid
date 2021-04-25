const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

module.exports = class SetActivityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setactivity',
			group: 'owner',
			memberName: 'setactivity',
			description: 'Set bot\'s activity.',
            ownerOnly: true,
            argsPromptLimit: 0,
            args:[
                {
                    key: 'text',
                    prompt: 'text to show on the bot\'s activity',
                    type: 'string'
                },
            ]
		});
	}

    async run(message, {text}){
        message.client.user.setActivity(text);
        let configPath = path.resolve(__dirname, '../../config.json');
        let config = JSON.parse(fs.readFileSync(configPath).toString());
        config.ACTIVITY = text;
        fs.writeFileSync(configPath, JSON.stringify(config));
        return message.say(`Activity set to \`${text}\``);
    }
    
};