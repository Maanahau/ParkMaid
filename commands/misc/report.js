const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

module.exports = class ReportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'report',
			group: 'misc',
			memberName: 'report',
			description: 'Send anonymous message to the mod team',
            guildOnly: false,
            throttling:{
                usages: 1,
                duration: 300,
            },
            argsPromptLimit: 0,
            args:[
                {
                    key: 'report',
                    prompt: 'report',
                    type: 'string'
                },
            ],
		});
	}

    async run(message, {report}){
        try{
            let configPath = path.resolve(__dirname, '../../config.json');
            let config = JSON.parse(fs.readFileSync(configPath).toString())

            if(!config.REPORT_CHANNEL){
                return message.say('Reports system not correctly configured. Please contact the server admin.');
            }

            let now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

            let e = new Discord.MessageEmbed()
                .setColor('#c7c7c3')
                .setTitle('Anonymous report')
                .setDescription(report)
                .setFooter(now);

            let channel = message.client.channels.cache.get(config.REPORT_CHANNEL);
            console.log(`Report delivered [${now}]`);
            channel.send(e);
            return message.say(`Report sent.`);
        }catch(error){
            console.log(error);
        }
    }
};